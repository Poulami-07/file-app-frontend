import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import "../App.css";

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false); // 👈 New state

  // Normal SignIn / SignUp
  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName },
          },
        });
        if (error) throw error;
        alert('Check your email for the confirmation link!');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (error) {
      alert(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };

  // Forgot Password

const handleForgotPassword = async () => {
  if (!email) {
    alert("Please enter your email.");
    return;
  }

  try {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "http://localhost:3000/reset-password",
    });

    if (error) {
      console.error("Supabase error:", error);
      alert("Error: " + error.message);
    } else {
      console.log("Supabase response:", data);
      alert("Password reset link sent! Check your inbox.");
    }
  } catch (err) {
    console.error("Network/Fetch error:", err);
    alert("Network error: " + err.message);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {isForgotPassword
              ? "Reset your password"
              : isSignUp
              ? "Create your account"
              : "Sign in to your account"}
          </h2>
        </div>

        {/* Forgot Password Form */}
        {isForgotPassword ? (
          <form className="mt-8 space-y-6" onSubmit={handleForgotPassword}>
            <div>
              <input
                id="email"
                type="email"
                required
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md
                placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 
                focus:border-indigo-500 sm:text-sm"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 
              disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
            <div className="text-center">
              <button
                type="button"
                className="text-indigo-600 hover:text-indigo-500 text-sm"
                onClick={() => setIsForgotPassword(false)}
              >
                Back to Sign in
              </button>
            </div>
          </form>
        ) : (
          // Normal SignIn/SignUp Form
          <form className="mt-8 space-y-6" onSubmit={handleAuth}>
            <div className="rounded-md shadow-sm -space-y-px">
              {isSignUp && (
                <div>
                  <input
                    id="full-name"
                    name="name"
                    type="text"
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-t-md
                    placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 
                    focus:border-indigo-500 sm:text-sm"
                    placeholder="Full Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
              )}

              <div>
                <input
                  id="email-address"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 
                  placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 
                  focus:border-indigo-500 sm:text-sm"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-b-md
                  placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 
                  focus:border-indigo-500 sm:text-sm"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 px-3 flex items-center text-sm text-gray-600 hover:text-indigo-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 
              disabled:opacity-50"
            >
              {loading ? "Loading..." : isSignUp ? "Sign up" : "Sign in"}
            </button>

            {/* Forgot Password Button */}
            {!isSignUp && (
              <div className="text-center">
                <button
                  type="button"
                  className="text-sm text-red-500 hover:text-red-600"
                  onClick={() => setIsForgotPassword(true)}
                >
                  Forgot your password?
                </button>
              </div>
            )}

            <div className="text-center">
              <button
                type="button"
                className="text-indigo-600 hover:text-indigo-500 text-sm"
                onClick={() => setIsSignUp(!isSignUp)}
              >
                {isSignUp
                  ? "Already have an account? Sign in"
                  : "Don't have an account? Sign up"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
