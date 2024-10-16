// src/routes/AppRoutes.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from '../pages/Login';
import Home from '@/pages/Home';
import Dashboard from '@/admin/AdminDashboard';

// other imports...

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      {/* Admin Routes */}
      <Route path="/admin/dashboard" element={<Dashboard />} />
      {/* other routes... */}
    </Routes>
  );
};

export default AppRoutes;
