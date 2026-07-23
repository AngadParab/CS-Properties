import { executeGraphQL } from '@/lib/dataConnect';
import KanbanBoard from '@/components/KanbanBoard';

export const dynamic = 'force-dynamic';

export default async function LeadsPage() {
  const query = `
    query GetLeads {
      leads {
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
        }
        assignedTo {
          id
          name
        }
        createdAt
      }
    }
  `;

  let leads = [];
  try {
    const data = await executeGraphQL(query);
    leads = data?.leads || [];
  } catch (err) {
    console.error('Error fetching leads:', err);
  }

  return (
    <div className="flex-1 flex flex-col p-8 space-y-6 overflow-hidden">
      <div className="flex justify-between items-center shrink-0">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Lead Pipeline</h1>
          <p className="text-sm text-zinc-400 mt-1">Manage and track customer stages in the pipeline</p>
        </div>
      </div>

      <KanbanBoard initialLeads={leads} />
    </div>
  );
}
