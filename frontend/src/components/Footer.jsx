import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white py-10 mt-10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 pb-12">
        
        {/* Brand Section */}
        <div className="flex flex-col gap-4">
          <span className="text-2xl font-black tracking-wider text-blue-500 uppercase">SERVISTA</span>
          <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
            Our goal is not only to provide domestic assistance but to build trust through quality, innovation, and dependable service for homes and workspaces worldwide.
          </p>
        </div>

        {/* Useful Links Section */}
        <div className="flex flex-col gap-4 md:pl-12">
          {/* Useful Links ka text color white kiya */}
          <h3 className="font-bold text-white tracking-wide text-base">Useful Links</h3>
          {/* Links ka color text-slate-300 kiya taaki dark par dikhayi dein */}
          <ul className="flex flex-col gap-2.5 text-sm font-medium text-slate-300">
            <li><Link to="/" className="hover:text-blue-400 transition-colors">Home</Link></li>
            <li><Link to="/about" className="hover:text-blue-400 transition-colors">About Us</Link></li>
            <li><Link to="/services" className="hover:text-blue-400 transition-colors">Services</Link></li>
            <li><Link to="/contactUs" className="hover:text-blue-400 transition-colors">ContactUs</Link></li>
          </ul>
        </div>

        {/* Subscribe Section */}
        <div className="flex flex-col gap-4">
          {/* Subscribe Now ka text color white kiya */}
          <h3 className="font-bold text-white tracking-wide text-base">Subscribe Now</h3>
          <p className="text-sm text-slate-400">Don't miss our future updates! Get Subscribed Today!</p>
          <div className="relative flex items-center max-w-md mt-2">
            <span className="absolute left-4 text-slate-400 text-base">✉</span>
            {/* Input box ko dark kiya, text white kiya aur placeholder ko readable gray kiya */}
            <input 
              type="email" 
              placeholder="Email Address" 
              className="w-full pl-10 pr-14 py-3 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-all"
            />
            <button type="button" className="absolute right-2 bg-rose-500 hover:bg-rose-600 text-white w-9 h-9 rounded-lg flex items-center justify-center transition-colors shadow-sm">
              ➔
            </button>
          </div>
        </div>

      </div>

      {/* Sub-Footer Copyright Engine - Border color ko dark theme ke mutabiq adjust kiya */}
      <div className="max-w-7xl mx-auto px-6 pt-6 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-semibold text-slate-500 tracking-wide uppercase">
        <p>© 2026 SERVISTA. ALL RIGHTS RESERVED.</p>
        <div className="flex gap-6">
          <Link to="/about" className="hover:text-blue-400">ABOUT US</Link>
          <Link to="/contactUs" className="hover:text-blue-400">CONTACT US</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;