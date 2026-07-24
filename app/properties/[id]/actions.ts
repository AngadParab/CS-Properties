'use server';

import { executeGraphQL } from '@/lib/dataConnect';
import { z } from 'zod';

const inquirySchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Phone is required'),
  budget: z.number().min(0, 'Budget must be positive'),
  notes: z.string().optional(),
});

export async function submitInquiryAction(propertyId: string, formData: any) {
  try {
    const payload = inquirySchema.parse(formData);

    let assignedToId: string | null = null;

    // 1. Fetch property listing agent
    try {
      const agentData = await executeGraphQL(`
        query GetPropertyAgent($id: UUID!) {
          property(id: $id) {
            agent {
              id
            }
          }
        }
      `, { id: propertyId });

      if (agentData?.property?.agent?.id) {
        assignedToId = agentData.property.agent.id;
      }
    } catch (err) {
      console.warn('Listing agent lookup failed in public inquiry:', err);
    }

    // 2. Fallback round-robin load balancer to admin
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

        const sortedAdmins = admins
          .map((admin: any) => ({ id: admin.id, count: leadCounts[admin.id] }))
          .sort((a: any, b: any) => a.count - b.count);

        assignedToId = sortedAdmins[0].id;
      }
    }

    // 3. Create lead record
    const insertLeadMutation = `
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

    await executeGraphQL(insertLeadMutation, {
      fullName: payload.fullName,
      email: payload.email,
      phone: payload.phone,
      status: 'NEW',
      budget: payload.budget,
      notes: payload.notes || null,
      source: 'web_inquiry',
      propertyId,
      assignedToId,
    });

    return { success: true };
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0]?.message || 'Validation error' };
    }
    console.error('Inquiry submission error:', error);
    return { success: false, error: error.message || 'Failed to submit inquiry.' };
  }
}
