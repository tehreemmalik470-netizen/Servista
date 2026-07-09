import React, { useEffect, useState } from 'react';

const AdminDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [providers, setProviders] = useState([]);
  const [selectedProviders, setSelectedProviders] = useState({});
  
  // Search state for filtering providers inside assignment dropdowns
  const [providerSearchTerm, setProviderSearchTerm] = useState({});
  // New State: Global search bar for the Provider Registry Tab
  const [globalProviderSearch, setGlobalProviderSearch] = useState('');
  // Current Active Tab for Dashboard Navigation
  const [activeTab, setActiveTab] = useState('bookings');
  // Sub-filter for booking statuses based on top card clicks
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // 1. Fetch all booking requests
        const bookingsRes = await fetch('http://localhost:5000/api/bookings/all');
        const bookingsData = await bookingsRes.json();
        if (bookingsRes.ok) {
          setBookings(bookingsData);
        }

        // 2. Fetch all real providers with skills and availability status
        const providersRes = await fetch('http://localhost:5000/api/auth/providers');
        const providersData = await providersRes.json();
        if (providersRes.ok) {
          setProviders(providersData);
        }

        setLoading(false);
      } catch (error) {
        console.error("Admin dashboard initialization fetch error:", error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleAssignAndApprove = async (bookingId) => {
    const providerId = selectedProviders[bookingId];
    if (!providerId) {
      alert("Please select a provider first before approving!");
      return;
    }

    const chosenProvider = providers.find(p => (p._id || p.id) === providerId);

    try {
      const response = await fetch(`http://localhost:5000/api/bookings/update-status/${bookingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'Approved',
          providerId: chosenProvider._id || chosenProvider.id,
          providerName: chosenProvider.name
        })
      });

      if (response.ok) {
        alert(`🎉 Task successfully assigned to ${chosenProvider.name}!`);
        setBookings(prev => prev.map(b => b._id === bookingId ? { ...b, status: 'Approved', providerName: chosenProvider.name } : b));
      } else {
        alert("Failed to assign provider.");
      }
    } catch (error) {
      console.error("Assignment error:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // ─── DATA ANALYTICS MATHS ───
  const uniqueClientsCount = [...new Set(bookings.map(b => b.customerName))].length;
  const pendingCount = bookings.filter(b => b.status === 'Pending' || !b.status).length;
  const approvedCount = bookings.filter(b => b.status === 'Approved').length;
  const completedCount = bookings.filter(b => b.status === 'Completed').length;
  
  const totalProviders = providers.length;
  const availableProviders = providers.filter(p => p.isAvailable).length;
  const busyProviders = totalProviders - availableProviders;

  const totalRevenueCollected = bookings.reduce((acc, curr) => acc + (curr.price || 2500), 0);
  const adminShare = totalRevenueCollected * 0.20;
  const providerShare = totalRevenueCollected * 0.80;

  // ─── CLICKABLE CARDS FILTERING LOGIC ───
  const getFilteredBookings = () => {
    if (statusFilter === 'ActiveClients') {
      return bookings.filter(b => b.status === 'Pending' || b.status === 'Approved' || !b.status);
    }
    if (statusFilter === 'CompletedTasks') {
      return bookings.filter(b => b.status === 'Completed');
    }
    return bookings;
  };

  // ─── GLOBAL REGISTRY SEARCH FILTER LOGIC ───
  const getFilteredProviders = () => {
    return providers.filter(p => {
      const matchSkill = p.skill && p.skill.toLowerCase().includes(globalProviderSearch.toLowerCase());
      const matchName = p.name && p.name.toLowerCase().includes(globalProviderSearch.toLowerCase());
      const matchLocation = (p.address || p.location) && (p.address || p.location).toLowerCase().includes(globalProviderSearch.toLowerCase());
      return matchSkill || matchName || matchLocation;
    });
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex font-sans">
      
      {/* ─── SIDEBAR COMPONENT ─── */}
      <div className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col p-6">
        <div className="mb-10">
          <h2 className="text-xl font-black text-blue-500 tracking-wider uppercase">Servista Panel</h2>
          <p className="text-xs text-slate-500 font-bold mt-1">SYSTEM OVERSEER VIEW</p>
        </div>
        
        <nav className="flex-1 space-y-2 text-sm font-bold tracking-wide">
          <button 
            onClick={() => { setActiveTab('bookings'); setStatusFilter('All'); }} 
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${activeTab === 'bookings' && statusFilter === 'All' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-900 hover:text-white'}`}
          >
            📋 Booking Requests ({bookings.length})
          </button>
          <button 
            onClick={() => setActiveTab('providers')} 
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${activeTab === 'providers' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-900 hover:text-white'}`}
          >
            🛠️ Providers Registry ({totalProviders})
          </button>
          <button 
            onClick={() => setActiveTab('ledger')} 
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${activeTab === 'ledger' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-900 hover:text-white'}`}
          >
            💰 Financial Splits (80/20)
          </button>
        </nav>

        <div className="mt-auto pt-6 border-t border-slate-800 text-xs text-slate-500 font-bold text-center">
          Servista Core v2.1.0
        </div>
      </div>

      {/* ─── MAIN CONTENT AREA ─── */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* PREMIUM PLUG HEADER */}
        <header className="h-20 border-b border-slate-800 bg-slate-950/60 backdrop-blur-md px-8 flex items-center justify-between sticky top-0 z-10">
          <div>
            <h1 className="text-lg font-black tracking-tight text-white">Management Console</h1>
            <p className="text-xs text-slate-400 font-semibold mt-0.5">Sialkot Region Active Deployments</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right mr-2">
              <p className="text-xs font-bold text-white">System Admin</p>
              <p className="text-[10px] text-green-400 font-bold tracking-wider uppercase">Status: Connected</p>
            </div>
          </div>
        </header>

        {/* VIEW CONTAINER */}
        <div className="p-8 flex-1 overflow-y-auto max-w-7xl w-full mx-auto space-y-8">
          
          {/* ─── INTERACTIVE ANALYTICS CARDS ─── */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Clickable Client Summary */}
            <div 
              onClick={() => { setActiveTab('bookings'); setStatusFilter('ActiveClients'); }}
              className={`p-5 rounded-2xl shadow-md border cursor-pointer transition-all hover:scale-[1.02] ${statusFilter === 'ActiveClients' ? 'bg-slate-800 border-blue-500' : 'bg-gradient-to-br from-slate-950 to-slate-900 border-slate-800'}`}
            >
              <div className="text-slate-400 text-xs font-bold uppercase tracking-wider flex justify-between items-center">
                <span>Clients Summary</span>
                <span className="text-[10px] bg-blue-500/10 text-blue-400 px-1.5 py-0.5 rounded">list</span>
              </div>
              <div className="text-3xl font-black text-white mt-2">{uniqueClientsCount} <span className="text-xs text-slate-500 font-medium">Logged In</span></div>
              <div className="mt-2 flex gap-2 text-[11px] font-bold">
                <span className="text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-md">Pending: {pendingCount}</span>
                <span className="text-green-500 bg-green-500/10 px-2 py-0.5 rounded-md">Approved: {approvedCount}</span>
              </div>
            </div>

            {/* Clickable Task Progress */}
            <div 
              onClick={() => { setActiveTab('bookings'); setStatusFilter('CompletedTasks'); }}
              className={`p-5 rounded-2xl shadow-md border cursor-pointer transition-all hover:scale-[1.02] ${statusFilter === 'CompletedTasks' ? 'bg-slate-800 border-purple-500' : 'bg-gradient-to-br from-slate-950 to-slate-900 border-slate-800'}`}
            >
              <div className="text-slate-400 text-xs font-bold uppercase tracking-wider flex justify-between items-center">
                <span>Task Progress</span>
                <span className="text-[10px] bg-purple-500/10 text-purple-400 px-1.5 py-0.5 rounded">List</span>
              </div>
              <div className="text-3xl font-black text-purple-400 mt-2">{completedCount} <span className="text-xs text-slate-500 font-medium">Finished</span></div>
              <p className="text-slate-500 text-[11px] font-semibold mt-2">Click to review completed history logs.</p>
            </div>

            {/* Clickable Provider Resources */}
            <div 
              onClick={() => setActiveTab('providers')}
              className="bg-gradient-to-br from-slate-950 to-slate-900 border border-slate-800 p-5 rounded-2xl shadow-md cursor-pointer transition-all hover:scale-[1.02]"
            >
              <div className="text-slate-400 text-xs font-bold uppercase tracking-wider flex justify-between items-center">
                <span>Provider Resources</span>
                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded">View Registry</span>
              </div>
              <div className="text-3xl font-black text-blue-400 mt-2">{totalProviders} <span className="text-xs text-slate-500 font-medium">Registered</span></div>
              <div className="mt-2 flex gap-2 text-[11px] font-bold">
                <span className="text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">🟢 Available: {availableProviders}</span>
                <span className="text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-md">🔴 Busy: {busyProviders}</span>
              </div>
            </div>

            {/* Static Financial Overview Block */}
            <div className="bg-gradient-to-br from-slate-950 to-slate-900 border border-slate-800 p-5 rounded-2xl shadow-md opacity-85">
              <div className="text-slate-400 text-xs font-bold uppercase tracking-wider">Gross Splitting Overview</div>
              <div className="text-2xl font-black text-emerald-400 mt-2">Rs. {totalRevenueCollected.toLocaleString()}</div>
              <div className="mt-1 flex justify-between text-[10px] text-slate-400 font-bold">
                <span>Admin (20%): Rs.{adminShare}</span>
                <span>Staff (80%): Rs.{providerShare}</span>
              </div>
            </div>

          </div>

          {/* ─── TAB VIEW 1: BOOKINGS PIPELINE ─── */}
          {activeTab === 'bookings' && (
            <div className="bg-slate-950 rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
              <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <h3 className="font-extrabold text-white text-base">
                    {statusFilter === 'All' && "All Client Booking Requests Pipeline"}
                    {statusFilter === 'ActiveClients' && "Filtered View: Active / Pending Requests"}
                    {statusFilter === 'CompletedTasks' && "Filtered View: Completed Jobs History"}
                  </h3>
                  {statusFilter !== 'All' && (
                    <button 
                      onClick={() => setStatusFilter('All')} 
                      className="text-[11px] bg-slate-800 text-slate-300 px-2.5 py-1 rounded-lg font-bold hover:bg-slate-700 transition"
                    >
                      Clear Filter [Show All]
                    </button>
                  )}
                </div>
                <span className="bg-blue-600/10 border border-blue-500/30 text-blue-400 text-xs font-bold px-3 py-1 rounded-full">Live Action Mode</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-900/50 text-slate-400 font-bold text-xs uppercase border-b border-slate-800">
                      <th className="p-5 pl-6">Client & Target Service</th>
                      <th className="p-5">Location Routing</th>
                      <th className="p-5">Current Status</th>
                      <th className="p-5">Smart Staff Match & Dispatch</th>
                      <th className="p-5 pr-6 text-center">Execution Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-900 text-sm font-semibold text-slate-300">
                    {getFilteredBookings().map((booking) => {
                      const currentSearch = providerSearchTerm[booking._id] || '';
                      const filteredProviders = providers.filter(p => {
                        const skillsMatch = p.skill && p.skill.toLowerCase().includes(currentSearch.toLowerCase());
                        const nameMatch = p.name && p.name.toLowerCase().includes(currentSearch.toLowerCase());
                        return skillsMatch || nameMatch;
                      });

                      return (
                        <tr key={booking._id} className="hover:bg-slate-900/30 transition">
                          <td className="p-5 pl-6">
                            <div className="font-extrabold text-white text-base">{booking.customerName}</div>
                            <div className="text-xs text-blue-400 font-black uppercase mt-1 tracking-wider">{booking.serviceTitle}</div>
                          </td>
                          <td className="p-5">
                            <div className="text-slate-300 font-bold">{booking.address || 'Not Provided'}</div>
                            <div className="text-[10px] text-slate-500 font-semibold uppercase mt-0.5">Sialkot Operational Zone</div>
                          </td>
                          <td className="p-5">
                            <span className={`px-3 py-1 text-xs font-black rounded-xl tracking-wide uppercase ${
                              booking.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                              booking.status === 'Completed' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' :
                              'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            }`}>
                              {booking.status || 'Pending'}
                            </span>
                          </td>
                          <td className="p-5">
                            {booking.status === 'Pending' ? (
                              <div className="space-y-2 max-w-xs">
                                <input 
                                  type="text"
                                  placeholder="🔍 Filter skill/name (e.g. 'cleaning')"
                                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-xs font-semibold text-white focus:outline-none focus:border-blue-500"
                                  value={currentSearch}
                                  onChange={(e) => setProviderSearchTerm({...providerSearchTerm, [booking._id]: e.target.value})}
                                />
                                <select
                                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs font-bold text-slate-200 focus:outline-none focus:border-blue-500"
                                  onChange={(e) => setSelectedProviders({ ...selectedProviders, [booking._id]: e.target.value })}
                                  defaultValue=""
                                >
                                  <option value="" disabled>Select Matching Expert</option>
                                  {filteredProviders.map(p => {
                                    const pId = p._id || p.id;
                                    // Resolving sign up saved coordinates/addresses
                                    const verifiedLocation = p.address || p.location || p.city || 'Sialkot';
                                    return (
                                      <option key={pId} value={pId} className="bg-slate-950 text-slate-200">
                                        {p.name} ({p.skill || 'Expert'}) — {p.isAvailable ? '🟢 Available' : '🔴 Busy'} — ⭐{p.rating || '4.8'} — Loc: [{verifiedLocation}]
                                      </option>
                                    );
                                  })}
                                </select>
                              </div>
                            ) : (
                              <div className="flex flex-col gap-1">
                                <span className="text-xs text-slate-400 font-bold flex items-center gap-1.5">
                                  👤 Assigned Partner: <strong className="text-blue-400">{booking.providerName || "Staff User"}</strong>
                                </span>
                              </div>
                            )}
                          </td>
                          <td className="p-5 pr-6 text-center">
                            {booking.status === 'Pending' && (
                              <button
                                onClick={() => handleAssignAndApprove(booking._id)}
                                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black tracking-wide uppercase transition-all shadow-md shadow-blue-600/10 cursor-pointer"
                              >
                                Approve & Dispatch
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ─── TAB VIEW 2: PROVIDERS LIST REGISTRY WITH LIVE SEARCH ─── */}
          {activeTab === 'providers' && (
            <div className="bg-slate-950 rounded-2xl border border-slate-800 shadow-xl overflow-hidden space-y-4">
              
              {/* TOP ACTIONS AND SERVICE MASTER SEARCH BAR */}
              <div className="p-6 border-b border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="font-extrabold text-white text-base">Registered Service Providers Network</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Displays the true address inserted by experts during system registration.</p>
                </div>
                
                {/* GLOBAL SEARCH FIELD FOR SPECIFIC SERVICES */}
                <div className="w-full sm:w-72">
                  <input 
                    type="text"
                    placeholder="🔍 Search Service Type (e.g., Solar, Carpenter)..."
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs font-bold text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                    value={globalProviderSearch}
                    onChange={(e) => setGlobalProviderSearch(e.target.value)}
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-900/50 text-slate-400 font-bold text-xs uppercase border-b border-slate-800">
                      <th className="p-5 pl-6">Provider Name</th>
                      <th className="p-5">Profession Specialization</th>
                      <th className="p-5">Base Location (Sign-up Address)</th>
                      <th className="p-5">Status</th>
                      <th className="p-5 pr-6">Performance Score</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-900 text-sm font-semibold text-slate-300">
                    {getFilteredProviders().length > 0 ? (
                      getFilteredProviders().map((p) => (
                        <tr key={p._id || p.id} className="hover:bg-slate-900/30 transition">
                          <td className="p-5 pl-6 font-extrabold text-white text-base">{p.name}</td>
                          <td className="p-5">
                            <span className="bg-slate-900 text-blue-400 border border-slate-800 px-3 py-1 rounded-lg text-xs font-black tracking-wider uppercase">
                              {p.skill || 'General Expert'}
                            </span>
                          </td>
                          {/* Showing real saved location fields dynamically */}
                          <td className="p-5 text-emerald-400 font-bold tracking-wide">
                            {p.address || p.location || p.city || 'Not Registered'}
                          </td>
                          <td className="p-5">
                            <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${p.isAvailable ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                              {p.isAvailable ? '🟢 Online / Free' : '🔴 Engaged / Busy'}
                            </span>
                          </td>
                          <td className="p-5 pr-6 text-amber-400 font-extrabold text-sm">
                            ⭐ {p.rating || '4.9'} <span className="text-xs text-slate-500 font-bold ml-1">(Top Feedback Rated)</span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="p-10 text-center text-xs font-bold text-slate-500">
                          ❌ No providers found matching "{globalProviderSearch}" service type.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ─── TAB VIEW 3: 80% / 20% FINANCIAL LEDGER ─── */}
          {activeTab === 'ledger' && (
            <div className="bg-slate-950 rounded-2xl border border-slate-800 shadow-xl overflow-hidden space-y-6 p-6">
              <div>
                <h3 className="font-extrabold text-white text-base">Escrow Payment Split Ledger (Temporary Setup)</h3>
                <p className="text-xs text-slate-400 mt-1">Note: This screen contains static visual structures. Full customization will be configured later when integrating payment gateways.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-900 p-5 rounded-xl border border-slate-800">
                  <div className="text-slate-400 text-xs font-bold uppercase">Total Client Collection</div>
                  <div className="text-2xl font-black text-white mt-2">Rs. {totalRevenueCollected.toLocaleString()}</div>
                </div>
                <div className="bg-slate-900 p-5 rounded-xl border border-slate-800">
                  <div className="text-slate-400 text-xs font-bold uppercase">Admin Commissions (20%)</div>
                  <div className="text-2xl font-black text-blue-400 mt-2">Rs. {adminShare.toLocaleString()}</div>
                </div>
                <div className="bg-slate-900 p-5 rounded-xl border border-slate-800">
                  <div className="text-slate-400 text-xs font-bold uppercase">Provider Payroll Payouts (80%)</div>
                  <div className="text-2xl font-black text-purple-400 mt-2">Rs. {providerShare.toLocaleString()}</div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

    </div>
  );
};

export default AdminDashboard;