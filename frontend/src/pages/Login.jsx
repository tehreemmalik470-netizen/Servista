import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Login failed');

      // Token aur User data localStorage mein save ho raha hai
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      setSuccess(`Welcome back, ${data.user.name}!`);
      
      setTimeout(() => {
        // Redirect Logic: Check if it's admin, provider or normal user
        if (data.user.email === 'admin@servista.com') {
          navigate('/admin');
        } else if (data.user.role === 'provider') {
          navigate('/provider-dashboard');
        } else {
          navigate('/');
        }
      }, 1500);

    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 bg-white p-8 rounded-xl shadow-md border border-gray-100">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">Welcome back to Servista</h2>
        
        {error && <div className="bg-red-100 text-red-700 p-3 rounded text-sm text-center">{error}</div>}
        {success && <div className="bg-green-100 text-green-700 p-3 rounded text-sm text-center">{success}</div>}

        <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="text-sm font-semibold text-gray-700">Email Address</label>
            <input name="email" type="email" required onChange={handleChange} className="w-full mt-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="email@example.com" />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700">Password</label>
            <div className="relative mt-1">
              <input name="password" type={showPassword ? "text" : "password"} required onChange={handleChange} className="w-full px-3 py-2 border rounded-md pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="••••••••" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-gray-500 hover:text-gray-700">
                {showPassword ? "🙈 Hide" : "👁️ Show"}
              </button>
            </div>
          </div>

          <div className="text-right">
            <Link to="/forgot-password" className="text-xs font-semibold text-blue-600 hover:underline">
              Forgot your password?
            </Link>
          </div>

          <button type="submit" className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium shadow-sm transition">
            Log In
          </button>
        </form>

        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="flex-shrink mx-4 text-gray-400 text-xs uppercase font-bold">OR</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        <button type="button" onClick={() => alert('Google auth integration pending')} className="w-full flex items-center justify-center gap-2 py-2 px-4 border border-gray-300 rounded-md bg-white hover:bg-gray-50 text-sm font-medium text-gray-700 transition">
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-4 h-4" />
          Continue with Google
        </button>

        <p className="text-center text-xs text-gray-600 mt-4">
          Not on Servista yet?{' '}
          <Link to="/register" className="font-semibold text-blue-600 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;