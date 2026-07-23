import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

if (admin.apps.length === 0) {
  admin.initializeApp();
}

export const helloWorld = functions.https.onRequest((request, response) => {
  response.send("Hello from Firebase CRM Cloud Functions!");
});

export { onUserCreated } from './auth/onUserCreated';
export { ingestLead } from './leads/ingestLead';
