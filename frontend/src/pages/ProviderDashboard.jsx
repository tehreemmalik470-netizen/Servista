import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ProviderDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [completedCount, setCompletedCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [providerName, setProviderName] = useState('Provider');
  const [providerRole, setProviderRole] = useState('Provider');
  
  // ─── NEW: AVAILABILITY & SKILL STATES ───
  const [isAvailable, setIsAvailable] = useState(true);
  const [providerSkill, setProviderSkill] = useState('');
  const [providerId, setProviderId] = useState('');
  
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Logged-in provider details localStorage se nikalna
    const userJson = localStorage.getItem('user');
    if (!userJson) {
      navigate('/login');
      return;
    }
    
    const user = JSON.parse(userJson);
    setProviderName(user.name || 'Provider');
    setProviderRole(user.role || 'Provider');
    setProviderSkill(user.skill || ''); // Registered Skill Display
    
    // Safety check fallback: Agar user entity refresh response mein structure dynamic ho
    const currentStatus = user.isAvailable !== undefined ? user.isAvailable : true;
    setIsAvailable(currentStatus);
    
    const pId = user._id || user.id;
    setProviderId(pId);

    // 2. Sirf is provider ke live assigned tasks backend se lana
    const fetchProviderBookings = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/bookings/provider/${pId}`);
        const data = await response.json();
        
        if (response.ok) {
          // Filter only 'Approved' tasks for the active panel
          const activeJobs = data.filter(booking => booking.status === 'Approved');
          setBookings(activeJobs);

          // Calculate completed counts specifically for this provider
          const completedJobs = data.filter(booking => booking.status === 'Completed');
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

  // ─── NEW: TOGGLE AVAILABILITY HANDLER ───
  const handleToggleAvailability = async () => {
    const targetStatus = !isAvailable;
    try {
      const response = await fetch(`http://localhost:5000/api/auth/update-availability/${providerId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isAvailable: targetStatus }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsAvailable(data.isAvailable);
        
        // LocalStorage ko update karna taake refresh par status barkarar rahe
        const userJson = localStorage.getItem('user');
        if (userJson) {
          const user = JSON.parse(userJson);
          user.isAvailable = data.isAvailable;
          localStorage.setItem('user', JSON.stringify(user));
        }
      } else {
        alert(data.message || "Failed to update availability status.");
      }
    } catch (error) {
      console.error("Availability updating network error:", error);
      alert("Backend se communication fail ho gayi!");
    }
  };

  // 3. Status 'Completed' mark karne ka dynamic handler
  const handleCompleteBooking = async (bookingId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/bookings/update-status/${bookingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'Completed' }),
      });

      if (response.ok) {
        // Dashboard state ko instantly refresh karna without reload
        setBookings((prev) => prev.filter(b => b._id !== bookingId));
        setCompletedCount((prev) => prev + 1);
        alert("🎉 Task successfully marked as Completed!");
      } else {
        alert("Failed to update status.");
      }
    } catch (error) {
      console.error("Status update error:", error);
    }
  };

  // 4. Logout Handler
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      
      {/* PROFESSIONAL TOP NAVIGATION BAR */}
      <nav className="bg-white border-b border-slate-200 fixed top-0 w-full z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-3">
              <span className="text-xl font-black tracking-wider text-blue-600 uppercase">Servista</span>
              <span className="text-xs bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded-md uppercase">Panel</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-800">{providerName}</p>
                <p className="text-xs text-slate-400 font-medium capitalize">
                  {providerSkill ? `${providerSkill} (${providerRole})` : providerRole}
                </p>
              </div>
              <button 
                onClick={handleLogout}
                className="px-3.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl text-xs font-bold transition-all"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* MAIN LAYOUT WRAPPER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12">
        
        {/* WELCOME BANNER & LIVE TOGGLE ENGINE */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Welcome back, {providerName.split(' ')[0]}!</h1>
              {providerSkill && (
                <span className="px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-extrabold rounded-lg border border-slate-200">
                  🛠️ {providerSkill}
                </span>
              )}
            </div>
            <p className="text-slate-500 mt-1">Manage, view, and complete your assigned workspace tasks.</p>
          </div>

          {/* DYNAMIC TOGGLE COMPONENT */}
          <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200/60 w-fit">
            <span className={`text-xs font-black uppercase tracking-wider ${isAvailable ? 'text-green-600' : 'text-rose-500'}`}>
              {isAvailable ? "● Active & Available" : "○ Offline / Busy"}
            </span>
            <button
              onClick={handleToggleAvailability}
              className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-all duration-300 ${
                isAvailable ? 'bg-green-500 justify-end' : 'bg-slate-300 justify-start'
              }`}
            >
              <div className="bg-white w-4 h-4 rounded-full shadow-md transform duration-300"></div>
            </button>
          </div>
        </div>

        {/* METRICS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          
          {/* Card 1: Active Jobs */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Assignments</p>
              <h3 className="text-3xl font-black text-slate-900 mt-1">{bookings.length}</h3>
            </div>
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl text-xl">⏳</div>
          </div>

          {/* Card 2: Completed Jobs */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Completed Jobs</p>
              <h3 className="text-3xl font-black text-slate-900 mt-1">{completedCount}</h3>
            </div>
            <div className="p-3 bg-green-50 text-green-600 rounded-xl text-xl">🎉</div>
          </div>

          {/* Card 3: Earnings Simulation */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Estimated Payout</p>
              <h3 className="text-3xl font-black text-green-600 mt-1">Rs. {completedCount * 1500}</h3>
            </div>
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl text-xl">💰</div>
          </div>

        </div>

        {/* JOBS TABLE */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 bg-white flex justify-between items-center">
            <h2 className="font-extrabold text-slate-800 text-base tracking-tight">Assigned Action Panel</h2>
            <span className="px-2.5 py-0.5 bg-blue-50 text-blue-600 text-xs font-bold rounded-md">Live Sync</span>
          </div>

          <div className="overflow-x-auto">
            {bookings.length === 0 ? (
              <div className="p-16 text-center">
                <div className="text-3xl mb-2">📥</div>
                <p className="text-sm font-bold text-slate-700">All clear!</p>
                <p className="text-xs text-slate-400 mt-0.5">No approved bookings are currently assigned to you.</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/70 text-slate-400 font-bold text-xs uppercase tracking-wider border-b border-slate-100">
                    <th className="p-4 pl-6">Client Info</th>
                    <th className="p-4">Service Category</th>
                    <th className="p-4">Operational Address</th>
                    <th className="p-4">Scheduled Date</th>
                    <th className="p-4 pr-6 text-center">Execution Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm font-semibold text-slate-600">
                  {bookings.map((booking) => (
                    <tr key={booking._id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-4 pl-6">
                        <div className="font-extrabold text-slate-900">{booking.customerName}</div>
                        <div className="text-xs text-slate-400 font-normal mt-0.5">{booking.phone}</div>
                      </td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 bg-blue-50/80 text-blue-700 rounded-lg text-xs font-extrabold border border-blue-100">
                          {booking.serviceTitle}
                        </span>
                      </td>
                      <td className="p-4 max-w-xs truncate text-slate-500 font-medium" title={booking.address}>
                        {booking.address}
                      </td>
                      <td className="p-4 text-slate-500 font-medium">
                        {new Date(booking.date).toLocaleDateString('en-GB')}
                      </td>
                      <td className="p-4 pr-6 text-center">
                        <button
                          onClick={() => handleCompleteBooking(booking._id)}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm transition active:scale-95"
                        >
                          Mark as Completed
                        </button>
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