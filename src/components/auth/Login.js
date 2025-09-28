import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';
import googleAuthService from '../../services/googleAuth';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const { login, googleLogin } = useAuth();
  const googleButtonRef = useRef(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      toast.success('Welcome back!');
    } else {
      toast.error(result.error);
    }
    
    setLoading(false);
  };

  const handleGoogleSuccess = async (credential) => {
    setLoading(true);
    
    try {
      const result = await googleLogin(credential);
      
      if (result.success) {
        toast.success('Welcome! Signed in with Google');
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error('Google login failed');
    }
    
    setLoading(false);
  };

  const handleGoogleError = (error) => {
    console.error('Google login error:', error);
    toast.error('Google login failed');
  };

  useEffect(() => {
    // Initialize Google Sign-In button when component mounts
    const initGoogleSignIn = () => {
      if (googleAuthService.isGoogleAPILoaded() && googleButtonRef.current) {
        googleAuthService.renderButton(
          'google-signin-button',
          handleGoogleSuccess,
          handleGoogleError
        );
      } else {
        // Retry after a short delay if Google API isn't loaded yet
        setTimeout(initGoogleSignIn, 100);
      }
    };

    initGoogleSignIn();

    // Cleanup on unmount
    return () => {
      googleAuthService.signOut();
    };
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-ocean-50 to-ocean-100 dark:from-ocean-900 dark:to-ocean-800 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="w-20 h-20 bg-primary-600 rounded-2xl mx-auto mb-4 flex items-center justify-center text-white text-3xl font-bold"
          >
            OIO
          </motion.div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Sign in to your One In One account
          </p>
        </div>

        {/* Login Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="card p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="input-field"
                placeholder="Enter your email"
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="input-field"
                placeholder="Enter your password"
              />
            </div>

            {/* Forgot Password Link */}
            <div className="text-right">
              <button className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400">
                Forgot password?
              </button>
            </div>

            {/* Login Button */}
            <motion.button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3 text-lg font-semibold"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-600" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">Or continue with</span>
            </div>
          </div>

          {/* Google Login Button */}
          <div 
            id="google-signin-button" 
            ref={googleButtonRef}
            className="w-full"
          />

          {/* Sign Up Link */}
          <div className="text-center mt-6">
            <span className="text-gray-600 dark:text-gray-400">Don't have an account? </span>
            <Link 
              to="/register" 
              className="text-primary-600 hover:text-primary-700 dark:text-primary-400 font-medium"
            >
              Sign up
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;
