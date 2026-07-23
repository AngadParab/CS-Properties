import { getApps, initializeApp, getApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

// Connect to Auth emulator in development mode
if (process.env.NODE_ENV === 'development' && !process.env.FIREBASE_AUTH_EMULATOR_HOST) {
  process.env.FIREBASE_AUTH_EMULATOR_HOST = '127.0.0.1:9099';
}

const app = getApps().length === 0
  ? initializeApp({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'cs-properties-9742d',
    })
  : getApp();

export const adminAuth = getAuth(app);
