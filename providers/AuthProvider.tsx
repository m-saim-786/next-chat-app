"use client";

import { LoaderIcon } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { createContext } from "react";

type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  handleLogin: (user: User) => void;
  handleLogout: () => void;
};

type User = {
  id: number;
  name: string;
  email: string;
};

const AuthContext = createContext<AuthState>({
  user: null,
  isAuthenticated: false,
  handleLogin: () => {},
  handleLogout: () => {},
});

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const handleLogin = (user: User) => {
    setUser(user);
    setIsAuthenticated(true);
    localStorage.setItem("user", JSON.stringify(user));
    setLoading(false);
  };

  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, handleLogin, handleLogout }}
    >
      {loading ? (
        <div className="flex items-center justify-center h-full">
          <LoaderIcon className="animate-pulse duration-100" size={50} />
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };

