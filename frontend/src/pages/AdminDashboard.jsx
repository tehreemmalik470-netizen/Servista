import React, { useEffect, useState } from 'react';

const AdminDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // ─── NEW: REAL PROVIDERS STATE FROM BACKEND ───
  const [providers, setProviders] = useState([]);
  const [selectedProviders, setSelectedProviders] = useState({});

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // 1. Fetch all booking requests
        const bookingsRes = await fetch('http://localhost:5000/api/bookings/all');
        const bookingsData = await bookingsRes.json();
        if (bookingsRes.ok) {
          setBookings(bookingsData);
        }

        // 2. NEW: Fetch all real providers with skills and availability status
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

    // Real list se selected provider nikalna
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
        // UI instantly sync refresh
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
      <div className="flex justify-center items-center h-screen bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Admin Control Center</h1>
          <p className="text-slate-500 mt-1">Review customer booking requests and assign professional staff.</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-400 font-bold text-xs uppercase border-b border-slate-100">
                <th className="p-4 pl-6">Client & Service</th>
                <th className="p-4">Address</th>
                <th className="p-4">Status</th>
                <th className="p-4">Assign Staff</th>
                <th className="p-4 pr-6 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm font-semibold text-slate-600">
              {bookings.map((booking) => (
                <tr key={booking._id} className="hover:bg-slate-50/50 transition">
                  <td className="p-4 pl-6">
                    <div className="font-extrabold text-slate-900">{booking.customerName}</div>
                    <div className="text-xs text-blue-600 font-bold uppercase mt-0.5">{booking.serviceTitle}</div>
                  </td>
                  <td className="p-4 text-slate-500 font-medium">{booking.address}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${
                      booking.status === 'Approved' ? 'bg-green-50 text-green-700' :
                      booking.status === 'Completed' ? 'bg-purple-50 text-purple-700' :
                      'bg-amber-50 text-amber-700'
                    }`}>
                      {booking.status || 'Pending'}
                    </span>
                  </td>
                  <td className="p-4">
                    {booking.status === 'Pending' ? (
                      <select
                        className="bg-white border border-slate-200 rounded-xl p-2 text-xs font-bold text-slate-700 focus:outline-none"
                        onChange={(e) => setSelectedProviders({ ...selectedProviders, [booking._id]: e.target.value })}
                        defaultValue=""
                      >
                        <option value="" disabled>Select Provider</option>
                        {providers.map(p => {
                          const pId = p._id || p.id;
                          return (
                            <option key={pId} value={pId}>
                              {p.name} ({p.skill || 'General'}) — {p.isAvailable ? '🟢 Available' : '🔴 Busy'}
                            </option>
                          );
                        })}
                      </select>
                    ) : (
                      <span className="text-xs text-slate-400 font-bold">Assigned to: {booking.providerName || "Staff"}</span>
                    )}
                  </td>
                  <td className="p-4 pr-6 text-center">
                    {booking.status === 'Pending' && (
                      <button
                        onClick={() => handleAssignAndApprove(booking._id)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
                      >
                        Approve & Assign
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;