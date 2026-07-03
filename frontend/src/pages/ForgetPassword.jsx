import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Abhi ke liye sirf message show karenge
    setMessage(`Reset link has been sent to ${email} (Demo)`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full space-y-6 bg-white p-8 rounded-xl shadow-md border border-gray-100">
        <h2 className="text-center text-2xl font-bold text-gray-900">Reset Password</h2>
        <p className="text-center text-sm text-gray-600">Enter your email and we'll send you a link to get back into your account.</p>
        
        {message && <div className="bg-blue-100 text-blue-700 p-3 rounded text-sm text-center">{message}</div>}

        <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
          <input 
            type="email" 
            required 
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500" 
            placeholder="Enter your email" 
          />
          <button type="submit" className="w-full py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition">
            Send Reset Link
          </button>
        </form>

        <div className="text-center mt-4">
          <Link to="/login" className="text-sm font-semibold text-blue-600 hover:underline">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;