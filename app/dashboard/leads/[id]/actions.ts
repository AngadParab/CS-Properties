'use server';

import { executeGraphQL } from '@/lib/dataConnect';
import { revalidatePath } from 'next/cache';
import { getCurrentUser } from '@/lib/auth';

export async function createActivityAction(
  leadId: string,
  type: 'CALL' | 'EMAIL' | 'SITE_VISIT' | 'NOTE' | 'STATUS_CHANGE',
  comment: string
) {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('Unauthorized');
  }

  try {
    const insertActivityMutation = `
      mutation CreateActivity(
        $leadId: UUID!
        $actorId: UUID!
        $type: ActivityType!
        $comment: String!
      ) {
        activity_insert(data: {
          leadId: $leadId
          actorId: $actorId
          type: $type
          comment: $comment
        })
      }
    `;

    await executeGraphQL(insertActivityMutation, {
      leadId,
      actorId: user.uid,
      type,
      comment,
    });

    revalidatePath(`/dashboard/leads/${leadId}`);
    revalidatePath('/dashboard/leads');
    return { success: true };
  } catch (error: any) {
    console.error('Failed to create activity log:', error);
    return { success: false, error: error.message || 'Failed to create activity log.' };
  }
}
