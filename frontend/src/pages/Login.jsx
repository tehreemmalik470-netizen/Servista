import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';

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

      // ─── LOCAL STORAGE INITIALIZATION ───
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      setSuccess(`Welcome back, ${data.user.name || 'User'}!`);
      
      setTimeout(() => {
        const role = data.user.role ? data.user.role.toLowerCase() : '';
        const email = formData.email.toLowerCase().trim();

        if (role === 'admin' || email === 'admin@servista.com') {
          navigate('/admin-dashboard'); 
        } else if (role === 'provider') {
          navigate('/provider-dashboard'); 
        } else {
          navigate('/');
        }
      }, 1000);

    } catch (err) {
      setError(err.message);
    }
  };

  // ─── GOOGLE AUTH INTEGRATION (SYNCED WITH REGISTER LOGIC) ───
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
          }),
        });

        const backendData = await backendRes.json();
        if (!backendRes.ok) throw new Error(backendData.message || 'Google authentication failed');

        localStorage.setItem('token', backendData.token);
        localStorage.setItem('user', JSON.stringify(backendData.user));
        setSuccess('Successfully Logged In via Google!');
        
        setTimeout(() => {
          const role = backendData.user.role ? backendData.user.role.toLowerCase() : '';
          const email = googleUser.email.toLowerCase().trim();

          if (role === 'admin' || email === 'admin@servista.com') {
            navigate('/admin-dashboard');
          } else if (role === 'provider') {
            navigate('/provider-dashboard');
          } else {
            navigate('/');
          }
        }, 1200);

      } catch (err) {
        setError(err.message);
      }
    },
    onError: () => setError('Google Login Failed. Please try again.'),
  });

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#0a111e] py-12 px-4 sm:px-6 lg:px-8 font-sans antialiased overflow-hidden">
      
      {/* ANIMATED BACKGROUND GRAPHIC OVERLAY */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none mix-blend-screen scale-105 animate-pulse duration-[8000ms]">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 800" fill="none">
          <path d="M-100 400 C 300 200, 400 600, 800 300 C 1200 100, 1100 700, 1600 400" stroke="url(#gradient)" strokeWidth="3" strokeDasharray="10 15" />
          <path d="M-50 450 C 250 250, 450 550, 750 350 C 1150 150, 1150 650, 1550 450" stroke="url(#gradient2)" strokeWidth="1.5" />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#22d3ee" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>
            <linearGradient id="gradient2" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#4f46e5" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* AMBIENT GLOW PODS */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none z-0"></div>

      <div className="relative max-w-md w-full space-y-6 bg-[#0f192a]/95 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-slate-800/90 z-10">
        
        {/* BRAND IDENTITY */}
        <div className="text-center">
          <span className="text-2xl font-black tracking-wider text-cyan-400 uppercase">Servista</span>
          <h2 className="mt-3 text-center text-2xl font-black text-white tracking-tight">Welcome back</h2>
          <p className="text-xs text-slate-400 mt-1.5 font-medium tracking-wide">Empowering your premium decentralized service ecosystem</p>
        </div>
        
        {/* ALERTS FEEDBACK */}
        {error && (
          <div className="bg-rose-950/40 border border-rose-900/50 text-rose-400 p-3 rounded-xl text-xs font-bold text-center animate-pulse">
            ❌ {error}
          </div>
        )}
        {success && (
          <div className="bg-emerald-950/40 border border-emerald-900/50 text-emerald-400 p-3 rounded-xl text-xs font-bold text-center">
            🎉 {success}
          </div>
        )}

        {/* INPUT INTERACTION PIPELINE */}
        <form className="mt-4 space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
            <input 
              name="email" 
              type="email" 
              required 
              onChange={handleChange} 
              className="w-full mt-1.5 px-3 py-2 bg-[#132035] border border-slate-700/60 rounded-xl text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50 placeholder-slate-600 font-medium transition" 
              placeholder="admin@servista.com" 
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Password</label>
            <div className="relative mt-1.5">
              <input 
                name="password" 
                type={showPassword ? "text" : "password"} 
                required 
                onChange={handleChange} 
                className="w-full px-3 py-2 bg-[#132035] border border-slate-700/60 rounded-xl text-slate-100 text-sm pr-10 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 placeholder-slate-600 font-medium transition" 
                placeholder="••••••••" 
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)} 
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-[10px] font-black uppercase tracking-wider text-slate-400 hover:text-cyan-400 transition"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <div className="text-right">
            <Link to="/forgot-password" className="text-xs font-bold text-cyan-400 hover:underline decoration-cyan-400/40 underline-offset-4">
              Forgot your password?
            </Link>
          </div>

          <button 
            type="submit" 
            className="w-full py-2.5 px-4 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-sm font-bold shadow-md shadow-cyan-950/50 transition-all active:scale-95"
          >
            Log In
          </button>
        </form>

        {/* RECOGNITION SPANNER */}
        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-slate-800"></div>
          <span className="flex-shrink mx-4 text-slate-500 text-[10px] uppercase font-black tracking-widest">OR</span>
          <div className="flex-grow border-t border-slate-800"></div>
        </div>

        {/* GOOGLE INTERACTION BUTTON */}
        <button 
          type="button" 
          onClick={() => handleGoogleLogin()} 
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 border border-slate-800 rounded-xl bg-[#132035]/40 hover:bg-[#132035]/80 text-xs font-bold text-slate-300 transition active:scale-95"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-4 h-4" />
          Continue with Google
        </button>

        <p className="text-center text-xs text-slate-400 mt-4 font-medium">
          Not on Servista yet?{' '}
          <Link to="/register" className="font-bold text-cyan-400 hover:underline decoration-cyan-400/40 underline-offset-4">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;