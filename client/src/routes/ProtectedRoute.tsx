import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';

const ProtectedRoute: React.FC<{ allowedTypes: string[]; children: React.ReactNode }> = ({ allowedTypes, children }) => {
  const { role } = useAuth(); // Read user from AuthContext

  // If user is not logged in, redirect to login
  if (!role) {
    const savedRole = sessionStorage.getItem('role'); // Check sessionStorage instead of localStorage
    if (!savedRole || !allowedTypes.includes(savedRole)) {
      return <Navigate to="/login" />;
    }
  }

  // If the user's role is not allowed, redirect to login
  if (role && !allowedTypes.includes(role)) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
