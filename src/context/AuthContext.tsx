
import React, { createContext, useContext, useState, useEffect } from 'react';

// Define the user types
export type UserRole = "admin" | "common";

// Define the user interface
export interface User {
  id: string;
  username: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  isAdmin: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo users for the app
const USERS = [
  { id: "1", username: "admin", password: "admin123", role: "admin" as UserRole },
  { id: "2", username: "comum", password: "comum123", role: "common" as UserRole }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  
  // Check localStorage on mount to restore session
  useEffect(() => {
    const storedUser = localStorage.getItem("petshop-user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Login function
  const login = (username: string, password: string): boolean => {
    const foundUser = USERS.find(u => 
      u.username === username && u.password === password
    );
    
    if (foundUser) {
      const userInfo = {
        id: foundUser.id,
        username: foundUser.username,
        role: foundUser.role
      };
      
      setUser(userInfo);
      localStorage.setItem("petshop-user", JSON.stringify(userInfo));
      return true;
    }
    
    return false;
  };
  
  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem("petshop-user");
  };
  
  // Helper function to check if user is admin
  const isAdmin = (): boolean => {
    return user?.role === "admin";
  };
  
  const value = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    isAdmin
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
