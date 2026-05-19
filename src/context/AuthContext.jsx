import React, { createContext, useState, useContext, useCallback } from 'react';
import { apiLogin, apiSignup, apiUpdateProfile } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('sb_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const persist = (u) => {
    setUser(u);
    if (u) localStorage.setItem('sb_user', JSON.stringify(u));
    else     localStorage.removeItem('sb_user');
  };

  const login = useCallback(async (email, password) => {
    const data = await apiLogin(email, password); // throws on error
    // Save both the user data and the JWT token
    persist({ ...data.user, token: data.token });
  }, []);

  const signup = useCallback(async (name, email, password, institution) => {
    const data = await apiSignup(name, email, password, institution);
    // Save both the user data and the JWT token
    persist({ ...data.user, token: data.token });
  }, []);

  const updateProfile = useCallback(async (updates) => {
    const data = await apiUpdateProfile({ ...user, ...updates });
    // Ensure the token isn't lost when updating the profile
    persist({ ...data.user, token: user.token });
  }, [user]);

  const logout = useCallback(() => persist(null), []);

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};