import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyBookings = async () => {
      const userJson = localStorage.getItem('user');
      if (!userJson) {
        alert("⚠️ Please log in to view your bookings.");
        navigate('/login');
        return;
      }
      const user = JSON.parse(userJson);
      const userId = user._id || user.id;

      try {
        // Aapke controller ke mutabiq bilkul sahi route
        const response = await fetch(`http://localhost:5000/api/bookings/user/${userId}`);
        const data = await response.json();
        
        if (response.ok) {
          setBookings(data);
        }
        setLoading(false);
      } catch (error) {
        console.error("Fetch error:", error);
        setLoading(false);
      }
    };

    fetchMyBookings();
  }, [navigate]);

  // ─── CANCEL BOOKING FRONTEND LOGIC ───
  const handleCancelBooking = async (bookingId) => {
    const confirmCancel = window.confirm("Are you sure you want to cancel this booking?");
    if (!confirmCancel) return;

    try {
      const response = await fetch(`http://localhost:5000/api/bookings/cancel/${bookingId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert("✅ Booking cancelled successfully.");
        setBookings(bookings.filter(b => b._id !== bookingId));
      } else {
        alert("❌ Cancellation failed.");
      }
    } catch (error) {
      console.error("Cancel error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-16 px-4 sm:px-6 lg:px-8 font-sans antialiased">
      <div className="max-w-5xl mx-auto">
        
        <div className="text-left mb-10 space-y-2">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">My Bookings</h1>
          <p className="text-slate-500 text-sm font-medium">Track your service requests and real-time status.</p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : bookings.length === 0 ? (
          <div className="bg-white rounded-[2rem] p-12 text-center border border-slate-200/60 shadow-sm space-y-4">
            <span className="text-4xl">📅</span>
            <h3 className="text-lg font-bold text-slate-800">No Bookings Found</h3>
            <p className="text-slate-500 text-sm max-w-xs mx-auto">You haven't booked any services yet.</p>
            <button onClick={() => navigate('/')} className="bg-blue-600 text-white font-bold text-xs uppercase tracking-wider px-5 py-3 rounded-xl hover:bg-blue-700 transition-all">
              Book A Service Now
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => {
              const isPending = booking.status?.toLowerCase() === 'pending';
              const isApproved = booking.status?.toLowerCase() === 'approved';

              return (
                <div key={booking._id} className="bg-white rounded-[2rem] border border-slate-200/60 shadow-sm p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 text-left">
                  
                  {/* Left info */}
                  <div className="space-y-3 max-w-md">
                    <div className="flex items-center gap-3">
                      <h3 className="text-xl font-black text-slate-900 tracking-tight">{booking.serviceTitle}</h3>
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        isPending ? 'bg-amber-50 text-amber-600 border border-amber-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                      }`}>{booking.status || 'Pending'}</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 text-xs font-semibold text-slate-500">
                <div><span className="text-slate-400">📅 Date:</span> {new Date(booking.date).toLocaleDateString('en-GB')}</div>
                      <div><span className="text-slate-400">📍 Address:</span> {booking.address}</div>
                    </div>
                  </div>

                  {/* Middle: Provider assigned by Admin */}
                  <div className="min-w-[200px] bg-slate-50 p-4 rounded-2xl border border-slate-100 w-full md:w-auto">
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Assigned Technician</span>
                    {booking.providerName ? (
                      <div className="space-y-2">
                        <p className="text-sm font-black text-slate-800">🧑‍🔧 {booking.providerName}</p>
                        <a href="https://wa.me/923001234567" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg transition-all">
                          💬 Chat on WhatsApp
                        </a>
                      </div>
                    ) : (
                      <p className="text-xs font-bold text-amber-600 animate-pulse">⏳ Waiting for Admin...</p>
                    )}
                  </div>

                  {/* Right Action */}
                  <div className="w-full md:w-auto flex justify-end">
                    {isPending ? (
                      <button onClick={() => handleCancelBooking(booking._id)} className="w-full md:w-auto px-5 py-3 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 font-bold text-xs uppercase tracking-widest transition-all">
                        Cancel Booking
                      </button>
                    ) : (
                      <button disabled className="w-full md:w-auto px-5 py-3 rounded-xl bg-slate-100 text-slate-400 font-bold text-xs uppercase tracking-widest cursor-not-allowed">
                        Locked
                      </button>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;