import React from 'react';
import { Link } from 'react-router-dom';
const About = () => {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans antialiased flex flex-col justify-between">
      
      <div>
        {/* ─── HERO / HEADER SECTION ─── */}
        <div className="bg-slate-50 border-b border-slate-100 py-20 px-6 text-center">
          <div className="max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Behind Servista</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-[#0f172a] tracking-tight leading-none">
              Simplifying Home Services <br /> <span className="text-blue-600">For Everyone</span>
            </h1>
            <p className="text-slate-500 text-sm sm:text-base max-w-xl mx-auto leading-relaxed font-medium pt-2">
              Servista is Sialkot's trusted digital marketplace, connecting homeowners with verified, on-demand maintenance professionals in just a few clicks.
            </p>
          </div>
        </div>

        {/* ─── OUR MISSION & VISION ─── */}
        <section className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 text-left">
            <h2 className="text-sm font-black text-blue-600 uppercase tracking-[0.2em]">Our Core Mission</h2>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-snug">
              Empowering Local Experts & Ensuring Peace of Mind
            </h3>
            <p className="text-slate-500 text-sm sm:text-base leading-relaxed font-medium">
              Finding reliable help for plumbing, electrical breakdowns, or AC maintenance shouldn't take hours of endless phone calls. We built Servista to bridge the gap between skilled local talent and busy homeowners.
            </p>
            <p className="text-slate-500 text-sm sm:text-base leading-relaxed font-medium">
              Every professional on our platform is handpicked, reviewed by real customers, and accessible directly to make your home management absolutely hassle-free.
            </p>
          </div>
          <div className="relative">
            <div className="rounded-[2rem] overflow-hidden shadow-xl aspect-video md:aspect-[4/3] bg-slate-100 border border-slate-200">
              <img src="about-team.jpg" alt="Servista Team Collaboration" className="w-full h-full object-cover" onError={(e) => e.target.src = "https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=800"} />
            </div>
          </div>
        </section>

        {/* ─── WHY CHOOSE US / STATS FEATURES ─── */}
        <section className="bg-slate-950 text-white py-20 px-6 rounded-t-[3rem]">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16 space-y-2">
              <h2 className="text-xs font-black text-blue-400 uppercase tracking-[0.3em]">The Servista Edge</h2>
              <h3 className="text-3xl font-black tracking-tight">Why Hundreds Trust Us Daily</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="p-8 bg-slate-900 border border-slate-800 rounded-2xl space-y-4 hover:border-blue-500/30 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-blue-600/10 text-blue-400 border border-blue-500/20 flex items-center justify-center text-xl font-bold">⚙️</div>
                <h4 className="text-lg font-bold tracking-tight">Vetted Professionals</h4>
                <p className="text-slate-400 text-xs leading-relaxed font-medium">
                  We stringently check every profile and historical performance data before onboarding any service provider onto our expert portal.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="p-8 bg-slate-900 border border-slate-800 rounded-2xl space-y-4 hover:border-blue-500/30 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-emerald-600/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center text-xl font-bold">💬</div>
                <h4 className="text-lg font-bold tracking-tight">Direct Instant Chat</h4>
                <p className="text-slate-400 text-xs leading-relaxed font-medium">
                  No complicated hidden intermediate fees. Connect with technicians over WhatsApp instantly to discuss project requirements freely.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="p-8 bg-slate-900 border border-slate-800 rounded-2xl space-y-4 hover:border-blue-500/30 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-purple-600/10 text-purple-400 border border-purple-500/20 flex items-center justify-center text-xl font-bold">⭐</div>
                <h4 className="text-lg font-bold tracking-tight">Transparent Reviews</h4>
                <p className="text-slate-400 text-xs leading-relaxed font-medium">
                  Real feedback and honest ratings from fellow community members help you hire the perfect expert for your specific budget.
                </p>
              </div>
            </div>

            {/* Call to Action Inside About */}
            <div className="mt-20 text-center border-t border-slate-900 pt-12">
              <h4 className="text-xl font-bold mb-4">Ready to experience premium maintenance?</h4>
              <Link to="/experts" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3.5 rounded-xl text-xs uppercase tracking-widest transition-all shadow-xl shadow-blue-600/20">
                Browse Available Experts →
              </Link>
            </div>
          </div>
        </section>
      </div>

  
      
    </div>
  );
};

export default About;