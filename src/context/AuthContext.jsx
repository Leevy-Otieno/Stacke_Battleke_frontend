/**
 * useAuth — authentication state management
 *
 * Persists the JWT in localStorage under "sb_token".
 * On mount it tries to re-hydrate the session via GET /api/auth/me.
 */

import { useState, useEffect, createContext, useContext } from "react";
import { auth as authApi, setToken, clearToken, getToken } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true); // true while re-hydrating

  // Re-hydrate session on first load
  useEffect(() => {
    const token = getToken();
    if (!token) { setLoading(false); return; }

    authApi.me()
      .then((data) => setUser(data))
      .catch(() => clearToken())
      .finally(() => setLoading(false));
  }, []);

  async function login(email, password) {
    const data = await authApi.login({ email, password });
    setToken(data.token);
    setUser(data.user);
    return data.user;
  }

  async function register(formData) {
    const data = await authApi.register(formData);
    setToken(data.token);
    setUser(data.user);
    return data.user;
  }

  function logout() {
    clearToken();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}