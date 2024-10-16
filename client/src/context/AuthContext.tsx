import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define the role type
type Role = 'admin' | 'customer' | null;

type AuthContextType = {
  role: Role;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<Role | null>(null);

  useEffect(() => {
    console.log('AuthProvider mounted');
    const savedRole = sessionStorage.getItem('role');
    const token = sessionStorage.getItem('token');

    if (savedRole && token) {
      console.log('Restoring role from sessionStorage:', savedRole);
      setRole(savedRole as Role);
    }
  }, []);

  const login = async (email: string, password: string) => {
    console.log('Attempting login...');
    try {
      const response = await fetch('http://localhost:5500/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      const { role, token } = data; // Extract only the role and token from the response
      sessionStorage.setItem('role', role);   // Store role in sessionStorage
      sessionStorage.setItem('token', token); // Store token in sessionStorage
      
      setRole(role); // Set the role in state
      console.log('Role after login:', role); // Log the role to ensure it's set correctly
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const logout = () => {
    console.log('Logging out...');
    setRole(null);
    sessionStorage.removeItem('role');
    sessionStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
