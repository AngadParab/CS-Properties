'use server';

import { updateLeadStatus } from '@/lib/leads';
import { revalidatePath } from 'next/cache';
import { getCurrentUser } from '@/lib/auth';

export async function progressLeadAction(
  leadId: string,
  newStatus: 'NEW' | 'CONTACTED' | 'SITE_VISIT_SCHEDULED' | 'UNDER_NEGOTIATION' | 'CLOSED_WON' | 'CLOSED_LOST',
  comment: string
) {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('Unauthorized');
  }

  try {
    await updateLeadStatus(leadId, newStatus, user.uid, comment);
    revalidatePath('/dashboard/leads');
    return { success: true };
  } catch (error: any) {
    console.error('Server action error:', error);
    return { success: false, error: error.message || 'Failed to update lead status.' };
  }
}
