import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);

  // Check login status on component mount and route change
  useEffect(() => {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      setUser(JSON.parse(userJson));
    } else {
      setUser(null);
    }
  }, [location]); // Automatically re-runs when switching pages

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token'); // Agar token save kiya hai toh
    setUser(null);
    alert("Logged out successfully! 👋");
    navigate('/login');
  };

  // Safe checks for roles and email formats
  const userRole = user && user.role ? user.role.toLowerCase() : '';
  const userEmail = user && user.email ? user.email.toLowerCase() : '';
  
  const isAdmin = userRole === 'admin' || userEmail === 'admin@servista.com';
  const isProvider = userRole === 'provider';

  return (
    <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between border-b border-slate-50 sticky top-0 bg-white/80 backdrop-blur-md z-50">
      {/* LOGO - Now Clickable & Routes to Home */}
      <div className="flex items-center">
        <Link to="/" className="text-xl font-black tracking-tight text-[#0f172a] hover:opacity-80 transition-opacity">
          SERVISTA
        </Link>
      </div>
      
      {/* LINKS - Dynamic Menu Based on Roles */}
      <div className="hidden md:flex items-center gap-8 font-semibold text-slate-500 text-xs uppercase tracking-widest">
        {/* Dynamic Dashboard Links based on Role */}
        {isAdmin && (
          <Link to="/admin-dashboard" className={`${location.pathname === '/admin-dashboard' ? 'text-blue-600' : 'hover:text-slate-900'} transition-colors font-bold`}>
            Admin Dashboard
          </Link>
        )}
        
        {isProvider && (
          <Link to="/provider-dashboard" className={`${location.pathname === '/provider-dashboard' ? 'text-blue-600' : 'hover:text-slate-900'} transition-colors font-bold`}>
            Provider Dashboard
          </Link>
        )}

        {/* Regular Common Links */}
        {location.pathname === '/' ? (
          <a href="#services" className="hover:text-slate-900 transition-colors">Services</a>
        ) : (
          <Link to="/" className="hover:text-slate-900 transition-colors">Services</Link>
        )}
        <Link to="/experts" className={`${location.pathname === '/experts' ? 'text-blue-600' : 'hover:text-slate-900'} transition-colors`}>Find Experts</Link>
        <Link to="/about" className={`${location.pathname === '/about' ? 'text-blue-600' : 'hover:text-slate-900'} transition-colors`}>About</Link>
        <Link to="/contactUs" className={`${location.pathname === '/contactUs' ? 'text-blue-600' : 'hover:text-slate-900'} transition-colors`}>ContactUs</Link>
        
        {/* Customer Only Links - Hidden from Admin and Provider */}
        {!isAdmin && !isProvider && (
          <Link to="/my-bookings" className={`${location.pathname === '/my-bookings' ? 'text-blue-600' : 'hover:text-slate-900'} transition-colors`}>
            My Bookings
          </Link>
        )}
      </div>
      
      {/* AUTH BUTTONS - Conditional Login/Logout Toggle */}
      <div className="flex items-center gap-6">
        {user ? (
          <div className="flex items-center gap-4">
            <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-md tracking-wider">
              Hi, {user.name?.split(' ')[0]} ({isAdmin ? 'Admin' : user.role})
            </span>
            <button 
              onClick={handleLogout} 
              className="text-xs font-bold text-red-600 hover:text-red-700 transition-colors uppercase tracking-wider cursor-pointer"
            >
              Log out
            </button>
          </div>
        ) : (
          <>
            <Link to="/login" className="text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors uppercase tracking-wider">Log in</Link>
            <Link to="/register" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-bold text-xs uppercase tracking-widest transition-all shadow-lg shadow-blue-600/20">Sign up</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;