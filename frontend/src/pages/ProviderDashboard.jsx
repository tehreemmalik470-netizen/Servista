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
      dataset = allBookings.filter(b => {
        const s = b.status?.toLowerCase();
        return s === 'approved' || s === 'pending' || s === 'active';
      });
    } else if (activeTab === 'Completed') {
      dataset = allBookings.filter(b => b.status?.toLowerCase() === 'completed');
    } else if (activeTab === 'Cancelled') {
      dataset = allBookings.filter(b => {
        const s = b.status?.toLowerCase();
        return s === 'cancelled' || s === 'rejected';
      });
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

  const handleCancelBooking = async (bookingId, paymentMethod) => {
    const isOnlinePayment = paymentMethod && paymentMethod.toLowerCase() !== 'cash';
    const refundWarning = isOnlinePayment 
      ? "\n\n⚠️ Note: Since the client paid online, this cancellation will trigger a refund process." 
      : "";

    const confirmCancel = window.confirm(`Are you sure you want to reject this job and return it to the admin queue?${refundWarning}`);
    if (!confirmCancel) return;

    try {
      const response = await fetch(`http://localhost:5000/api/bookings/provider-cancel/${bookingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentMethod })
      });

      if (response.ok) {
        setAllBookings(prev => prev.map(b => (b._id === bookingId || b.id === bookingId) ? { ...b, status: 'Cancelled' } : b));
        alert("🔄 Booking successfully rejected and returned to Admin queue for reassignment.");
      } else {
        alert("❌ Failed to process cancellation.");
      }
    } catch (error) {
      console.error("Provider cancel error:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#F6FAFD]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0A1931]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F6FAFD] text-[#091F5C] font-sans antialiased selection:bg-blue-200">
      
      {/* TOP PREMIUM NAVIGATION BAR */}
      <nav className="bg-[#0A1931] border-b border-blue-900/40 fixed top-0 w-full z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-3">
              <span className="text-xl font-black tracking-wider text-white uppercase">Servista</span>
              <span className="text-[10px] bg-[#1e2e4a] text-blue-300 font-extrabold px-2 py-0.5 rounded uppercase tracking-widest border border-blue-800/40">Panel</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-white">{providerName}</p>
                <p className="text-xs text-blue-300/80 font-medium capitalize">
                  {providerSkill ? `${providerSkill} (${providerRole})` : providerRole}
                </p>
              </div>
              <button onClick={handleLogout} className="px-3.5 py-1.5 bg-[#1e2e4a] hover:bg-rose-950/60 text-white hover:text-rose-300 rounded-xl text-xs font-bold transition-all border border-blue-800/40 hover:border-rose-900">
                Log Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* MAIN LAYOUT SPACE */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12">
        
        {/* BANNER LAYOUT */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-[#0A1931] p-6 rounded-2xl border border-blue-950 shadow-xl text-white">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold text-white tracking-tight">Welcome back, {providerName}!</h1>
              {providerSkill && (
                <span className="px-2.5 py-0.5 bg-blue-900/40 text-blue-300 text-xs font-bold rounded-md border border-blue-800/50">
                  🛠️ {providerSkill}
                </span>
              )}
            </div>
            <p className="text-sm text-blue-200/70 mt-1.5 flex items-center gap-1.5">
              <span>📍</span> <span className="font-semibold text-blue-100">Base Workspace Location:</span> 
              <span className="text-blue-300 font-medium">{providerAddress}</span>
            </p>
          </div>

          {/* DYNAMIC TOGGLE SYSTEM CONTROLLER */}
          <div className="flex items-center gap-3 bg-[#061022] p-3 rounded-xl border border-blue-900/40 w-fit">
            <span className={`text-[11px] font-bold uppercase tracking-wider ${isAvailable ? 'text-emerald-400' : 'text-gray-400'}`}>
              {isAvailable ? "● Online / Active " : "○ Currently Offline"}
            </span>
            <button
              onClick={handleToggleAvailability}
              className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-all duration-300 ${
                isAvailable ? 'bg-emerald-500 justify-end' : 'bg-gray-600 justify-start'
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
              activeTab === 'Active' ? 'bg-[#0A1931] border-blue-800 text-white ring-2 ring-blue-500/20 shadow-blue-900/10' : 'bg-white border-[#B3CFE5]/60 text-[#091F5C] hover:border-[#4A7FA7]'
            }`}
          >
            <div>
              <p className={`text-xs font-bold uppercase tracking-wider ${activeTab === 'Active' ? 'text-blue-300' : 'text-[#4A7FA7]'}`}>Active Queue Assignments</p>
              <h3 className={`text-3xl font-black mt-1.5 ${activeTab === 'Active' ? 'text-white' : 'text-[#091F5C]'}`}>
                {allBookings.filter(b => b.status?.toLowerCase() === 'approved' || b.status?.toLowerCase() === 'pending' || b.status?.toLowerCase() === 'active').length}
              </h3>
              <span className={`text-[11px] font-medium mt-1 block ${activeTab === 'Active' ? 'text-blue-400' : 'text-[#4A7FA7]'}`}>Click to view pipeline stack</span>
            </div>
            <div className="p-3 bg-[#F6FAFD] rounded-xl border border-[#B3CFE5]/40 text-lg shadow-sm">⏳</div>
          </div>

          <div 
            onClick={() => setActiveTab('Completed')}
            className={`p-6 rounded-2xl border cursor-pointer transition-all shadow-md flex items-center justify-between ${
              activeTab === 'Completed' ? 'bg-[#0A1931] border-blue-800 text-white ring-2 ring-blue-500/20 shadow-blue-900/10' : 'bg-white border-[#B3CFE5]/60 text-[#091F5C] hover:border-[#4A7FA7]'
            }`}
          >
            <div>
              <p className={`text-xs font-bold uppercase tracking-wider ${activeTab === 'Completed' ? 'text-blue-300' : 'text-[#4A7FA7]'}`}>Successful Execution Logs</p>
              <h3 className={`text-3xl font-black mt-1.5 ${activeTab === 'Completed' ? 'text-white' : 'text-[#091F5C]'}`}>{completedCount}</h3>
              <span className={`text-[11px] font-medium mt-1 block ${activeTab === 'Completed' ? 'text-blue-400' : 'text-[#4A7FA7]'}`}>Click to view past workflows</span>
            </div>
            <div className="p-3 bg-[#F6FAFD] rounded-xl border border-[#B3CFE5]/40 text-lg shadow-sm">🎉</div>
          </div>

          <div 
            onClick={() => setActiveTab('Cancelled')}
            className={`p-6 rounded-2xl border cursor-pointer transition-all shadow-md flex items-center justify-between ${
              activeTab === 'Cancelled' ? 'bg-[#0A1931] border-blue-800 text-white ring-2 ring-blue-500/20 shadow-blue-900/10' : 'bg-white border-[#B3CFE5]/60 text-[#091F5C] hover:border-[#4A7FA7]'
            }`}
          >
            <div>
              <p className={`text-xs font-bold uppercase tracking-wider ${activeTab === 'Cancelled' ? 'text-blue-300' : 'text-[#4A7FA7]'}`}>Dropped / Void Records</p>
              <h3 className={`text-3xl font-black mt-1.5 ${activeTab === 'Cancelled' ? 'text-white' : 'text-[#091F5C]'}`}>
                {allBookings.filter(b => b.status?.toLowerCase() === 'cancelled').length}
              </h3>
              <span className={`text-[11px] font-medium mt-1 block ${activeTab === 'Cancelled' ? 'text-blue-400' : 'text-[#4A7FA7]'}`}>Click to view dropouts</span>
            </div>
            <div className="p-3 bg-[#F6FAFD] rounded-xl border border-[#B3CFE5]/40 text-lg shadow-sm">❌</div>
          </div>

        </div>

        {/* ARCHITECTURE TABLE PANEL */}
        <div className="bg-white rounded-2xl border border-[#B3CFE5]/60 shadow-xl overflow-hidden">
          <div className="p-5 border-b border-[#B3CFE5]/60 bg-white flex justify-between items-center">
            <h2 className="font-bold text-[#091F5C] text-sm tracking-wide">
              Pipeline Operational Registry — <span className="text-[#4A7FA7] uppercase font-extrabold">{activeTab}</span>
            </h2>
            <span className="px-2.5 py-0.5 bg-[#F6FAFD] text-[#4A7FA7] text-[10px] font-bold rounded border border-[#B3CFE5] uppercase tracking-wider">Live Cache Connected</span>
          </div>

          <div className="overflow-x-auto">
            {filteredBookings.length === 0 ? (
              <div className="p-16 text-center bg-white">
                <div className="text-2xl mb-2">📥</div>
                <p className="text-sm font-semibold text-[#091F5C]">No booking assignments</p>
                <p className="text-xs text-[#4A7FA7] mt-1">Currently clear of administrative service dispatch operations.</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#F6FAFD] text-[#4A7FA7] font-bold text-xs uppercase tracking-wider border-b border-[#B3CFE5]/60">
                    <th className="p-4 pl-6">Client Identity</th>
                    <th className="p-4">Service Scope (Multi-Service)</th>
                    <th className="p-4">Execution Target Address</th>
                    <th className="p-4">Schedule Frame</th>
                    <th className="p-4 text-center">Client Rating</th>
                    <th className="p-4 pr-6 text-center">Operation Control</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#B3CFE5]/30 text-sm font-medium text-[#091F5C]">
                  {filteredBookings.map((booking) => {
                    const totalAmt = Number(booking.totalAmount) || 0;
                    const staffShare = Math.round(totalAmt * 0.80); // Provider/Staff 80% share calculation

                    return (
                      <tr key={booking._id || booking.id} className="hover:bg-[#F6FAFD]/60 transition-colors">
                        <td className="p-4 pl-6">
                          <div className="flex flex-col gap-1">
                            <span className="font-bold text-[#091F5C]">{booking.customerName || 'Customer'}</span>
                            {booking.phone && <span className="text-xs text-gray-500">📞 {booking.phone}</span>}
                          </div>
                        </td>
                        
                        {/* Multi-Service Scope & Pricing / Payment Share Support */}
                        <td className="p-4">
                          <div className="flex flex-col gap-1">
                            {booking.services && Array.isArray(booking.services) && booking.services.length > 0 ? (
                              booking.services.map((s, idx) => (
                                <span key={idx} className="inline-block px-2.5 py-0.5 bg-[#F6FAFD] text-[#0A1931] rounded text-xs border border-[#B3CFE5] w-fit font-bold">
                                  {s.serviceTitle || s.name || s.title || 'Service'} {s.quantity > 1 ? `(x${s.quantity})` : ''}
                                </span>
                              ))
                            ) : (
                              <span className="px-2.5 py-0.5 bg-[#F6FAFD] text-[#0A1931] rounded text-xs border border-[#B3CFE5] w-fit font-bold">
                                {booking.serviceTitle || booking.serviceName || booking.title || booking.category || 'General Service'}
                              </span>
                            )}
                            
                            {booking.totalAmount && (
                              <div className="mt-1.5 flex flex-col gap-0.5 bg-blue-50/60 p-2 rounded-lg border border-blue-100 w-fit">
                                <span className="text-[11px] font-bold text-emerald-700">
                                  Total Service Price: Rs. {totalAmt} ({booking.paymentMethod || 'Cash'})
                                </span>
                                <span className="text-[11px] font-extrabold text-blue-900">
                                  Your Earnings (80%): Rs. {staffShare}
                                </span>
                              </div>
                            )}
                          </div>
                        </td>

                        <td className="p-4 text-gray-600 font-normal">{booking.address}</td>
                        
                        {/* Scheduled Date & Time Picker Format */}
                        <td className="p-4 text-gray-600 font-normal">
                          <div className="flex flex-col text-xs">
                            <span className="font-semibold">{booking.date ? new Date(booking.date).toLocaleDateString('en-GB') : 'Recent'}</span>
                            {booking.time && <span className="text-blue-600 font-bold mt-0.5">⏰ {booking.time}</span>}
                          </div>
                        </td>
                        
                        {/* Rating Column */}
                        <td className="p-4 text-center font-bold">
                          {booking.rating ? (
                            <span className="text-amber-500 bg-amber-50 px-2 py-1 rounded-lg border border-amber-200 text-xs">
                              ⭐ {booking.rating}/5
                            </span>
                          ) : (
                            <span className="text-gray-400 text-xs italic">-</span>
                          )}
                        </td>

                        <td className="p-4 pr-6 text-center">
                          {activeTab === 'Active' ? (
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => handleCompleteBooking(booking._id || booking.id)}
                                className="px-3 py-1.5 bg-[#0A1931] hover:bg-[#1A3D63] text-white rounded-lg text-xs font-bold transition active:scale-95"
                              >
                                Complete
                              </button>
                              <button
                                onClick={() => handleCancelBooking(booking._id || booking.id, booking.paymentMethod)}
                                className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 rounded-lg text-xs font-bold transition active:scale-95"
                              >
                                Reject
                              </button>
                            </div>
                          ) : (
                            <span className="text-xs font-bold uppercase">{booking.status}</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
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