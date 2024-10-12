import { useState, useEffect } from 'react';
import { Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';

import Dashboard from '@/admin/AdminDashboard'; // Adjusted import
import Customer from '@/pages/Home'; // Adjusted import
import NotFound from '@/error/NotFound'; // Ensure this is correct

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loginMode, setLoginMode] = useState('customer'); // Default login mode
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      const decodedToken = jwtDecode<{ email: string; role: string }>(token);
      const userRole = decodedToken.role;
      setLoginMode(userRole);

      const redirectPath = userRole === 'admin' ? '/admin/dashboard' : '/customer';
      navigate(redirectPath);
    } else {
      navigate('/');
    }
  }, [navigate]);

  const handleLogin = () => {
    // Hardcoded credentials for each role
    const adminCredentials = { username: 'adminUser', password: 'adminPass' };
    const customerCredentials = { username: 'customerUser', password: 'customerPass' };

    // Check if the entered credentials match any of the hardcoded ones
    if (
      (username === adminCredentials.username && password === adminCredentials.password && loginMode === 'admin') ||
      (username === customerCredentials.username && password === customerCredentials.password && loginMode === 'customer')
    ) {
      // Generate a mock token based on the role
      const token = loginMode === 'admin'
        ? 'mockedAdminToken'
        : 'mockedCustomerToken';

      localStorage.setItem('token', token);

      const decodedToken = { role: loginMode }; // Mock decoded token
      const redirectPath =
        decodedToken.role === 'admin'
          ? '/admin/dashboard'
          : '/customer';

      navigate(redirectPath);
    } else {
      // Handle authentication error
      alert('Authentication failed');
      console.error('Authentication failed');
    }
  };

  return (
    <div className='Auth'>
      <h1>{loginMode === 'admin' ? 'Admin Login' : 'Customer Login'}</h1>
      <div className='Auth__Input'>
        <input
          type='text'
          placeholder='Username'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type='password'
          placeholder='Password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLogin}>Login</button>
      </div>
      <Routes>
        <Route path='/admin/*' element={<Dashboard />} />
        <Route path='/customer/*' element={<Customer />} />
        <Route path='/*' element={<NotFound />} />
      </Routes>
    </div>
  );
};

export default Auth;
