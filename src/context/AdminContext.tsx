// src/context/AdminContext.tsx
import React, { createContext, useState, ReactNode } from 'react';

// Define types
interface AdminContextType {
  users: any[]; // Replace 'any' with a proper user type
  fetchUsers: () => void;
}

export const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<any[]>([]); // Initialize with an empty array

  const fetchUsers = () => {
    // Logic to fetch users from an API or database
  };

  return (
    <AdminContext.Provider value={{ users, fetchUsers }}>
      {children}
    </AdminContext.Provider>
  );
};
