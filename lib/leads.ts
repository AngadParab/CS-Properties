import { executeGraphQL } from './dataConnect';

export function isValidTransition(current: string, next: string): boolean {
  if (current === next) return true;

  const order = ['NEW', 'CONTACTED', 'SITE_VISIT_SCHEDULED', 'UNDER_NEGOTIATION'];
  const currentIndex = order.indexOf(current);

  if (currentIndex === -1) {
    // Terminal states (CLOSED_WON / CLOSED_LOST) cannot transition further
    return false;
  }

  if (current === 'UNDER_NEGOTIATION') {
    return next === 'CLOSED_WON' || next === 'CLOSED_LOST';
  }

  return order[currentIndex + 1] === next;
}

export async function updateLeadStatus(
  leadId: string,
  newStatus: 'NEW' | 'CONTACTED' | 'SITE_VISIT_SCHEDULED' | 'UNDER_NEGOTIATION' | 'CLOSED_WON' | 'CLOSED_LOST',
  actorId: string,
  comment: string
): Promise<any> {
  // 1. Fetch current lead status
  const leadQuery = `
    query GetLead($id: UUID!) {
      lead(id: $id) {
        status
      }
    }
  `;
  const leadData = await executeGraphQL(leadQuery, { id: leadId });
  if (!leadData?.lead) {
    throw new Error(`Lead with ID ${leadId} not found.`);
  }

  const currentStatus = leadData.lead.status;

  // 2. Validate transition
  if (!isValidTransition(currentStatus, newStatus)) {
    throw new Error(`Invalid status transition from ${currentStatus} to ${newStatus}.`);
  }

  // 3. Atomically update lead and append activity
  const updateMutation = `
    mutation UpdateLeadAndAddActivity(
      $leadId: UUID!
      $newStatus: LeadStatus!
      $actorId: UUID!
      $comment: String!
    ) {
      lead_update(id: $leadId, data: { status: $newStatus })
      activity_insert(data: {
        leadId: $leadId
        actorId: $actorId
        type: STATUS_CHANGE
        comment: $comment
      })
    }
  `;

  const result = await executeGraphQL(updateMutation, {
    leadId,
    newStatus,
    actorId,
    comment,
  });

  return result;
}
