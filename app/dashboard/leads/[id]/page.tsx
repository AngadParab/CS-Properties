import { executeGraphQL } from '@/lib/dataConnect';
import LeadDetailView from '@/components/LeadDetailView';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

interface PageParams {
  params: Promise<{
    id: string;
  }>;
}

export default async function LeadDetailPage({ params }: PageParams) {
  const { id } = await params;

  const query = `
    query GetLead($id: UUID!) {
      lead(id: $id) {
        id
        fullName
        email
        phone
        status
        budget
        notes
        source
        property {
          id
          title
          price
        }
        assignedTo {
          id
          name
          role
        }
        createdAt
      }
      activities(where: { lead: { id: { eq: $id } } }) {
        id
        actor {
          id
          name
          role
        }
        type
        comment
        createdAt
      }
    }
  `;

  let lead = null;
  let activities = [];

  try {
    const data = await executeGraphQL(query, { id });
    lead = data?.lead || null;
    activities = data?.activities || [];
  } catch (err) {
    console.error('Error fetching lead detail:', err);
  }

  if (!lead) {
    redirect('/dashboard/leads');
  }

  return (
    <div className="flex-1 overflow-auto bg-zinc-950">
      <LeadDetailView lead={lead} activities={activities} />
    </div>
  );
}
