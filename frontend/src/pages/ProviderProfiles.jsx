import React, { useEffect, useState } from 'react';

const ProviderProfiles = () => {
  const [providers, setProviders] = useState([]);
  const [filteredProviders, setFilteredProviders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search states for typing filters
  const [locationSearch, setLocationSearch] = useState('');
  const [skillSearch, setSkillSearch] = useState('');

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/auth/providers');
        const data = await res.json();
        if (res.ok) {
          setProviders(data);
          setFilteredProviders(data);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching providers:", error);
        setLoading(false);
      }
    };
    fetchProviders();
  }, []);

  // Real-time filter logic
  useEffect(() => {
    let result = providers;

    if (locationSearch.trim() !== '') {
      result = result.filter(p => 
        p.location && p.location.toLowerCase().includes(locationSearch.toLowerCase())
      );
    }

    if (skillSearch.trim() !== '') {
      result = result.filter(p => 
        p.skill && p.skill.toLowerCase().includes(skillSearch.toLowerCase())
      );
    }

    setFilteredProviders(result);
  }, [locationSearch, skillSearch, providers]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#F8FAFC]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F6F9] pt-28 pb-16 px-6 text-[#1E293B] font-sans antialiased">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* PREMIUM FILTER HEADER CONTAINER */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 md:p-8 shadow-sm flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 transition-all">
          <div className="space-y-1">
            <h1 className="text-3xl font-black text-[#0F172A] tracking-tight bg-gradient-to-r desert-gradient from-[#0F172A] to-[#1E3A8A] bg-clip-text">
              Verified Servista Professionals
            </h1>
            <p className="text-slate-500 text-sm font-medium">
              Type location or profession to find local experts instantly in your region.
            </p>
          </div>

          {/* Typing Filters Panel */}
          <div className="flex flex-wrap sm:flex-nowrap gap-4 w-full lg:w-auto">
            
            {/* Location Input Wrapper */}
            <div className="flex flex-col w-full sm:w-[220px]">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1">
                📍 Type Location
              </label>
              <input
                type="text"
                value={locationSearch}
                onChange={(e) => setLocationSearch(e.target.value)}
                placeholder="e.g. Model Town, Cantt..."
                className="w-full px-4 py-2.5 bg-[#F8FAFC] border border-slate-200 rounded-xl text-xs font-bold text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all shadow-inner"
              />
            </div>

            {/* Profession Input Wrapper */}
            <div className="flex flex-col w-full sm:w-[220px]">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1">
                ⚙️ Type Profession
              </label>
              <input
                type="text"
                value={skillSearch}
                onChange={(e) => setSkillSearch(e.target.value)}
                placeholder="Enter Profession"
                className="w-full px-4 py-2.5 bg-[#F8FAFC] border border-slate-200 rounded-xl text-xs font-bold text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all shadow-inner"
              />
            </div>

          </div>
        </div>

        {/* EXPERTS CRISP CARD GRID LAYOUT */}
        {filteredProviders.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-16 text-center max-w-md mx-auto shadow-md">
            <span className="text-5xl block mb-4">🔍</span>
            <h3 className="text-xl font-extrabold text-[#0F172A]">No Experts Found</h3>
            <p className="text-slate-500 text-sm mt-2 font-semibold leading-relaxed">
              Aapki dakhil karda location ya skill ke mutabiq koi expert nahi mila. Please cross-check spelling or try another term.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProviders.map((p) => (
              <div 
                key={p._id} 
                className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col justify-between hover:shadow-xl hover:border-blue-200 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group"
              >
                {/* Visual Accent Top Bar on Card Hover */}
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-blue-500 to-indigo-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                
                <div>
                  {/* Top Profile Meta Block */}
                  <div className="flex justify-between items-start gap-3">
                    <div className="space-y-1">
                      <h3 className="text-lg font-black text-[#0F172A] tracking-tight group-hover:text-blue-600 transition-colors">
                        {p.name}
                      </h3>
                      
                      {/* Dynamic Badges with Strong Contrast */}
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        {/* Skill Badge */}
                        <span className="px-2.5 py-1 rounded-lg font-extrabold uppercase tracking-wider text-[9px] bg-blue-50 text-blue-700 border border-blue-200/60 shadow-sm">
                          ⚙️ {p.skill || 'General Professional'}
                        </span>
                        
                        {/* Location Badge */}
                        <span className="px-2.5 py-1 rounded-lg font-extrabold uppercase tracking-wider text-[9px] bg-slate-100 text-slate-700 border border-slate-200 shadow-sm">
                          📍 {p.location || 'Sialkot'}
                        </span>
                      </div>
                    </div>
                    
                    {/* Status Badge with Glowing Dot Ring */}
                    <span className={`px-2.5 py-1 text-[10px] font-black tracking-widest uppercase rounded-full border flex items-center gap-1.5 ${
                      p.isAvailable 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                        : 'bg-rose-50 text-rose-700 border-rose-200'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${p.isAvailable ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}></span>
                      {p.isAvailable ? 'Available' : 'Busy'}
                    </span>
                  </div>

                  {/* Rating Badge System with Refined Background Layout */}
                  <div className="flex items-center gap-2 mt-6 bg-[#F8FAFC] w-fit px-3 py-1.5 rounded-xl border border-slate-200">
                    <span className="text-amber-500 text-xs">⭐</span>
                    <span className="text-xs font-black text-slate-800">{p.averageRating || '0.0'}</span>
                    <span className="text-[11px] text-slate-400 font-bold">({p.totalReviews || 0} reviews)</span>
                  </div>
                </div>

                {/* Chat option completely removed from here */}

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProviderProfiles;