import { cookies } from 'next/headers';
import { adminAuth } from './firebaseAdmin';
import { redirect } from 'next/navigation';

export interface AuthUser {
  uid: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'AGENT';
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('__session')?.value;

    if (!sessionCookie) {
      return null;
    }

    // Verify session cookie, checkRevoked = true
    const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true);
    
    if (!decodedClaims.email || !decodedClaims.email.endsWith('@cs-properties.com')) {
      return null;
    }

    return {
      uid: decodedClaims.uid,
      email: decodedClaims.email,
      name: (decodedClaims.name as string) || decodedClaims.email.split('@')[0],
      role: (decodedClaims.role as 'ADMIN' | 'AGENT') || 'AGENT',
    };
  } catch (error) {
    console.error('Error verifying session:', error);
    return null;
  }
}

export async function requireAdmin(): Promise<AuthUser> {
  const user = await getCurrentUser();
  if (!user || user.role !== 'ADMIN') {
    redirect('/login');
  }
  return user;
}

export async function requireAgent(): Promise<AuthUser> {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/login');
  }
  return user;
}
