import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ProviderDashboard = () => {
  // ─── BOOKINGS PIPELINE REGISTRIES ───
  const [allBookings, setAllBookings] = useState([]); 
  const [filteredBookings, setFilteredBookings] = useState([]); 
  const [completedCount, setCompletedCount] = useState(0);
  const [loading, setLoading] = useState(true);
  
  // ─── DYNAMIC USER STATES ───
  const [providerName, setProviderName] = useState('Provider');
  const [providerRole, setProviderRole] = useState('Provider');
  const [isAvailable, setIsAvailable] = useState(true);
  const [providerSkill, setProviderSkill] = useState('');
  const [providerId, setProviderId] = useState('');
  const [providerAddress, setProviderAddress] = useState('Sialkot, Punjab'); 

  // ─── TAB NAVIGATION FILTER ENGINE ───
  const [activeTab, setActiveTab] = useState('Active'); 
  
  const navigate = useNavigate();

  useEffect(() => {
    const userJson = localStorage.getItem('user');
    if (!userJson) {
      navigate('/login');
      return;
    }
    
    const user = JSON.parse(userJson);
    setProviderName(user.name || 'Provider');
    setProviderRole(user.role || 'Provider');
    setProviderSkill(user.skill || ''); 
    setProviderAddress(user.address || user.location || 'Sialkot, Punjab'); 
    
    const currentStatus = user.isAvailable !== undefined ? user.isAvailable : true;
    setIsAvailable(currentStatus);
    
    const pId = user._id || user.id;
    setProviderId(pId);

    const fetchProviderBookings = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/bookings/provider/${pId}`);
        const data = await response.json();
        
        if (response.ok && Array.isArray(data)) {
          setAllBookings(data);
          const completedJobs = data.filter(b => b.status?.toLowerCase() === 'completed');
          setCompletedCount(completedJobs.length);
        }
        setLoading(false);
      } catch (error) {
        console.error("Provider dashboard fetch error:", error);
        setLoading(false);
      }
    };

    if (pId) {
      fetchProviderBookings();
    }
  }, [navigate]);

  useEffect(() => {
    let dataset = [];
    if (activeTab === 'Active') {
      dataset = allBookings.filter(b => 
        b.status?.toLowerCase() === 'approved' || 
        b.status?.toLowerCase() === 'pending' || 
        b.status?.toLowerCase() === 'active'
      );
    } else if (activeTab === 'Completed') {
      dataset = allBookings.filter(b => b.status?.toLowerCase() === 'completed');
    } else if (activeTab === 'Cancelled') {
      dataset = allBookings.filter(b => b.status?.toLowerCase() === 'cancelled');
    }
    setFilteredBookings(dataset);
  }, [activeTab, allBookings]);

  const handleToggleAvailability = async () => {
    const targetStatus = !isAvailable; 
    try {
      const response = await fetch(`http://localhost:5000/api/auth/update-availability/${providerId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isAvailable: targetStatus }),
      });

      if (response.ok) {
        setIsAvailable(targetStatus);
        const userJson = localStorage.getItem('user');
        if (userJson) {
          const user = JSON.parse(userJson);
          user.isAvailable = targetStatus;
          localStorage.setItem('user', JSON.stringify(user));
        }
      }
    } catch (error) {
      console.error("Availability updating network error:", error);
    }
  };

  const handleCompleteBooking = async (bookingId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/bookings/update-status/${bookingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Completed' }),
      });

      if (response.ok) {
        setAllBookings(prev => prev.map(b => (b._id === bookingId || b.id === bookingId) ? { ...b, status: 'Completed' } : b));
        setCompletedCount(prev => prev + 1);
        alert("🎉 Task successfully marked as Completed!");
      } else {
        alert("Failed to update execution status.");
      }
    } catch (error) {
      console.error("Status update error:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#111827]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#111827] text-gray-100 font-sans antialiased selection:bg-indigo-500/30">
      
      {/* TOP PREMIUM NAVIGATION BAR */}
      <nav className="bg-[#1f2937]/90 backdrop-blur-md border-b border-gray-700/50 fixed top-0 w-full z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-3">
              <span className="text-xl font-black tracking-wider text-indigo-400 uppercase">Servista</span>
              <span className="text-[10px] bg-gray-700 text-gray-300 font-extrabold px-2 py-0.5 rounded uppercase tracking-widest border border-gray-600">Panel</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-gray-100">{providerName}</p>
                <p className="text-xs text-gray-400 font-medium capitalize">
                  {providerSkill ? `${providerSkill} (${providerRole})` : providerRole}
                </p>
              </div>
              <button onClick={handleLogout} className="px-3.5 py-1.5 bg-gray-800 hover:bg-rose-950/40 text-gray-300 hover:text-rose-400 rounded-xl text-xs font-bold transition-all border border-gray-700 hover:border-rose-900/60">
                Log Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* MAIN LAYOUT SPACE */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12">
        
        {/* BANNER LAYOUT CONFIGURATION */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-[#1f2937] p-6 rounded-2xl border border-gray-700/60 shadow-lg">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold text-white tracking-tight">Welcome back, {providerName}!</h1>
              {providerSkill && (
                <span className="px-2.5 py-0.5 bg-indigo-950/50 text-indigo-400 text-xs font-bold rounded-md border border-indigo-900/60">
                  🛠️ {providerSkill}
                </span>
              )}
            </div>
            <p className="text-sm text-gray-400 mt-1.5 flex items-center gap-1.5">
              <span>📍</span> <span className="font-semibold text-gray-300">Base Workspace Location:</span> 
              <span className="text-indigo-400 font-medium">{providerAddress}</span>
            </p>
          </div>

          {/* DYNAMIC TOGGLE SYSTEM CONTROLLER */}
          <div className="flex items-center gap-3 bg-[#111827] p-3 rounded-xl border border-gray-700/50 w-fit">
            <span className={`text-[11px] font-bold uppercase tracking-wider ${isAvailable ? 'text-emerald-400' : 'text-gray-500'}`}>
              {isAvailable ? "● Online / Active " : "○ Currently Offline"}
            </span>
            <button
              onClick={handleToggleAvailability}
              className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-all duration-300 ${
                isAvailable ? 'bg-indigo-500 justify-end' : 'bg-gray-700 justify-start'
              }`}
            >
              <div className="bg-white w-4 h-4 rounded-full shadow-lg transform duration-300"></div>
            </button>
          </div>
        </div>

        {/* INTERACTIVE DATA TRACKING CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          
          <div 
            onClick={() => setActiveTab('Active')}
            className={`p-6 rounded-2xl border cursor-pointer transition-all shadow-md flex items-center justify-between ${
              activeTab === 'Active' ? 'bg-[#1f2937] border-indigo-500 ring-1 ring-indigo-500/20' : 'bg-[#1f2937] border-gray-700/50 hover:border-gray-600'
            }`}
          >
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Active Queue Assignments</p>
              <h3 className="text-3xl font-black text-white mt-1.5">
                {allBookings.filter(b => b.status?.toLowerCase() === 'approved' || b.status?.toLowerCase() === 'pending' || b.status?.toLowerCase() === 'active').length}
              </h3>
              <span className="text-[11px] text-indigo-400 font-medium mt-1 block">Click to view pipeline stack</span>
            </div>
            <div className="p-3 bg-[#111827] text-amber-400 rounded-xl border border-gray-700/50 text-lg">⏳</div>
          </div>

          <div 
            onClick={() => setActiveTab('Completed')}
            className={`p-6 rounded-2xl border cursor-pointer transition-all shadow-md flex items-center justify-between ${
              activeTab === 'Completed' ? 'bg-[#1f2937] border-indigo-500 ring-1 ring-indigo-500/20' : 'bg-[#1f2937] border-gray-700/50 hover:border-gray-600'
            }`}
          >
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Successful Execution Logs</p>
              <h3 className="text-3xl font-black text-white mt-1.5">{completedCount}</h3>
              <span className="text-[11px] text-indigo-400 font-medium mt-1 block">Click to view past workflows</span>
            </div>
            <div className="p-3 bg-[#111827] text-emerald-400 rounded-xl border border-gray-700/50 text-lg">🎉</div>
          </div>

          <div 
            onClick={() => setActiveTab('Cancelled')}
            className={`p-6 rounded-2xl border cursor-pointer transition-all shadow-md flex items-center justify-between ${
              activeTab === 'Cancelled' ? 'bg-[#1f2937] border-indigo-500 ring-1 ring-indigo-500/20' : 'bg-[#1f2937] border-gray-700/50 hover:border-gray-600'
            }`}
          >
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Dropped / Void Records</p>
              <h3 className="text-3xl font-black text-white mt-1.5">
                {allBookings.filter(b => b.status?.toLowerCase() === 'cancelled').length}
              </h3>
              <span className="text-[11px] text-indigo-400 font-medium mt-1 block">Click to view dropouts</span>
            </div>
            <div className="p-3 bg-[#111827] text-rose-400 rounded-xl border border-gray-700/50 text-lg">❌</div>
          </div>

        </div>

        {/* ARCHITECTURE TABLE PANEL */}
        <div className="bg-[#1f2937] rounded-2xl border border-gray-700/60 shadow-xl overflow-hidden">
          <div className="p-5 border-b border-gray-700/60 bg-[#1f2937] flex justify-between items-center">
            <h2 className="font-bold text-gray-200 text-sm tracking-wide">
              Pipeline Operational Registry — <span className="text-indigo-400 uppercase font-extrabold">{activeTab}</span>
            </h2>
            <span className="px-2.5 py-0.5 bg-[#111827] text-gray-400 text-[10px] font-bold rounded border border-gray-700 uppercase tracking-wider">Live Cache Connected</span>
          </div>

          <div className="overflow-x-auto">
            {filteredBookings.length === 0 ? (
              <div className="p-16 text-center">
                <div className="text-2xl mb-2">📥</div>
                <p className="text-sm font-semibold text-gray-400">No matching pipeline context entries found</p>
                <p className="text-xs text-gray-500 mt-1">Currently clear of administrative service dispatch operations.</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#111827] text-gray-400 font-bold text-xs uppercase tracking-wider border-b border-gray-700/50">
                    <th className="p-4 pl-6">Client Identity</th>
                    <th className="p-4">Service Scope</th>
                    <th className="p-4">Execution Target Address</th>
                    <th className="p-4">Schedule Frame</th>
                    <th className="p-4 pr-6 text-center">Operation Control</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700/40 text-sm font-medium text-gray-300">
                  {filteredBookings.map((booking) => (
                    <tr key={booking._id || booking.id} className="hover:bg-[#111827]/40 transition-colors">
                      <td className="p-4 pl-6">
                        <div className="font-bold text-white">{booking.customerName || 'Customer'}</div>
                        <div className="text-xs text-gray-500 font-normal mt-0.5">{booking.phone || 'N/A'}</div>
                      </td>
                      <td className="p-4">
                        <span className="px-2.5 py-0.5 bg-[#111827] text-gray-300 rounded text-xs border border-gray-700">
                          {booking.serviceTitle}
                        </span>
                      </td>
                      <td className="p-4 max-w-xs truncate text-gray-400 font-normal" title={booking.address}>
                        {booking.address}
                      </td>
                      <td className="p-4 text-gray-400 font-normal">
                        {booking.date ? new Date(booking.date).toLocaleDateString('en-GB') : 'Recent'}
                      </td>
                      <td className="p-4 pr-6 text-center">
                        {activeTab === 'Active' ? (
                          <button
                            onClick={() => handleCompleteBooking(booking._id || booking.id)}
                            className="px-4 py-1.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg text-xs font-bold shadow-md shadow-indigo-950/20 transition active:scale-95"
                          >
                            Complete Task
                          </button>
                        ) : (
                          <span className={`px-2.5 py-0.5 rounded text-[11px] font-bold uppercase border ${
                            activeTab === 'Completed' ? 'bg-emerald-950/30 text-emerald-400 border-emerald-900/50' : 'bg-rose-950/30 text-rose-400 border-rose-900/50'
                          }`}>
                            {booking.status}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProviderDashboard;