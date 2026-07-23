import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getStorage, connectStorageEmulator } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'mock-api-key',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'cs-properties-9742d.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'cs-properties-9742d',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'cs-properties-9742d.firebasestorage.app',
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const storage = getStorage(app);

if (process.env.NODE_ENV === 'development') {
  if (typeof window !== 'undefined') {
    // Avoid double emulator connection errors during hot reload
    if (!(auth as any)._emulatorActivated) {
      connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });
      (auth as any)._emulatorActivated = true;
    }
    if (!(storage as any)._emulatorActivated) {
      connectStorageEmulator(storage, '127.0.0.1', 9199);
      (storage as any)._emulatorActivated = true;
    }
  }
}
