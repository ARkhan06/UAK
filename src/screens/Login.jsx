import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useAuth } from "../context/Authcontext";

const NAVY = '#0a1e3d';
const RED = '#c8102e';

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password },
        {
          withCredentials: true,
          headers: { 'Content-Type': 'application/json' }
        }
      );

      if (response.data.success) {
        // Store token in localStorage for authenticated API requests
        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
        }
        
        const userData = {
          id: response.data.user.id,
          firstname: response.data.user.firstname,
          lastname: response.data.user.lastname,
          email: response.data.user.email,
          role: response.data.user.role,
          isAdmin: response.data.isAdmin
        };

        // Use AuthContext login to store user data
        login(userData);
        
        // Navigate based on user role
        if (response.data.isAdmin) {
          navigate('/admin');
        } else {
          navigate('/booking');
        }
      } else {
        setError('Login failed. Please try again.');
      }
    } catch (error) {
      if (error.response) {
        setError(error.response.data.error || 'Invalid email or password');
      } else if (error.request) {
        setError('Cannot connect to server. Please try again later.');
      } else {
        setError('Login failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div 
        className="min-h-screen flex items-center justify-center px-4 py-12"
        style={{ backgroundColor: '#f8f9fa' }}
      >
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:wght@400;500;600;700&display=swap');
          
          .login-container {
            animation: slideInUp 0.8s ease-out forwards;
            opacity: 0;
          }
          
          @keyframes slideInUp {
            from {
              opacity: 0;
              transform: translateY(40px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          .login-form {
            backdrop-filter: blur(10px);
            border: 1px solid rgba(200, 16, 46, 0.1);
          }
          
          .input-field {
            transition: all 0.3s ease;
            font-family: 'Inter', sans-serif;
          }
          
          .input-field:focus {
            box-shadow: 0 0 0 3px rgba(200, 16, 46, 0.1);
            border-color: ${RED} !important;
          }
          
          .input-field::placeholder {
            color: #999;
          }
          
          .btn-login {
            font-family: 'Inter', sans-serif;
            font-weight: 600;
            letter-spacing: 0.5px;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
          }
          
          .btn-login:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(200, 16, 46, 0.3);
          }
          
          .btn-login:active:not(:disabled) {
            transform: translateY(0);
          }
          
          .eye-toggle {
            transition: color 0.2s ease;
          }
          
          .eye-toggle:hover {
            filter: brightness(0.8);
          }
          
          .error-banner {
            animation: shake 0.4s ease-in-out;
          }
          
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
          }
          
          .title {
            font-family: 'Playfair Display', serif;
            letter-spacing: -1px;
          }
          
          .divider {
            height: 3px;
            background: linear-gradient(90deg, transparent, ${RED}, transparent);
            margin: 1.5rem 0;
          }
          
          .signup-link {
            transition: all 0.2s ease;
            position: relative;
          }
          
          .signup-link:hover {
            color: ${RED} !important;
          }
        `}</style>

        <div className="login-container w-full max-w-md">
          <div 
            className="login-form rounded-2xl p-8 md:p-10"
            style={{
              backgroundColor: 'white',
              boxShadow: '0 20px 60px rgba(10, 30, 61, 0.15)'
            }}
          >
            {/* Header */}
            <div className="text-center mb-8">
              <h1 
                className="title text-4xl font-bold mb-2"
                style={{ color: NAVY }}
              >
                LOGIN
              </h1>
              <div className="divider"></div>
              <p className="text-gray-600 text-sm font-medium">
                Welcome back to UAK Transport
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Input */}
              <div>
                <label 
                  htmlFor="email"
                  className="block text-xs font-semibold mb-2"
                  style={{ color: NAVY }}
                >
                  EMAIL ADDRESS
                </label>
                <input
                  type="email"
                  id="email"
                  className="input-field w-full px-4 py-3 rounded-lg border-2"
                  style={{
                    borderColor: '#e0e0e0',
                    backgroundColor: '#fafafa'
                  }}
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>

              {/* Password Input */}
              <div>
                <label 
                  htmlFor="password"
                  className="block text-xs font-semibold mb-2"
                  style={{ color: NAVY }}
                >
                  PASSWORD
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    className="input-field w-full px-4 py-3 rounded-lg border-2 pr-12"
                    style={{
                      borderColor: '#e0e0e0',
                      backgroundColor: '#fafafa'
                    }}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    disabled={isLoading}
                    className="eye-toggle absolute right-4 top-1/2 -translate-y-1/2"
                    style={{ color: NAVY }}
                  >
                    {showPassword ? (
                      <EyeOffIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div 
                  className="error-banner p-4 rounded-lg text-sm font-medium flex items-start gap-2"
                  style={{
                    backgroundColor: 'rgba(200, 16, 46, 0.1)',
                    color: RED,
                    border: `1px solid ${RED}`
                  }}
                >
                  <svg className="h-5 w-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="btn-login w-full py-3 px-4 rounded-lg text-white font-bold text-base mt-6"
                style={{
                  backgroundColor: isLoading ? '#c8102e80' : RED,
                  cursor: isLoading ? 'not-allowed' : 'pointer'
                }}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Logging in...
                  </span>
                ) : (
                  'LOG IN'
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center gap-3">
              <div className="flex-1 h-px" style={{ backgroundColor: '#e0e0e0' }}></div>
              <span className="text-xs text-gray-500 font-medium">NEW HERE?</span>
              <div className="flex-1 h-px" style={{ backgroundColor: '#e0e0e0' }}></div>
            </div>

            {/* Signup Link */}
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link
                  to="/signup"
                  className="signup-link font-bold"
                  style={{ color: NAVY }}
                >
                  Sign Up
                </Link>
              </p>
            </div>
          </div>

          {/* Footer Text */}
          <p className="text-center text-xs text-gray-500 mt-6">
            Secure login • Password encrypted
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;