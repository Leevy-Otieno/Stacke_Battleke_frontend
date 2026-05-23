/**
 * src/context/AuthContext.jsx
 *
 * ── What was broken ─────────────────────────────────────────────────────────
 *
 * 1. IMPORT FROM WRONG PATH
 *    Old code: import { auth as authApi, setToken, clearToken, getToken } from "../services/api"
 *    That path is correct BUT the old api.js auth.login() was storing the whole
 *    response object in "sb_user" AND the token in "sb_token". Then getToken()
 *    read "sb_user" first, parsed it as JSON, and tried to pull .token out of
 *    an object. After a page refresh that produced undefined for the Bearer header.
 *    Fix: api.js now stores only the raw token string in "sb_token". AuthContext
 *    no longer needs to do any parsing — it just calls auth.me() to re-hydrate.
 *
 * 2. login() RETURNED data.user BUT auth.me() RETURNED THE USER DIRECTLY
 *    The backend's GET /api/auth/me uses marshmallow schema.jsonify() which
 *    returns the user object directly (not wrapped in { data: user }).
 *    Old setUser(data) was setting the whole response — which is correct for
 *    /auth/me but the shape was inconsistent with what login returned.
 *    Fix: auth.me() in api.js returns data (the user directly). login/register
 *    return { token, user } and we call setUser(data.user). Consistent.
 *
 * 3. NO LOADING GUARD IN ProtectedRoute
 *    If AuthContext was still hydrating (loading=true), ProtectedRoute checked
 *    !user and immediately redirected to /login, then the hydration finished
 *    and the user was back on /login even though they had a valid session.
 *    Fix: AuthContext exports loading; ProtectedRoute (unchanged, it already
 *    checks loading) just needs AuthContext to set it correctly, which it now does.
 */

import { useState, useEffect, createContext, useContext } from "react";
import { auth as authApi, setToken, clearToken, getToken } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true); // true while re-hydrating from localStorage

  // On first mount: if there's a token in localStorage, validate it with /auth/me
  useEffect(() => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }
    authApi.me()
      .then((userData) => {
        // /auth/me returns the user object directly (marshmallow schema.jsonify)
        setUser(userData);
      })
      .catch(() => {
        // Token is expired or invalid — clear it silently
        clearToken();
      })
      .finally(() => setLoading(false));
  }, []);

  // Login: backend returns { token, user }
  async function login(email, password) {
    const data = await authApi.login({ email, password });
    // api.js auth.login() already stored the token
    setUser(data.user);
    return data.user;
  }

  // Register: backend returns { token, user }
  async function register(formData) {
    const data = await authApi.register(formData);
    // api.js auth.register() already stored the token
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

// Named export alias so both import styles work:
//   import { useAuth } from '../context/AuthContext'
//   import { AuthProvider } from '../context/AuthContext'
export default AuthProvider;