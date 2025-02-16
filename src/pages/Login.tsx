import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [user, setUser] = useState<any>(null);
  const token = localStorage.getItem('token')
  const fetchUserData = async () => {
    try {
      const response = await fetch('https://nayepankh-foundation-production-c5f6.up.railway.app/api/user/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(token);
      const data = await response.json();
      setUser(data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFadeOut(true);

    setTimeout(async () => {
      try {
        const response = await fetch('https://nayepankh-foundation-production-c5f6.up.railway.app/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
          localStorage.setItem('token', data.token);
          toast.success('Login successful!');
          await fetchUserData();
          setLoading(true);
          setTimeout(() => {
            navigate('/dashboard');
          }, 2000);
        } else {
          toast.error(data.message || 'Login failed');
          setFadeOut(false);
          setLoading(false);
        }
      } catch (error) {
        toast.error('Failed to login');
        setFadeOut(false);
        setLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 ">
      {!loading ? (
        <motion.div
          className="max-w-md w-full bg-white rounded-lg shadow-md p-8"
          initial={{ opacity: 1 }}
          animate={{ opacity: fadeOut ? 0 : 1 }}
          transition={{ duration: 1 }}
        >
          <div className="text-center mb-8">
            <img className="login" src="/public/logo.png" alt="Logo"
                style={{
                  width: "25%", 
                  margin: "0 auto",
                  marginBottom:"4px"
                }}
            />
            <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
            <p className="text-gray-600 mt-2">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
            >
              Sign In
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="text-indigo-600 hover:text-indigo-500">
              Sign up
            </Link>
          </p>
        </motion.div>
      ) : (
        <motion.div
          className="flex flex-col items-center justify-center max-h-screen"
          style={{ backgroundImage:"url('/public/header.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            height: "100vh",
            width: "100%",
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 1,
            opacity: 0.8
          }} 
        >
          <h1 className="text-3xl font-bold text-gray-900">Welcome, {user?.name}!</h1>
          <motion.div
            className="mt-4 w-16 h-16 border-4 border-gray-900 border-t-transparent rounded-full animate-spin"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1 }}
          />
        </motion.div>
      )}
    </div>
  );
};

export default Login;
