import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { EyeIcon } from "lucide-react";
import { EyeClosedIcon } from "@radix-ui/react-icons";
import { useAuth } from "../context/AuthContext";


export const SignUpForm = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { login } = useAuth();


  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setErrorMessage("");

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_fname: firstName,
          user_lname: lastName,
          email,
          username,
          password,
          phone,
          address: ""
        }),
      });

      if (response.ok) {
        const data = await response.json();
        await login(email, password); // log in accepts email and password
        navigate("/account-set-up");
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.error || "Sign-up failed");
      }
    } catch (error) {
      setErrorMessage("An error occurred during sign-up.");
      console.error(error);
    }
  };

  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-200 p-4">
      <div className="flex w-full max-w-4xl bg-white rounded-2xl shadow-lg overflow-hidden flex-col md:flex-row">
        {/* Left Side */}
        <div className="md:w-1/3 bg-gray-100 p-8 flex flex-col justify-center items-center text-center">
          <div className="mb-4">
            <div className="w-16 h-16 bg-gray-200 mx-auto rounded-full"></div>
          </div>
          <h2 className="text-2xl font-bold mb-4">Hello!</h2>
          <p className="text-gray-500 mb-6">
            Register with your personal details <br />
            to use all of the site's features.
          </p>
          <button className="w-full py-2 border-2 border-gray-600 rounded-full text-gray-600 hover:bg-gray-600 hover:text-white transition-colors">
            <Link to="/login">Sign In</Link>
          </button>
        </div>

        {/* Right Side */}
        <div className="md:w-2/3 p-8">
          <button className="absolute top-4 right-4 text-xl font-bold text-gray-400 hover:text-gray-600">
            <Link to="/">&times;</Link>
          </button>
          <h2 className="text-2xl font-bold text-center mb-6">Sign Up</h2>
          {errorMessage && <p className="text-red-500 mb-4 text-center">{errorMessage}</p>}
          <form onSubmit={handleSignUp}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                placeholder="First Name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Last Name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input
                type="email"
                placeholder="Email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Phone Number"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-1 gap-4 mb-4">
              <input
                type="text"
                placeholder="Username"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="relative">
                <input
                  type={showPassword1 ? "text" : "password"}
                  placeholder="Password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button type="button" className="absolute right-3 top-3" onClick={() => setShowPassword1(!showPassword1)}>
                  {showPassword1 ? <EyeIcon className="h-5 w-5 text-gray-500" /> : <EyeClosedIcon className="h-5 w-5 text-gray-500" />}
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword2 ? "text" : "password"}
                  placeholder="Confirm Password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <button type="button" className="absolute right-3 top-3" onClick={() => setShowPassword2(!showPassword2)}>
                  {showPassword2 ? <EyeIcon className="h-5 w-5 text-gray-500" /> : <EyeClosedIcon className="h-5 w-5 text-gray-500" />}
                </button>
              </div>
            </div>
            <div className="flex items-center mb-4">
              <input type="checkbox" className="form-checkbox" required />
              <label className="ml-2 text-gray-500 text-sm">
                I agree to the <Link to="/terms" className="underline text-blue-500">Terms of Privacy</Link>.
              </label>
            </div>
            <button type="submit" className="w-full py-2 bg-gray-600 text-white rounded-lg transition-colors hover:bg-gray-700">
              SIGN UP
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUpForm;
