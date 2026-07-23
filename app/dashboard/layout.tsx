import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import SignOutButton from '@/components/SignOutButton';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="flex h-screen bg-zinc-950 text-zinc-100 font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-zinc-800 bg-zinc-900/40 flex flex-col justify-between shrink-0">
        <div>
          {/* Sidebar Header */}
          <div className="h-16 flex items-center px-6 border-b border-zinc-800">
            <span className="font-extrabold text-xl bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              CS Properties
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-2">
            <Link
              href="/dashboard/leads"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold hover:bg-zinc-800/40 transition text-zinc-300 hover:text-white"
            >
              <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              Lead Pipeline
            </Link>

            <Link
              href="/dashboard/properties"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold hover:bg-zinc-800/40 transition text-zinc-300 hover:text-white"
            >
              <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Property Catalog
            </Link>
          </nav>
        </div>

        {/* User profile & signout */}
        <div className="p-4 border-t border-zinc-800 space-y-4">
          <div className="flex items-center gap-3 px-2">
            <div className="w-9 h-9 rounded-full bg-zinc-800 flex items-center justify-center font-bold text-indigo-400">
              {user.name.substring(0, 2).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-zinc-100 truncate">{user.name}</p>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-950 text-indigo-300 border border-indigo-900 mt-1">
                {user.role}
              </span>
            </div>
          </div>
          <SignOutButton />
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-zinc-950 overflow-auto">
        {children}
      </main>
    </div>
  );
}
