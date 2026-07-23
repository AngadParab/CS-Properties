import * as functions from 'firebase-functions';
import { z } from 'zod';

const leadIngestSchema = z.object({
  fullName: z.string().min(1, 'fullName is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'phone is required'),
  budget: z.number().min(0, 'budget must be positive'),
  notes: z.string().optional(),
  source: z.string().optional(),
  propertyId: z.string().uuid('Invalid propertyId format').optional(),
});

async function executeGraphQL(query: string, variables: any = {}) {
  const projectId = process.env.GCLOUD_PROJECT || 'cs-properties-9742d';
  const dataConnectUrl = process.env.FUNCTIONS_EMULATOR === 'true'
    ? `http://127.0.0.1:9399/v1/projects/${projectId}/locations/us-central1/services/cs-properties-crm/graphql`
    : `https://us-central1-dataconnect.googleapis.com/v1/projects/${projectId}/locations/us-central1/services/cs-properties-crm/graphql`;

  const response = await fetch(dataConnectUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query, variables }),
  });

  const result = await response.json();
  if (!response.ok || (result as any).errors) {
    throw new Error(`GraphQL Error: ${JSON.stringify((result as any).errors || result)}`);
  }
  return (result as any).data;
}

export const ingestLead = functions.https.onRequest(async (req, res) => {
  // CORS configuration
  res.set('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') {
    res.set('Access-Control-Allow-Methods', 'POST');
    res.set('Access-Control-Allow-Headers', 'Content-Type, x-webhook-secret');
    res.status(204).send('');
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  // Webhook secret validation
  const webhookSecret = req.headers['x-webhook-secret'];
  const expectedSecret = process.env.FIREBASE_WEBHOOK_SECRET;
  if (!webhookSecret || webhookSecret !== expectedSecret) {
    console.error('Unauthorized: webhook secret mismatch');
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  try {
    // Payload validation
    const payload = leadIngestSchema.parse(req.body);

    let assignedToId: string | null = null;

    // 1. Query property's agent if propertyId is provided
    if (payload.propertyId) {
      try {
        const propertyAgentData = await executeGraphQL(`
          query GetPropertyAgent($id: UUID!) {
            property(id: $id) {
              agent {
                id
              }
            }
          }
        `, { id: payload.propertyId });

        if (propertyAgentData?.property?.agent?.id) {
          assignedToId = propertyAgentData.property.agent.id;
          console.log(`Assigned lead to listing agent: ${assignedToId}`);
        }
      } catch (err) {
        console.warn(`Failed to retrieve listing agent for property ${payload.propertyId}:`, err);
      }
    }

    // 2. Fallback round-robin assignment to admin with least leads
    if (!assignedToId) {
      const adminsData = await executeGraphQL(`
        query GetAdmins {
          users(where: { role: { eq: ADMIN } }) {
            id
          }
        }
      `);

      const admins = adminsData?.users || [];
      if (admins.length > 0) {
        const leadsData = await executeGraphQL(`
          query GetLeadsAssignment {
            leads {
              assignedTo {
                id
              }
            }
          }
        `);
        const leads = leadsData?.leads || [];

        const leadCounts: Record<string, number> = {};
        admins.forEach((admin: any) => {
          leadCounts[admin.id] = 0;
        });

        leads.forEach((lead: any) => {
          const adminId = lead.assignedTo?.id;
          if (adminId && adminId in leadCounts) {
            leadCounts[adminId]++;
          }
        });

        // Find admin with least leads
        const sortedAdmins = admins
          .map((admin: any) => ({ id: admin.id, count: leadCounts[admin.id] }))
          .sort((a: any, b: any) => a.count - b.count);

        assignedToId = sortedAdmins[0].id;
        console.log(`Fallback round-robin assigned lead to admin: ${assignedToId}`);
      } else {
        console.warn('No ADMIN users found in the database. Leaving lead unassigned.');
      }
    }

    // 3. Insert lead record
    const mutation = `
      mutation CreateLead(
        $fullName: String!
        $email: String!
        $phone: String!
        $status: LeadStatus!
        $budget: Float!
        $notes: String
        $source: String
        $propertyId: UUID
        $assignedToId: UUID
      ) {
        lead_insert(data: {
          fullName: $fullName
          email: $email
          phone: $phone
          status: $status
          budget: $budget
          notes: $notes
          source: $source
          propertyId: $propertyId
          assignedToId: $assignedToId
        })
      }
    `;

    const variables = {
      fullName: payload.fullName,
      email: payload.email,
      phone: payload.phone,
      status: 'NEW',
      budget: payload.budget,
      notes: payload.notes || null,
      source: payload.source || 'webhook',
      propertyId: payload.propertyId || null,
      assignedToId: assignedToId,
    };

    const insertResult = await executeGraphQL(mutation, variables);
    res.status(201).json({ status: 'success', data: insertResult });
  } catch (err) {
    if (err instanceof z.ZodError) {
      console.error('Validation error:', err.issues);
      res.status(400).json({ error: 'Bad Request', details: err.issues });
    } else {
      console.error('Internal webhook error:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
});
