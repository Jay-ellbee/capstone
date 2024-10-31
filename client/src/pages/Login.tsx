import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext'; // Use the custom hook
import { Link } from "react-router-dom";
import { EyeIcon } from "lucide-react"
import { EyeClosedIcon } from '@radix-ui/react-icons';

export const description =
  "A login form with email and password. There's an option to login with Google and a link to sign up if you don't have an account.";

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null); // State to store error messages
  const navigate = useNavigate();
  const { login, role } = useAuth(); // Destructure login and user from useAuth

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
    } catch (error: any) {
      setError('Login failed. Please check your credentials.');
    }
  };

  // UseEffect for handling redirection after login
  useEffect(() => {
    if (role === 'super_admin') {
      navigate('/admin/dashboard');
    } else if (role === 'customer') {
      navigate('/');
    }
  }, [role, navigate]);
  
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-200">
      <div className="flex w-full max-w-4xl bg-white rounded-[20px] shadow-lg overflow-hidden">
        {/* Left - Sign In Section */}
        <div className="w-2/3 p-8 h-[100%] mt-0 mb-0">
          <h2 className="text-2xl font-bold text-center mb-6">Sign In</h2>
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <input
                id="email"
                type="text"
                placeholder="Enter Email or Username"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-4 relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter Password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-3"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeIcon className="h-5 w-5 text-gray-500" />
                ) : (
                  <EyeClosedIcon className="h-5 w-5 text-gray-500" />
                )}
              </button>
            </div>
            <div className="flex justify-between items-center text-sm mb-6">
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="form-checkbox" />
                <span>Keep me logged in</span>
              </label>
              <a href="#" className="text-gray-500">Forgot Password?</a>
            </div>
            <button
              type="submit"
              className="w-full bg-pink-400 text-white py-2 rounded-lg hover:bg-pink-600 transition-colors">
              Sign In
            </button>
          </form>
        </div>

        {/* Right - Sign Up Section */}
        <div className="w-1/3 bg-gray-100 p-8 relative h-[100%] mt-0 mb-0">
          <button className="absolute top-4 right-4 text-xl font-bold text-gray-400 hover:text-gray-600">
            <Link to="/">&times;</Link>
          </button>
          <div className="text-center">
            <div className="mb-4">
              <div className="w-16 h-16 bg-gray-200 mx-auto rounded-full"></div>
            </div>
            <h2 className="text-2xl font-bold mb-4">Hello!</h2>
            <p className="text-gray-500 mb-6">
              Register with your personal details <br />
              to use all of the site's features.
            </p>
            <button className="w-full py-2 border-2 border-gray-600 rounded-full text-gray-600 hover:bg-gray-600 hover:text-white transition-colors">
              <Link to="/signup">
                Sign up
              </Link>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
