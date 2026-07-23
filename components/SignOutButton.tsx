'use client';

import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

export default function SignOutButton() {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      // 1. Sign out from Firebase Auth client
      await auth.signOut();

      // 2. Clear session cookie via API
      await fetch('/api/auth/session', { method: 'DELETE' });

      // 3. Redirect and refresh state
      router.push('/login');
      router.refresh();
    } catch (error) {
      console.error('Failed to sign out:', error);
    }
  };

  return (
    <button
      onClick={handleSignOut}
      className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold text-zinc-400 hover:text-white hover:bg-zinc-800/50 transition cursor-pointer"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
      </svg>
      Sign Out
    </button>
  );
}
