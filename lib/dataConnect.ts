export async function executeGraphQL(query: string, variables: any = {}) {
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'cs-properties-9742d';
  const dataConnectUrl = process.env.NODE_ENV === 'development'
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
    throw new Error(`GraphQL Error: ${JSON.stringify((result as any).errors || result)}`);
  }
  return (result as any).data;
}
