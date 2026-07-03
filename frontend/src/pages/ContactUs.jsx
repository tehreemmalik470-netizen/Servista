import React, { useState } from 'react';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [statusMessage, setStatusMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatusMessage("🔄 Sending your message...");
    
    setTimeout(() => {
      setStatusMessage("✅ Message sent successfully! We will get back to you soon.");
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased relative overflow-hidden selection:bg-blue-500 selection:text-white">
      
      {/* ─── CREATIVE BACKGROUND DECORATIONS (Soft Gradients) ─── */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-blue-300/20 to-purple-400/10 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[5%] right-[-5%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-emerald-200/10 to-blue-400/20 blur-[130px] pointer-events-none"></div>

      {/* ─── HERO HEADER SECTION ─── */}
      <div className="relative py-24 px-6 text-center max-w-4xl mx-auto space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600/10 border border-blue-500/20 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping"></span>
          <span className="text-[10px] font-black text-blue-700 uppercase tracking-[0.2em]">Get In Touch</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-black text-slate-950 tracking-tight leading-none">
          Let’s Build Something <br className="hidden sm:inline"/> Great <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Together</span>
        </h1>
        <p className="text-slate-500 text-sm sm:text-base max-w-xl mx-auto leading-relaxed font-medium">
          Have questions about onboarding, instant booking, or custom pricing? Reach out and our Sialkot team will guide you smoothly.
        </p>
      </div>

      {/* ─── MAIN HUB LAYOUT ─── */}
      <section className="max-w-7xl mx-auto px-6 pb-28 grid lg:grid-cols-12 gap-12 relative z-10">
        
        {/* Left Column: Interactive Info Cards (Now Clickable) */}
        <div className="lg:col-span-5 space-y-6 flex flex-col justify-between">
          <div className="space-y-4 text-left">
            <h2 className="text-xs font-black text-blue-600 uppercase tracking-[0.25em]">Contact Hub</h2>
            <h3 className="text-3xl font-black text-slate-950 tracking-tight">Connect With Servista HQ</h3>
            <p className="text-slate-500 text-sm font-medium leading-relaxed">
              We streamline operations for local homeowners and technicians alike. Pick a channel to instantly plug into support.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 pt-4">
            
            {/* 🗺️ Card 1: HQ Address (Click to open Google Maps) */}
            <a 
              href="https://www.google.com/maps/search/?api=1&query=Shahabpura+Road+Sialkot" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-5 bg-white border border-slate-100 shadow-xl shadow-slate-200/50 rounded-2xl flex items-start gap-4 hover:border-blue-500/50 hover:shadow-blue-500/5 transition-all duration-300 group text-left cursor-pointer"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600 flex items-center justify-center text-xl shrink-0 shadow-inner group-hover:scale-110 transition-transform">📍</div>
              <div>
                <h4 className="text-sm font-black text-slate-950 group-hover:text-blue-600 transition-colors">Our Head Office</h4>
                <p className="text-slate-500 text-xs mt-1.5 font-medium leading-relaxed">Shahabpura Road, Near Small Industrial Estate, Sialkot, Pakistan</p>
                <span className="text-[10px] text-blue-500 font-bold block mt-2">View on Map →</span>
              </div>
            </a>

            {/* ✉️ Card 2: Email (Click to open Mail Client) */}
            <a 
              href="mailto:support@servista.com" 
              className="p-5 bg-white border border-slate-100 shadow-xl shadow-slate-200/50 rounded-2xl flex items-start gap-4 hover:border-emerald-500/50 hover:shadow-emerald-500/5 transition-all duration-300 group text-left cursor-pointer"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100 text-emerald-600 flex items-center justify-center text-xl shrink-0 shadow-inner group-hover:scale-110 transition-transform">✉️</div>
              <div>
                <h4 className="text-sm font-black text-slate-950 group-hover:text-emerald-600 transition-colors">Email Channels</h4>
                <p className="text-slate-500 text-xs mt-1.5 font-semibold text-emerald-600 tracking-wide">support@servista.com</p>
                <span className="text-[10px] text-emerald-500 font-bold block mt-2">Send an Email →</span>
              </div>
            </a>

            {/* 💬 Card 3: WhatsApp Support (Click to open WhatsApp Directly) */}
            <a 
              href="https://wa.me/923001234567" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-5 bg-white border border-slate-100 shadow-xl shadow-slate-200/50 rounded-2xl flex items-start gap-4 hover:border-purple-500/50 hover:shadow-purple-500/5 transition-all duration-300 group text-left cursor-pointer"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 text-purple-600 flex items-center justify-center text-xl shrink-0 shadow-inner group-hover:scale-110 transition-transform">💬</div>
              <div>
                <h4 className="text-sm font-black text-slate-950 group-hover:text-purple-600 transition-colors">Instant Support</h4>
                <p className="text-slate-500 text-xs mt-1.5 font-semibold text-purple-600 tracking-wide">+92 (300) 1234567</p>
                <span className="text-[10px] text-purple-500 font-bold block mt-2">Chat on WhatsApp →</span>
              </div>
            </a>

          </div>
        </div>

        {/* Right Column: High-End Interactive Form */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 p-8 sm:p-12 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-bl-[100px] pointer-events-none"></div>
          
          <h3 className="text-2xl font-black text-white tracking-tight mb-1 text-left">Send Us A Message</h3>
          <p className="text-slate-400 text-xs font-bold mb-8 uppercase tracking-wider text-left">We usually reply within a couple of hours</p>

          {statusMessage && (
            <div className={`mb-6 p-4 rounded-xl text-xs font-black text-center border transition-all animate-pulse ${
              statusMessage.startsWith('✅') 
                ? 'bg-emerald-950/50 border-emerald-500/30 text-emerald-400' 
                : 'bg-blue-950/50 border-blue-500/30 text-blue-400'
            }`}>
              {statusMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5 text-left">
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Full Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-3.5 bg-slate-950/60 border border-slate-800 rounded-xl font-medium text-xs text-white focus:outline-none focus:border-blue-500 focus:bg-slate-950 transition-all shadow-inner focus:ring-4 focus:ring-blue-500/10" placeholder="Enter your name" />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Email Address</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full px-4 py-3.5 bg-slate-950/60 border border-slate-800 rounded-xl font-medium text-xs text-white focus:outline-none focus:border-blue-500 focus:bg-slate-950 transition-all shadow-inner focus:ring-4 focus:ring-blue-500/10" placeholder="name@domain.com" />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Subject</label>
              <input type="text" name="subject" value={formData.subject} onChange={handleChange} required className="w-full px-4 py-3.5 bg-slate-950/60 border border-slate-800 rounded-xl font-medium text-xs text-white focus:outline-none focus:border-blue-500 focus:bg-slate-950 transition-all shadow-inner focus:ring-4 focus:ring-blue-500/10" placeholder="How can we help your dashboard?" />
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Message Description</label>
              <textarea name="message" value={formData.message} onChange={handleChange} required rows="5" className="w-full px-4 py-3.5 bg-slate-950/60 border border-slate-800 rounded-xl font-medium text-xs text-white focus:outline-none focus:border-blue-500 focus:bg-slate-950 transition-all shadow-inner focus:ring-4 focus:ring-blue-500/10 resize-none leading-relaxed" placeholder="Type your detailed message here..."></textarea>
            </div>

            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-xl shadow-lg shadow-blue-600/20 hover:shadow-xl hover:shadow-blue-600/30 transition-all text-xs uppercase tracking-widest mt-4">
              Dispatch Message →
            </button>
          </form>
        </div>

      </section>

    </div>
  );
};

export default ContactUs;