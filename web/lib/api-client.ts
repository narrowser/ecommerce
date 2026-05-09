const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:80';

export async function apiClient<T = any>(path: string, options?: RequestInit): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.error || 'Request failed');
  return json;
}
