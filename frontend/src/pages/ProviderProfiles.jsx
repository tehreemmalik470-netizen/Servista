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
      <div className="flex justify-center items-center h-screen bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Block */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Verified Servista Professionals</h1>
            <p className="text-slate-500 mt-1">Type location or profession to find local experts instantly.</p>
          </div>

          {/* Typing Filters Panel */}
          <div className="flex flex-wrap gap-4">
            
            {/* Location Type Input */}
            <div className="flex flex-col min-w-[200px]">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">📍 Type Location</label>
              <input
                type="text"
                value={locationSearch}
                onChange={(e) => setLocationSearch(e.target.value)}
                placeholder="e.g. Model Town, Cantt..."
                className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-slate-300"
              />
            </div>

            {/* Profession Type Input */}
            <div className="flex flex-col min-w-[200px]">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">⚙️ Type Profession</label>
              <input
                type="text"
                value={skillSearch}
                onChange={(e) => setSkillSearch(e.target.value)}
                placeholder="Enter Profession"
                className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-slate-300"
              />
            </div>

          </div>
        </div>

        {/* Experts Grid Layout */}
        {filteredProviders.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto mt-12">
            <span className="text-4xl">🔍</span>
            <h3 className="text-lg font-bold text-slate-900 mt-4">No Experts Found</h3>
            <p className="text-slate-500 text-sm mt-1">Aapki dakhil karda location ya skill ke mutabiq koi expert nahi mila.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProviders.map((p) => (
              <div key={p._id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
                <div>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">{p.name}</h3>
                      
                      <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                        {/* Skill Badge */}
                        <span className="px-2 py-0.5 rounded font-black uppercase tracking-wider text-[10px] bg-blue-50 text-blue-600 border border-blue-100">
                          ⚙️ {p.skill || 'General Professional'}
                        </span>
                        
                        {/* Location Badge */}
                        <span className="px-2 py-0.5 rounded font-black uppercase tracking-wider text-[10px] bg-slate-100 text-slate-600 border border-slate-200">
                          📍 {p.location || 'Sialkot'}
                        </span>
                      </div>
                    </div>
                    <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full ${
                      p.isAvailable ? 'bg-green-50 text-green-700' : 'bg-rose-50 text-rose-700'
                    }`}>
                      {p.isAvailable ? '● Available' : '○ Busy'}
                    </span>
                  </div>

                  {/* Rating System */}
                  <div className="flex items-center gap-1.5 mt-4 bg-slate-50 w-fit px-2.5 py-1 rounded-lg border border-slate-100">
                    <span className="text-amber-500 text-sm">⭐</span>
                    <span className="text-sm font-black text-slate-700">{p.averageRating || '0.0'}</span>
                    <span className="text-xs text-slate-400 font-medium">({p.totalReviews || 0} reviews)</span>
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