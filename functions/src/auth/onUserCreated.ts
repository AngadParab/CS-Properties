import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

export const onUserCreated = functions.auth.user().onCreate(async (user) => {
  const email = user.email || '';
  
  if (!email.endsWith('@cs-properties.com')) {
    console.log(`Skipping claims assignment for non-matching email domain: ${email}`);
    return;
  }

  const role = email.startsWith('admin') ? 'ADMIN' : 'AGENT';
  
  try {
    // Set Firebase custom user claims
    await admin.auth().setCustomUserClaims(user.uid, { role });
    console.log(`Successfully assigned custom claim { role: "${role}" } to user: ${user.uid}`);

    // Sync user record to PostgreSQL via Data Connect GraphQL API
    const query = `
      mutation UpsertUser($id: UUID!, $email: String!, $name: String!, $role: UserRole!, $phone: String) {
        user_upsert(data: {
          id: $id
          email: $email
          name: $name
          role: $role
          phone: $phone
        })
      }
    `;

    const variables = {
      id: user.uid,
      email: email,
      name: user.displayName || email.split('@')[0],
      role: role,
      phone: user.phoneNumber || null,
    };

    const projectId = process.env.GCLOUD_PROJECT || 'cs-properties-9742d';
    const dataConnectUrl = process.env.FUNCTIONS_EMULATOR === 'true'
      ? `http://127.0.0.1:9399/v1/projects/${projectId}/locations/us-central1/services/cs-properties-crm/graphql`
      : `https://us-central1-dataconnect.googleapis.com/v1/projects/${projectId}/locations/us-central1/services/cs-properties-crm/graphql`;

    const response = await fetch(dataConnectUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, variables }),
    });

    const result = await response.json();
    if (!response.ok || (result as any).errors) {
      console.error('Data Connect sync error:', JSON.stringify((result as any).errors || result));
      throw new Error('Failed to sync user to PostgreSQL');
    }

    console.log(`Successfully synced user ${user.uid} to PostgreSQL.`);
  } catch (err) {
    console.error('Error in onUserCreated flow:', err);
    throw err;
  }
});
