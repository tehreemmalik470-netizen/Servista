import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  // ─── ADDED SKILL FIELD IN INITIAL STATE ───
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'client', skill: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Agar role wapas client ho jaye, toh skill ko reset/clear kar dein
    if (name === 'role' && value === 'client') {
      setFormData({ ...formData, role: value, skill: '' });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Verification check: Agar provider hai toh skill choose karna laazmi hai
    if (formData.role === 'provider' && !formData.skill) {
      setError('Please select your specific profession/skill!');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Registration failed');

      setSuccess('Account successfully created! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 bg-white p-8 rounded-xl shadow-md border border-gray-100">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">Create your Servista Account</h2>
        
        {error && <div className="bg-red-100 text-red-700 p-3 rounded text-sm text-center">{error}</div>}
        {success && <div className="bg-green-100 text-green-700 p-3 rounded text-sm text-center">{success}</div>}

        <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="text-sm font-semibold text-gray-700">Full Name</label>
            <input name="name" type="text" required onChange={handleChange} className="w-full mt-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="John Doe" />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700">Email Address</label>
            <input name="email" type="email" required onChange={handleChange} className="w-full mt-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="email@example.com" />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700">Password</label>
            <div className="relative mt-1">
              <input name="password" type={showPassword ? "text" : "password"} required onChange={handleChange} className="w-full px-3 py-2 border rounded-md pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="••••••••" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-gray-500 hover:text-gray-700">
                {showPassword ? "Hide" : "👁️ Show"}
              </button>
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700">Join As</label>
            <select name="role" value={formData.role} onChange={handleChange} className="w-full mt-1 px-3 py-2 border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700">
              <option value="client">Client (Need a Service)</option>
              <option value="provider">Provider (Offer a Service)</option>
            </select>
          </div>

          {/* ─── DYNAMIC SKILL DROPDOWN FOR PROVIDERS ONLY ─── */}
          {formData.role === 'provider' && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-200">
              <label className="text-sm font-semibold text-gray-700 text-blue-600 flex items-center gap-1">
                ⚙️ Select Your Primary Skill / Profession
              </label>
              <select 
                name="skill" 
                required 
                value={formData.skill}
                onChange={handleChange} 
                className="w-full mt-1 px-3 py-2 border border-blue-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 font-medium"
              >
                <option value="" disabled>-- Select Your Skill --</option>
                <option value="Cleaning">Cleaning Expert</option>
                <option value="Plumbing">Plumbing Expert</option>
                <option value="Electrician">Electrician Expert</option>
                <option value="Pest Control">Pest Control </option>
                <option value="Solar Installation">Solar System Installer</option>
                <option value="AC Repairing">AC Repairing</option>
                <option value="Painting&Decor ">Painting&Decor</option>
                <option value="Home Shifting">Home Shifting</option>
                <option value="Carpenter Services ">Carpenter Services</option>
              </select>
            </div>
          )}

          <button type="submit" className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium shadow-sm transition">
            Sign Up
          </button>
        </form>

        {/* Google Divider & Button */}
        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="flex-shrink mx-4 text-gray-400 text-xs uppercase font-bold">OR</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        <button type="button" onClick={() => alert('Google auth integration pending')} className="w-full flex items-center justify-center gap-2 py-2 px-4 border border-gray-300 rounded-md bg-white hover:bg-gray-50 text-sm font-medium text-gray-700 transition">
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-4 h-4" />
          Continue with Google
        </button>

        {/* Link to Login */}
        <p className="text-center text-xs text-gray-600 mt-4">
          Already on Servista?{' '}
          <Link to="/login" className="font-semibold text-blue-600 hover:underline">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;