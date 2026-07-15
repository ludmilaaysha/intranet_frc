const API_URL = import.meta.env.VITE_API_URL ?? "172.16.0.2:3000";
const TOKEN_KEY = "terabit_access_token";
const ID_TOKEN_KEY = "terabit_id_token";

export interface AuthUser {
  sub: string;
  email?: string;
  name?: string;
  role: "user" | "admin";
}

export function startLogin(): void {
  window.location.assign(`${API_URL}/auth/login`);
}

export function getAccessToken(): string | null {
  return sessionStorage.getItem(TOKEN_KEY);
}

export function setAccessToken(token: string): void {
  sessionStorage.setItem(TOKEN_KEY, token);
}

export function clearAccessToken(): void {
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(ID_TOKEN_KEY);
}

export function logout() {

    const idToken = getIdToken();

    console.log("ID TOKEN:", idToken);

    clearAccessToken();

    if (idToken) {

        const url =
            `${API_URL}/auth/logout?id_token=${encodeURIComponent(idToken)}`;

        console.log("LOGOUT URL:", url);

        window.location.assign(url);

        return;
    }

    console.log("SEM ID TOKEN");

    window.location.assign("/");
}

export function consumeCallbackToken(): string | null {
  if (window.location.pathname !== "/auth/callback") {
    return null;
  }
  const params = new URLSearchParams(
    window.location.hash.slice(1),
  );
  const accessToken = params.get("access_token");
  const idToken = params.get("id_token");
  if (accessToken) {
    sessionStorage.setItem(
      TOKEN_KEY,
      accessToken,
    );
  }
  if (idToken) {
    sessionStorage.setItem(
      ID_TOKEN_KEY,
      idToken,
    );
  }

  return accessToken;
}

export async function getCurrentUser(
  token: string
): Promise<AuthUser> {
  const response = await fetch(`${API_URL}/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Sessão inválida ou expirada");
  }

  return response.json();
}

export function getIdToken(): string | null {
  return sessionStorage.getItem(ID_TOKEN_KEY);
}