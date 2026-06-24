import { createContext, useContext, useEffect, useState, useCallback } from "react";
import api, { formatApiErrorDetail } from "../lib/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // null = checking, false = anonymous, object = logged in
  const [user, setUser] = useState(null);

  const fetchMe = useCallback(async () => {
    try {
      const { data } = await api.get("/auth/me");
      setUser(data);
    } catch (e) {
      setUser(false);
    }
  }, []);

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  const login = async (email, password) => {
    try {
      const { data } = await api.post("/auth/login", { email, password });
      setUser(data);
      return { ok: true };
    } catch (e) {
      return {
        ok: false,
        error: formatApiErrorDetail(e.response?.data?.detail) || e.message,
      };
    }
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (_e) {
      /* noop */
    }
    setUser(false);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, refetch: fetchMe }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
