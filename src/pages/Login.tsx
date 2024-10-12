import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '@/context/AuthContext';
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const description =
  "A login form with email and password. There's an option to login with Google and a link to sign up if you don't have an account.";

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Hardcoded credentials for demonstration
    const hardcodedCredentials = {
        admin: { email: 'admin@example.com', password: 'adminPass' },
        customer: { email: 'customer@example.com', password: 'customerPass' }
    };

    // Check if entered credentials match any of the hardcoded ones
    if (
        (email === hardcodedCredentials.admin.email && password === hardcodedCredentials.admin.password) ||
        (email === hardcodedCredentials.customer.email && password === hardcodedCredentials.customer.password)
    ) {
        // Mock login logic: set user role based on email
        const userRole = email === hardcodedCredentials.admin.email ? 'admin' : 'customer';

        // Create a mock token
        const token = JSON.stringify({ role: userRole, email });

        // Store the mock token
        localStorage.setItem('token', token);

        // Redirect based on user role
        const redirectPath = userRole === 'admin' ? '/admin/dashboard' : '/';
        navigate(redirectPath);
    } else {
        console.error('Login failed: Incorrect email or password');
        alert('Login failed: Incorrect email or password');
    }
};

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLogin}>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="text" // Changed type to 'text' since credentials are not actual emails
                placeholder="Enter your username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <Link to="/" className="ml-auto inline-block text-sm underline">
                  Forgot your password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Login
            </Button>
            <Button variant="outline" className="w-full">
              Login with Google
            </Button>
          </div>
        </form>
        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?{' '}
          <Link to="/signup" className="underline">
            Sign up
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export default LoginForm;
