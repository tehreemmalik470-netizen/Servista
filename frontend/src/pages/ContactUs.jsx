import React, { useState } from 'react';

const ContactUs = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

  const handleDispatch = (e) => {
    e.preventDefault();
    // Direct link generation to user's native email client targeting Servista standard email inbox
    const mailtoUrl = `mailto:support@servista.com?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(`Hi Servista Team,\n\n${formData.message}\n\nBest Regards,\n${formData.name}\nEmail: ${formData.email}`)}`;
    window.location.href = mailtoUrl;
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans antialiased flex flex-col justify-between">
      
      <div>
        {/* ─── HERO / HEADER SECTION (GET IN TOUCH) ─── */}
        <div className="bg-slate-50 border-b border-slate-100 py-20 px-6 text-center">
          <div className="max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Get In Touch</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-[#0f172a] tracking-tight leading-none">
              Need Help?  <br /> <span className="text-blue-600">We 're Here for You</span>
            </h1>
            <p className="text-slate-500 text-sm sm:text-base max-w-xl mx-auto leading-relaxed font-medium pt-2">
              Have a question about our maintenance portal or need specialized assistance? Reach out to us and our support team will respond quickly.
            </p>
          </div>
        </div>

        {/* ─── MAIN CONTENT AREA ─── */}
        <div className="max-w-7xl mx-auto px-6 w-full my-16 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* LEFT PANEL: CHANNELS & PHONE NUMBERS */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            
            {/* Email Channels Card */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-start gap-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl text-lg">✉</div>
              <div>
                <h3 className="font-extrabold text-slate-800 text-sm tracking-tight">Email Channels</h3>
                <a href="mailto:support@servista.com" className="text-slate-500 text-xs mt-1 block hover:text-blue-600 font-medium">support@servista.com</a>
                <a href="mailto:support@servista.com" className="text-blue-600 text-xs font-bold mt-2 block hover:underline">Send an Email ➔</a>
              </div>
            </div>

            {/* Instant Support with Dual Action Click-to-Dial & WhatsApp Protocol */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-start gap-4">
              <div className="p-3 bg-green-50 text-green-600 rounded-xl text-lg">💬</div>
              <div>
                <h3 className="font-extrabold text-slate-800 text-sm tracking-tight">Instant Support</h3>
                {/* Dial Feature (Direct Call Protocol) */}
                <a href="tel:+923001234567" className="text-slate-500 text-xs mt-1 block hover:text-blue-600 font-medium">Call: +92 (300) 1234567</a>
                {/* WhatsApp Chat Protocol */}
                <a 
                  href="https://wa.me/923001234567?text=Hi%20Servista,%20I%20need%20some%20assistance." 
                  target="_blank" 
                  rel="noreferrer" 
                  className="text-green-600 text-xs font-bold mt-2 block hover:underline"
                >
                  Chat on WhatsApp ➔
                </a>
              </div>
            </div>

          </div>

          {/* RIGHT PANEL: DYNAMIC CORRESPONDENCE FORM */}
          <div className="lg:col-span-8 bg-[#0b172a] p-8 rounded-3xl text-white shadow-xl">
            <form onSubmit={handleDispatch} className="flex flex-col gap-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Full Name</label>
                  <input 
                    type="text" required placeholder="Enter your name"
                    value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="bg-[#1e293b] border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Email Address</label>
                  <input 
                    type="email" required placeholder="name@domain.com"
                    value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="bg-[#1e293b] border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Subject</label>
                <input 
                  type="text" required placeholder="How can we help your dashboard?"
                  value={formData.subject} onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  className="bg-[#1e293b] border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Message Description</label>
                <textarea 
                  rows="4" required placeholder="Type your detailed message here..."
                  value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="bg-[#1e293b] border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 resize-none"
                ></textarea>
              </div>

              <button 
                type="submit" 
                className="mt-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:opacity-95 text-white font-extrabold text-xs uppercase tracking-widest py-4 rounded-xl shadow-lg transition duration-200"
              >
                Dispatch Message ➔
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ContactUs;