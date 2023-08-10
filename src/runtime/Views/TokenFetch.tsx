export async function loadToken(credentials) {
  // Send credentials to Express.
  await fetch("http://localhost:3002/set-credentials", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(credentials)
  });

  // Generate token and get sites
  const response = await fetch("http://localhost:3002/data");
  const data = await response.json();

  return data;
}
