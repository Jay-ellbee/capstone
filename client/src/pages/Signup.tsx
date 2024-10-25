import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { EyeIcon } from "lucide-react";
import { EyeClosedIcon } from "@radix-ui/react-icons";

export const SignUpForm = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic password match validation
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    // Clear any previous error messages
    setErrorMessage("");

    try {
      // Simulating a sign-up process, replace this with your backend API
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password,
          role: "customer", // Assigning the role as 'customer'
        }),
      });

      if (response.ok) {
        // Redirecting to the account setup page after a successful sign-up
        navigate("/account-setup");
      } else {
        // Show error message if the sign-up fails
        const errorData = await response.json();
        setErrorMessage(errorData.message || "Sign-up failed");
      }
    } catch (error) {
      setErrorMessage("An error occurred during sign-up.");
      console.error(error);
    }
  };

  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const years = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i);

  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-200">
      <div className="flex w-full max-w-6xl bg-white rounded-[20px] shadow-lg overflow-hidden min-h-[500px]">
        {/* Left - Sign In Section */}
        <div className="w-1/3 bg-gray-100 p-8 relative flex flex-col justify-center items-center">
          
          <div className="text-center">
            <div className="mb-4">
              <div className="w-16 h-16 bg-gray-200 mx-auto rounded-full"></div>
            </div>
            <h2 className="text-2xl font-bold mb-4">Welcome Back!</h2>
            <p className="text-gray-500 mb-6">
              Enter your personal details <br />
              [to use all of site features]
            </p>
            <button className="w-full py-2 border-2 border-gray-600 rounded-full text-gray-600 hover:bg-gray-600 hover:text-white transition-colors">
              <Link to="/login">Sign in</Link>
            </button>
          </div>
        </div>

        {/* Right - Sign Up Section */}
        <div className="w-2/3 p-8 relative">
        <button className="absolute top-4 right-4 text-xl font-bold text-gray-400 hover:text-gray-600"><Link to="/">&times;</Link></button>
          <h2 className="text-2xl font-bold text-center mb-6">Sign Up</h2>
          {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
          <form onSubmit={handleSignUp}>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <input
                id="email"
                type="email"
                placeholder="Enter Email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Enter Phone Number"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <input
                id="first-name"
                type="text"
                placeholder="Enter First Name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
              <input
                id="last-name"
                type="text"
                placeholder="Enter Last Name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                placeholder="Enter Username"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
              />
              <div>
                <label className="text-sm text-gray-500">Birthday</label>
                <div className="flex space-x-2">
                  <select
                    className="w-1/3 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                  >
                    <option value="">Month</option>
                    {months.map((month, index) => (
                      <option key={index} value={month}>
                        {month}
                      </option>
                    ))}
                  </select>
                  <select
                    className="w-1/3 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
                    value={selectedDay}
                    onChange={(e) => setSelectedDay(e.target.value)}
                  >
                    <option value="">Day</option>
                    {days.map((day) => (
                      <option key={day} value={day}>
                        {day}
                      </option>
                    ))}
                  </select>
                  <select
                    className="w-1/3 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                  >
                    <option value="">Year</option>
                    {years.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4 relative">
              {/* First Password Field */}
              <div className="relative">
                <input
                  id="password1"
                  type={showPassword1 ? "text" : "password"}
                  placeholder="Enter Password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-3"
                  onClick={() => setShowPassword1(!showPassword1)}
                >
                  {showPassword1 ? (
                    <EyeIcon className="h-5 w-5 text-gray-500" />
                  ) : (
                    <EyeClosedIcon className="h-5 w-5 text-gray-500" />
                  )}
                </button>
              </div>

              {/* Confirm Password Field */}
              <div className="relative">
                <input
                  id="password2"
                  type={showPassword2 ? "text" : "password"}
                  placeholder="Confirm Password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-3"
                  onClick={() => setShowPassword2(!showPassword2)}
                >
                  {showPassword2 ? (
                    <EyeIcon className="h-5 w-5 text-gray-500" />
                  ) : (
                    <EyeClosedIcon className="h-5 w-5 text-gray-500" />
                  )}
                </button>
              </div>
            </div>
            <div className="flex items-center mb-4">
              <input type="checkbox" className="form-checkbox" />
              <label className="ml-2 text-gray-500 text-sm">
                I have read and agreed to Shop Name's Terms of Privacy and Privacy Policy.
              </label>
            </div>
            <button
              type="submit"
              className="w-full py-2 bg-gray-300 text-white rounded-lg transition-colors hover:bg-gray-400"
            >
              SIGN UP
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUpForm;
