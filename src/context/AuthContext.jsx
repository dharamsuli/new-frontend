import React, { createContext, useContext, useEffect, useState } from "react";
import { apiRequest } from "../lib/api";

const AuthContext = createContext(null);
const USER_KEY = "nook_native_user";
const TOKEN_KEY = "nook_native_token";

function readStoredJson(key) {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => readStoredJson(USER_KEY));
  const [token, setToken] = useState(() =>
    typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_KEY);
    }

    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  }, [user, token]);

  useEffect(() => {
    async function hydrateUser() {
      if (!token) return;

      try {
        const response = await apiRequest("/auth/me");
        setUser(response.user);
      } catch {
        setUser(null);
        setToken(null);
      }
    }

    hydrateUser();
  }, [token]);

  const signUp = async (payload) => {
    setLoading(true);
    try {
      const response = await apiRequest("/auth/register", {
        method: "POST",
        body: JSON.stringify(payload)
      });

      setUser(response.user);
      setToken(response.token);
      return response.user;
    } finally {
      setLoading(false);
    }
  };

  const login = async (payload) => {
    setLoading(true);
    try {
      const response = await apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify(payload)
      });

      setUser(response.user);
      setToken(response.token);
      return response.user;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, signUp, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  return useContext(AuthContext);
}
