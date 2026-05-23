// src/context/AuthContext.jsx
// Provides user auth state, login/signup/logout/updateProfile actions.
// Added: `loading` boolean so AdminRoute can wait before redirecting.
import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';
import { apiLogin, apiSignup, apiUpdateProfile } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Initialise synchronously from localStorage
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true); // true until hydration finishes

  // Hydrate once on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('sb_user');
      if (saved) setUser(JSON.parse(saved));
    } catch {
      localStorage.removeItem('sb_user');
    } finally {
      setLoading(false);
    }
  }, []);

  const persist = (u) => {
    setUser(u);
    if (u) localStorage.setItem('sb_user', JSON.stringify(u));
    else    localStorage.removeItem('sb_user');
  };

  const login = useCallback(async (email, password) => {
    const data = await apiLogin(email, password);
    persist({ ...data.user, token: data.token });
  }, []);

  const signup = useCallback(async (name, email, password, institution) => {
    const data = await apiSignup(name, email, password, institution);
    persist({ ...data.user, token: data.token });
  }, []);

  const updateProfile = useCallback(async (updates) => {
    const data = await apiUpdateProfile({ ...user, ...updates });
    persist({ ...data.user, token: user.token });
  }, [user]);

  const logout = useCallback(() => persist(null), []);

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};