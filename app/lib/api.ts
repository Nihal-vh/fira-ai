const API_BASE_URL = 'http://localhost:8000';

export async function fetchFromBackend(endpoint: string, options?: RequestInit) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'An error occurred' }));
    throw new Error(error.detail || 'API request failed');
  }

  return response.json();
}

export const api = {
  getUsers: () => fetchFromBackend('/users/'),
  createUser: (name: string, email: string) => 
    fetchFromBackend('/users/', {
      method: 'POST',
      body: JSON.stringify({ name, email }),
    }),
};
