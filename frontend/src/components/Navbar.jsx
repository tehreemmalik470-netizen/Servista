import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { CartContext } from '../context/CartContext';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const { cart } = useContext(CartContext);

  // Check login status on component mount and route change
  useEffect(() => {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      setUser(JSON.parse(userJson));
    } else {
      setUser(null);
    }
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    alert("Logged out successfully! ");
    navigate('/login');
  };

  const userRole = user && user.role ? user.role.toLowerCase() : '';
  const userEmail = user && user.email ? user.email.toLowerCase() : '';
  
  const isAdmin = userRole === 'admin' || userEmail === 'admin@servista.com';
  const isProvider = userRole === 'provider';

  return (
    <nav className="max-w-full bg-slate-900 text-slate-200 border-b border-slate-800 sticky top-0 backdrop-blur-md z-50 px-6 py-4 shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* LOGO */}
        <div className="flex items-center">
          <Link to="/" className="text-xl font-black tracking-tight text-white hover:opacity-80 transition-opacity">
            SERV<span className="text-blue-500">ISTA</span>
          </Link>
        </div>
        
        {/* LINKS */}
        <div className="hidden md:flex items-center gap-8 font-semibold text-slate-400 text-xs uppercase tracking-widest">
          {isAdmin && (
            <Link to="/admin-dashboard" className={`${location.pathname === '/admin-dashboard' ? 'text-blue-400 font-bold' : 'hover:text-white'} transition-colors`}>
              Admin Dashboard
            </Link>
          )}
          
          {isProvider && (
            <Link to="/provider-dashboard" className={`${location.pathname === '/provider-dashboard' ? 'text-blue-400 font-bold' : 'hover:text-white'} transition-colors`}>
              Provider Dashboard
            </Link>
          )}

          {location.pathname === '/' ? (
            <a href="#services" className="hover:text-white transition-colors">Services</a>
          ) : (
            <Link to="/" className="hover:text-white transition-colors">Services</Link>
          )}
          <Link to="/experts" className={`${location.pathname === '/experts' ? 'text-blue-400 font-bold' : 'hover:text-white'} transition-colors`}>Find Experts</Link>
          <Link to="/about" className={`${location.pathname === '/about' ? 'text-blue-400 font-bold' : 'hover:text-white'} transition-colors`}>About</Link>
          <Link to="/contactUs" className={`${location.pathname === '/contactUs' ? 'text-blue-400 font-bold' : 'hover:text-white'} transition-colors`}>ContactUs</Link>
          
          {/* MY CART - Sirf tab show hoga jab user ADMIN DASHBOARD par na ho */}
          {!location.pathname.startsWith('/admin-dashboard') && (
            <Link to="/cart" className="relative flex items-center gap-1 font-semibold text-slate-300 hover:text-blue-400 transition-colors">
              My Cart
              {cart && cart.length > 0 && (
                <span className="absolute -top-3 -right-4 bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                  {cart.length}
                </span>
              )}
            </Link>
          )}

          {!isAdmin && !isProvider && (
            <Link to="/my-bookings" className={`${location.pathname === '/my-bookings' ? 'text-blue-400 font-bold' : 'hover:text-white'} transition-colors`}>
              My Bookings
            </Link>
          )}
        </div>
        
        {/* AUTH BUTTONS & LOGOUT */}
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-300 bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-md tracking-wider">
                Hi, {user.name?.split(' ')[0]} ({isAdmin ? 'Admin' : user.role})
              </span>
              <button 
                onClick={handleLogout} 
                className="bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white border border-red-500/20 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors uppercase tracking-wider cursor-pointer"
              >
                Log out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link to="/login" className="text-xs font-bold text-slate-300 hover:text-white transition-colors uppercase tracking-wider">Log in</Link>
              <Link to="/register" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-bold text-xs uppercase tracking-widest transition-all shadow-lg shadow-blue-600/30">Sign up</Link>
            </div>
          )}
        </div>

      </div>
    </nav>
  );
};

export default Navbar;