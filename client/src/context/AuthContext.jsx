import { createContext, useContext, useState, useEffect } from "react";
import { loginUser, logoutUser, registerUser, getCurrentUser } from "../api/auth.api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const res = await getCurrentUser();
        setUser(res.data.user);
      } catch {
        setUser(null);
      } finally {
        setInitializing(false);
      }
    };
    checkLoggedIn();
  }, []);

  const login = async (credentials) => {
    setLoading(true);
    try {
      const res = await loginUser(credentials);
      setUser(res.data.user);
      return res.data.user;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data) => {
    setLoading(true);
    try {
      const res = await registerUser(data);
      setUser(res.data.user);
      return res.data.user;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await logoutUser();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, initializing, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);