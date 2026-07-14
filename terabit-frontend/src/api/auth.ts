const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';
const TOKEN_KEY = 'terabit_access_token';

export interface AuthUser {
  sub: string;
  email?: string;
  name?: string;
  role: 'user' | 'admin';
}

export function startLogin(): void { window.location.assign(`${API_URL}/auth/login`); }
export function getAccessToken(): string | null { return sessionStorage.getItem(TOKEN_KEY); }
export function clearAccessToken(): void { sessionStorage.removeItem(TOKEN_KEY); }
export function consumeCallbackToken(): string | null {
  if (window.location.pathname !== '/auth/callback') return null;
  const token = new URLSearchParams(window.location.hash.slice(1)).get('access_token');
  if (token) sessionStorage.setItem(TOKEN_KEY, token);
  return token;
}
export async function getCurrentUser(token: string): Promise<AuthUser> {
  const response = await fetch(`${API_URL}/auth/me`, { headers: { Authorization: `Bearer ${token}` } });
  if (!response.ok) throw new Error('Sessao invalida ou expirada');
  return response.json();
}
