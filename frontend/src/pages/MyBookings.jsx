import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reschedulingId, setReschedulingId] = useState(null);
  const [newDate, setNewDate] = useState('');
  const navigate = useNavigate();

  // Nayi States Rating ke liye
  const [ratingModal, setRatingModal] = useState({ isOpen: false, bookingId: null });
  const [ratingValue, setRatingValue] = useState(5);

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

  // Rating Submit Logic
 const handleRatingSubmit = async () => {
  // Check karein ke rating valid hai ya nahi
  if (ratingValue < 1 || ratingValue > 5) {
    alert("Please enter a rating between 1 and 5.");
    return;
  }

  try {
    const response = await fetch(`http://localhost:5000/api/bookings/rate/${ratingModal.bookingId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rating: ratingValue }) // Yahan 'ratingValue' bhej rahe hain
    });

    if (response.ok) {
      alert("✅ Rating saved successfully!");
      window.location.reload(); 
    } else {
      alert("❌ Failed to submit rating.");
    }
  } catch (error) {
    console.error("Rating error:", error);
  }
};
  

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

  const handleRescheduleBooking = async (bookingId) => {
    if (!newDate) {
      alert("Please select a valid new date.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/bookings/reschedule/${bookingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: newDate })
      });

      if (response.ok) {
        alert("✅ Booking rescheduled successfully.");
        setBookings(bookings.map(b => b._id === bookingId ? { ...b, date: newDate } : b));
        setReschedulingId(null);
        setNewDate('');
      } else {
        alert("❌ Reschedule failed. Please try again.");
      }
    } catch (error) {
      console.error("Reschedule error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-24 px-4 sm:px-6 lg:px-8 font-sans antialiased text-[#0F172A]">
      <div className="max-w-5xl mx-auto space-y-10">
        
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 md:p-8 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-black text-[#0F172A] tracking-tight bg-gradient-to-r from-[#0F172A] to-[#1E3A8A] bg-clip-text">
              My Bookings
            </h1>
            <p className="text-slate-500 text-sm font-medium">Track, reschedule, or manage your service requests in real-time.</p>
          </div>
          <div>
            <button 
              onClick={() => navigate('/')} 
              className="px-5 py-2.5 bg-blue-600 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl hover:bg-blue-700 hover:shadow-lg transition-all"
            >
              + New Service
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : bookings.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center border border-slate-200/80 shadow-md space-y-5 max-w-md mx-auto">
            <span className="text-5xl block">📅</span>
            <h3 className="text-xl font-extrabold text-[#0F172A]">No Bookings Found</h3>
            <p className="text-slate-500 text-sm font-medium leading-relaxed">You haven't booked any services yet. Start exploring local premium experts right now.</p>
            <button onClick={() => navigate('/')} className="bg-blue-600 text-white font-black text-xs uppercase tracking-widest px-6 py-3.5 rounded-xl hover:bg-blue-700 transition-all shadow-sm">
              Book A Service Now
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => {
              const status = booking.status?.toLowerCase();
              const isPending = status === 'pending';
              const isCompleted = status === 'completed';

              return (
                <div 
                  key={booking._id} 
                  className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 hover:shadow-md transition-all relative overflow-hidden group"
                >
                  <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-blue-500 to-indigo-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />

                  <div className="space-y-4 max-w-sm w-full">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="text-xl font-black text-[#0F172A] tracking-tight group-hover:text-blue-600 transition-colors">
                        {booking.serviceTitle}
                      </h3>
                      <span className={`px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                        isPending ? 'bg-amber-50 text-amber-600 border-amber-200/60' : 
                        isCompleted ? 'bg-emerald-50 text-emerald-600 border-emerald-200/60' : 'bg-slate-50 text-slate-600 border-slate-200'
                      }`}>
                        ● {booking.status || 'Pending'}
                      </span>
                    </div>

                    <div className="space-y-2 text-xs font-bold text-slate-600 bg-[#F8FAFC] p-3 rounded-xl border border-slate-100">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400 font-medium">📅 Scheduled Date:</span> 
                        <span className="text-slate-800 font-extrabold">{new Date(booking.date).toLocaleDateString('en-GB')}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-slate-400 font-medium whitespace-nowrap">📍 Location:</span> 
                        <span className="text-slate-700 font-semibold">{booking.address}</span>
                      </div>
                    </div>
                  </div>

                  <div className="min-w-[240px] bg-[#F8FAFC] p-4.5 rounded-2xl border border-slate-200/60 w-full lg:w-auto">
                    <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                      Assigned Technician
                    </span>
                    {booking.providerName ? (
                      <div className="space-y-3">
                        <p className="text-sm font-extrabold text-slate-800 flex items-center gap-1.5">
                          🧑‍🔧 {booking.providerName}
                        </p>
                        <a href="https://wa.me/923001234567" target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-black px-4 py-2 w-full rounded-xl shadow-sm transition-all tracking-wide">
                          💬 Chat on WhatsApp
                        </a>
                      </div>
                    ) : (
                      <p className="text-xs font-black text-amber-600 flex items-center gap-1.5 py-1 animate-pulse">
                        ⏳ Waiting for Admin Allocation...
                      </p>
                    )}
                  </div>

                  <div className="w-full lg:w-auto flex flex-col sm:flex-row lg:flex-col gap-2 justify-end items-stretch sm:items-center lg:items-end">
                    {/* Rating logic start */}
                    {booking.rating ? (
                      <div className="w-full lg:w-44 px-4 py-2.5 rounded-xl border border-yellow-200 bg-yellow-50 text-yellow-600 font-black text-xs uppercase tracking-wider text-center">
                        ★ Rated {booking.rating}/5
                      </div>
                    ) : isCompleted ? (
                      <button 
                        onClick={() => setRatingModal({ isOpen: true, bookingId: booking._id })}
                        className="w-full lg:w-44 px-4 py-2.5 rounded-xl border border-yellow-500 text-yellow-600 hover:bg-yellow-50 font-black text-xs uppercase tracking-wider transition-all text-center"
                      >
                        Rate Service
                      </button>
                    ) : reschedulingId === booking._id ? (
                      <div className="flex flex-col gap-2 p-2 bg-slate-50 border border-slate-200 rounded-xl w-full sm:w-[240px]">
                        <input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold" />
                        <div className="flex gap-1.5">
                          <button onClick={() => handleRescheduleBooking(booking._id)} className="flex-1 bg-blue-600 text-white text-[10px] font-black uppercase py-1.5 rounded-lg">Save</button>
                          <button onClick={() => { setReschedulingId(null); setNewDate(''); }} className="flex-1 bg-slate-200 text-slate-600 text-[10px] font-black uppercase py-1.5 rounded-lg">Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <button onClick={() => setReschedulingId(booking._id)} className="w-full lg:w-44 px-4 py-2.5 rounded-xl border border-blue-200 text-blue-600 hover:bg-blue-50/50 font-black text-xs uppercase tracking-wider transition-all text-center">
                          Reschedule
                        </button>
                        <button onClick={() => handleCancelBooking(booking._id)} className="w-full lg:w-44 px-4 py-2.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50/50 font-black text-xs uppercase tracking-wider transition-all text-center">
                          Cancel Booking
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Rating Modal */}
      {ratingModal.isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000] p-4">
          <div className="bg-white p-8 rounded-2xl w-full max-w-sm shadow-xl space-y-4">
            <h2 className="text-xl font-black">Rate Service</h2>
            <p className="text-sm text-slate-500">How would you rate this service (1 to 5)?</p>
            <input 
              type="number" min="1" max="5" value={ratingValue}
              onChange={(e) => setRatingValue(Number(e.target.value))}
              className="w-full p-3 border rounded-xl text-lg font-bold"
            />
            <div className="flex gap-2">
              <button onClick={handleRatingSubmit} className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold">Submit</button>
              <button onClick={() => setRatingModal({ isOpen: false, bookingId: null })} className="flex-1 bg-slate-200 py-3 rounded-xl font-bold">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBookings;