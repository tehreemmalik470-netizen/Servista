import React, { useEffect, useState } from 'react';

const ProviderProfiles = () => {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/auth/providers');
        const data = await res.json();
        if (res.ok) {
          setProviders(data);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching providers:", error);
        setLoading(false);
      }
    };
    fetchProviders();
  }, []);

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
        <div className="mb-8">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Verified Servista Professionals</h1>
          <p className="text-slate-500 mt-1">Check live availability, star ratings, and chat directly to negotiate.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {providers.map((p) => (
            <div key={p._id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
              <div>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{p.name}</h3>
                    {/* Dynamic Skill Badge */}
                    <p className="text-xs mt-1">
                      <span className="px-2 py-0.5 rounded font-black uppercase tracking-wider text-[10px] bg-blue-50 text-blue-600 border border-blue-100">
                        ⚙️ {p.skill || 'General Professional'}
                      </span>
                    </p>
                  </div>
                  <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full ${
                    p.isAvailable ? 'bg-green-50 text-green-700' : 'bg-rose-50 text-rose-700'
                  }`}>
                    {p.isAvailable ? '● Available' : '○ Busy'}
                  </span>
                </div>

                {/* Rating System View */}
                <div className="flex items-center gap-1.5 mt-4 bg-slate-50 w-fit px-2.5 py-1 rounded-lg border border-slate-100">
                  <span className="text-amber-500 text-sm">⭐</span>
                  <span className="text-sm font-black text-slate-700">{p.averageRating || '0.0'}</span>
                  <span className="text-xs text-slate-400 font-medium">({p.totalReviews || 0} reviews)</span>
                </div>
              </div>

              {/* Direct Instant Action Panel */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col gap-2">
                <a
                  href={`https://wa.me/${p.phone || '923001234567'}?text=Hello%20${p.name},%20I%20found%20your%20profile%20on%20Servista%20for%20${p.skill || 'Service'}.%20I%20want%20to%20discuss%20pricing%20and%20book%20your%20service.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full text-center py-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 text-white ${
                    p.isAvailable ? 'bg-emerald-600 hover:bg-emerald-700 shadow-md' : 'bg-slate-300 cursor-not-allowed pointer-events-none'
                  }`}
                >
                  💬 Chat on WhatsApp
                </a>
              </div>

            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProviderProfiles;