import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google'; 

const Register = () => {
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    role: 'Client', 
    skill: '',
    location: '' 
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'role' && value === 'Client') {
      setFormData({ ...formData, role: value, skill: '', location: '' });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.role === 'Provider' && !formData.skill) {
      setError('Please select your specific profession/skill!');
      return;
    }

    if (formData.role === 'Provider' && !formData.location.trim()) {
      setError('Please type your location!');
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

      setSuccess('Account successfully created! Redirecting...');
      
      setTimeout(() => {
        if (formData.role === 'Provider') {
          navigate('/provider-dashboard'); 
        } else {
          navigate('/login'); 
        }
      }, 2000);

    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setError('');
        const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });
        const googleUser = await userInfoRes.json();

        const backendRes = await fetch('http://localhost:5000/api/auth/google-login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: googleUser.name,
            email: googleUser.email,
            role: formData.role,  
            skill: formData.skill,
            location: formData.location 
          }),
        });

        const backendData = await backendRes.json();
        if (!backendRes.ok) throw new Error(backendData.message || 'Google authentication failed');

        localStorage.setItem('user', JSON.stringify(backendData.user));
        setSuccess('Successfully Logged In via Google!');
        
        setTimeout(() => {
          if (formData.role === 'Provider') {
            navigate('/provider-dashboard'); 
          } else {
            navigate('/'); 
          }
        }, 1500);

      } catch (err) {
        setError(err.message);
      }
    },
    onError: () => setError('Google Login Failed. Please try again.'),
  });

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#F6FAFD] py-12 px-4 sm:px-6 lg:px-8 font-sans antialiased overflow-hidden">
      
      {/* ANIMATED BACKGROUND GRAPHIC OVERLAY (MATCHED WITH LOGIN LIGHT PALETTE) */}
      <div className="absolute inset-0 z-0 opacity-40 pointer-events-none mix-blend-multiply scale-105 animate-pulse duration-[8000ms]">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 800" fill="none">
          <path d="M-100 400 C 300 200, 400 600, 800 300 C 1200 100, 1100 700, 1600 400" stroke="url(#register-gradient)" strokeWidth="3" strokeDasharray="10 15" />
          <path d="M-50 450 C 250 250, 450 550, 750 350 C 1150 150, 1150 650, 1550 450" stroke="url(#register-gradient2)" strokeWidth="1.5" />
          <defs>
            <linearGradient id="register-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4A7FA7" />
              <stop offset="100%" stopColor="#B3CFE5" />
            </linearGradient>
            <linearGradient id="register-gradient2" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0A1931" />
              <stop offset="100%" stopColor="#4A7FA7" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* AMBIENT GLOW PODS */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-[#4A7FA7]/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-[#B3CFE5]/20 rounded-full blur-[120px] pointer-events-none z-0"></div>

      {/* CARD CONTEXT AREA */}
      <div className="relative max-w-md w-full space-y-6 bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-xl shadow-blue-900/5 border border-[#B3CFE5]/40 z-10">
        
        {/* BRAND IDENTITY */}
        <div className="text-center">
          <span className="text-2xl font-black tracking-wider text-[#0A1931] uppercase">Servista</span>
          <h2 className="mt-3 text-center text-2xl font-black text-[#091F5C] tracking-tight">Create Account</h2>
          <p className="text-xs text-[#4A7FA7] mt-1.5 font-medium tracking-wide">Join the premium decentralized service workspace</p>
        </div>
        
        {/* ALERTS FEEDBACK */}
        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-600 p-3 rounded-xl text-xs font-bold text-center animate-pulse">
            ❌ {error}
          </div>
        )}
        {success && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-600 p-3 rounded-xl text-xs font-bold text-center">
            🎉 {success}
          </div>
        )}

        {/* REGISTRATION PIPELINE FORM */}
        <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="text-xs font-bold text-[#091F5C] uppercase tracking-wider">Full Name</label>
            <input 
              name="name" 
              type="text" 
              required={true} 
              onChange={handleChange} 
              className="w-full mt-1.5 px-3 py-2 bg-[#F6FAFD] border border-[#B3CFE5] rounded-xl text-[#091F5C] text-sm focus:outline-none focus:ring-2 focus:ring-[#4A7FA7] placeholder-slate-400 font-medium transition" 
              placeholder="John Doe" 
            />
          </div>

          <div>
            <label className="text-xs font-bold text-[#091F5C] uppercase tracking-wider">Email Address</label>
            <input 
              name="email" 
              type="email" 
              required={true} 
              onChange={handleChange} 
              className="w-full mt-1.5 px-3 py-2 bg-[#F6FAFD] border border-[#B3CFE5] rounded-xl text-[#091F5C] text-sm focus:outline-none focus:ring-2 focus:ring-[#4A7FA7] placeholder-slate-400 font-medium transition" 
              placeholder="email@example.com" 
            />
          </div>

          <div>
            <label className="text-xs font-bold text-[#091F5C] uppercase tracking-wider">Password</label>
            <div className="relative mt-1.5">
              <input 
                name="password" 
                type={showPassword ? "text" : "password"} 
                required={true} 
                onChange={handleChange} 
                className="w-full px-3 py-2 bg-[#F6FAFD] border border-[#B3CFE5] rounded-xl text-[#091F5C] text-sm pr-10 focus:outline-none focus:ring-2 focus:ring-[#4A7FA7] placeholder-slate-400 font-medium transition" 
                placeholder="••••••••" 
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)} 
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-[10px] font-black uppercase tracking-wider text-[#4A7FA7] hover:text-[#0A1931] transition"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-[#091F5C] uppercase tracking-wider">Join Workspace As</label>
            <select 
              name="role" 
              value={formData.role} 
              onChange={handleChange} 
              className="w-full mt-1.5 px-3 py-2 bg-[#F6FAFD] border border-[#B3CFE5] rounded-xl text-[#091F5C] text-sm focus:outline-none focus:ring-2 focus:ring-[#4A7FA7] font-medium transition"
            >
              <option value="Client">Client (Need a Service)</option>
              <option value="Provider">Provider (Offer a Service)</option>
            </select>
          </div>

          {/* ─── PROVIDER CONDITIONAL SECTION ─── */}
          {formData.role === 'Provider' && (
            <div className="space-y-4 p-4 rounded-xl bg-[#F6FAFD] border border-[#B3CFE5]/60 dynamic-animation-trigger animate-in fade-in slide-in-from-top-2 duration-200">
              
              <div>
                <label className="text-xs font-bold text-[#0A1931] uppercase tracking-wider flex items-center gap-1">
                  📍 Service Area Base Location
                </label>
                <input 
                  name="location" 
                  type="text"
                  required={true} 
                  value={formData.location} 
                  onChange={handleChange} 
                  placeholder="e.g. Model Town, Shahabpura, Cantt..."
                  className="w-full mt-1.5 px-3 py-2 bg-white border border-[#B3CFE5] rounded-xl text-[#091F5C] text-sm focus:outline-none focus:ring-2 focus:ring-[#4A7FA7] placeholder-slate-400 font-medium transition"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#0A1931] uppercase tracking-wider flex items-center gap-1">
                  ⚙️ Primary Service Specialty
                </label>
                <select 
                  name="skill" 
                  required={true} 
                  value={formData.skill}
                  onChange={handleChange} 
                  className="w-full mt-1.5 px-3 py-2 bg-white border border-[#B3CFE5] rounded-xl text-[#091F5C] text-sm focus:outline-none focus:ring-2 focus:ring-[#4A7FA7] font-medium transition"
                >
                  <option value="" disabled={true}>-- Select Your Skill --</option>
                  <option value="Cleaning">Cleaning Expert</option>
                  <option value="Plumbing">Plumbing Expert</option>
                  <option value="Electrician">Electrician Expert</option>
                  <option value="Pest Control">Pest Control</option>
                  <option value="Solar Installation">Solar System Installer</option>
                  <option value="AC Repairing">AC Repairing</option>
                  <option value="Painting&Decor">Painting & Decor</option>
                  <option value="Home Shifting">Home Shifting</option>
                  <option value="Carpenter Services">Carpenter Services</option>
                </select>
              </div>

            </div>
          )}

          <button 
            type="submit" 
            className="w-full py-2.5 px-4 bg-[#0A1931] hover:bg-[#1A3D63] text-white rounded-xl text-sm font-bold shadow-md shadow-blue-900/10 transition-all active:scale-95"
          >
            Sign Up
          </button>
        </form>

        {/* DIVIDER */}
        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-[#B3CFE5]/60"></div>
          <span className="flex-shrink mx-4 text-[#4A7FA7] text-[10px] uppercase font-black tracking-widest">OR</span>
          <div className="flex-grow border-t border-[#B3CFE5]/60"></div>
        </div>

        {/* GOOGLE INTEGRATION BUTTON */}
        <button 
          type="button" 
          onClick={() => handleGoogleLogin()} 
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 border border-[#B3CFE5] rounded-xl bg-white hover:bg-[#F6FAFD] text-xs font-bold text-[#0A1931] transition shadow-sm active:scale-95"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-4 h-4" />
          Continue with Google
        </button>

        <p className="text-center text-xs text-[#4A7FA7] mt-4 font-medium">
          Already on Servista?{' '}
          <Link to="/login" className="font-bold text-[#0A1931] hover:underline underline-offset-4">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;