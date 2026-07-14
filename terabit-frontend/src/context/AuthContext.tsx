import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { clearAccessToken, consumeCallbackToken, getAccessToken, getCurrentUser, startLogin, type AuthUser } from '../api/auth';

interface AuthContextType { isAuthenticated: boolean; isLoading: boolean; user: AuthUser | null; login: () => void; logout: () => void; }
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token] = useState(() => consumeCallbackToken() ?? getAccessToken());
  const [isLoading, setIsLoading] = useState(Boolean(token));
  useEffect(() => {
    if (!token) return;
    getCurrentUser(token).then(setUser).catch(() => clearAccessToken()).finally(() => setIsLoading(false));
  }, [token]);
  const logout = () => { clearAccessToken(); setUser(null); };
  return <AuthContext.Provider value={{ isAuthenticated: Boolean(user), isLoading, user, login: startLogin, logout }}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  return context;
}
