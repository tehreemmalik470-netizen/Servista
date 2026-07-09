import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // ─── BOOKING MODAL STATES ───
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState('');
  const [formData, setFormData] = useState({
    customerName: '',
    email: '',
    phone: '',
    address: '',
    date: ''
  });
  const [bookingMessage, setBookingMessage] = useState('');

  // ─── FETCH SERVICES FROM DATABASE ───
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/services');
        const data = await response.json();
        setServices(data);
        setLoading(false);
      } catch (error) {
        console.error("Database se services data fetch karne mein error:", error);
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Open Modal Handler
  const handleOpenModal = (serviceTitle) => {
    const userJson = localStorage.getItem('user');
    if (!userJson) {
      alert("⚠️ Authentication Required: Please Log In or Sign Up first to book a service!");
      navigate('/login');
      return;
    }

    const user = JSON.parse(userJson);
    setFormData((prev) => ({
      ...prev,
      customerName: user.name || '',
      email: user.email || ''
    }));

    setSelectedService(serviceTitle);
    setIsModalOpen(true);
    setBookingMessage('');
  };

  // Input Change Handler
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ─── FORM SUBMIT HANDLER ───
  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setBookingMessage("🔄 Processing your request...");
    
    const userJson = localStorage.getItem('user');
    if (!userJson) {
      setBookingMessage("❌ Please log in first to book a service.");
      alert("Please log in first to book a service.");
      navigate('/login');
      return;
    }
    const user = JSON.parse(userJson);

    try {
      const response = await fetch('http://localhost:5000/api/bookings/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user._id || user.id,
          serviceTitle: selectedService,
          customerName: formData.customerName || user.name,
          email: formData.email || user.email,
          phone: formData.phone,      
          address: formData.address, 
          date: formData.date           
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        setBookingMessage("✅ Booking Confirmed Successfully!");
        setFormData({ customerName: '', email: '', phone: '', address: '', date: '' });
        
        setTimeout(() => {
          setIsModalOpen(false);
          setBookingMessage('');
        }, 2000);
      } else {
        setBookingMessage("❌ Error occur: " + data.message);
      }
    } catch (error) {
      console.error("Booking submit error:", error);
      setBookingMessage("❌ Backend connect nahi ho saka");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-24 flex flex-col justify-between text-slate-900 font-sans antialiased">
      
      <div>
        {/* ─── SERVICES MAIN CONTAINER ─── */}
        <section className="max-w-7xl mx-auto px-6 py-12">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-sm md:text-base font-black text-blue-600 uppercase tracking-[0.3em]">Our Expertise</h2>
            <h3 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
              Expert Services at <span className="text-blue-600">Your Doorstep</span>
            </h3>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <div key={service._id || index} className="group bg-white rounded-[2rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-blue-600/5 transition-all duration-500 hover:-translate-y-2">
                  <div className="relative h-48 overflow-hidden bg-slate-50">
                    <img src={service.img} alt={service.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  </div>
                  <div className="p-6 space-y-3">
                    <h4 className="text-xl font-black text-slate-900 tracking-tight">{service.title}</h4>
                    <p className="text-slate-500 text-sm font-medium">{service.desc}</p>
                    <div className="pt-4 flex items-center justify-between border-t border-slate-50">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Verified Pro</span>
                      <button 
                        onClick={() => handleOpenModal(service.title)}
                        className="px-4 py-2 rounded-xl bg-blue-50 text-blue-600 font-bold text-xs hover:bg-blue-600 hover:text-white transition-all"
                      >
                        Book Now →
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* ─── BOOKING MODAL POPUP ─── */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] max-w-md w-full p-8 shadow-2xl border border-slate-100 relative">
            <button 
              onClick={() => setIsModalOpen(false)} 
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 text-lg font-bold"
            >
              ✕
            </button>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-2">Book {selectedService}</h3>
            <p className="text-slate-500 text-xs font-semibold mb-6 uppercase tracking-wider">Enter your details to confirm booking</p>

            {bookingMessage && (
              <div className="mb-4 p-3 rounded-xl text-sm font-bold bg-blue-50 text-blue-700 text-center animate-pulse">
                {bookingMessage}
              </div>
            )}

            <form onSubmit={handleBookingSubmit} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Your Name</label>
                <input type="text" name="customerName" value={formData.customerName} onChange={handleInputChange} required className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl font-medium text-sm focus:outline-none focus:border-blue-500" placeholder="Enter Your Name" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Email Address</label>
                <input type="email" name="email" value={formData.email} onChange={handleInputChange} required className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl font-medium text-sm focus:outline-none focus:border-blue-500" placeholder="Enteryour@gmail.com" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Phone Number</label>
                <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} required className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl font-medium text-sm focus:outline-none focus:border-blue-500" placeholder="03001234567" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Service Address</label>
                <input type="text" name="address" value={formData.address} onChange={handleInputChange} required className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl font-medium text-sm focus:outline-none focus:border-blue-500" placeholder="Model Town, Sialkot" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Preferred Date</label>
                <input type="date" name="date" value={formData.date} onChange={handleInputChange} required className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl font-medium text-sm focus:outline-none focus:border-blue-500" />
              </div>
              <button type="submit" className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-600/20 transition-all text-sm uppercase tracking-widest">
                Confirm Booking Now
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Footer component standard integration */}
      <Footer />
    </div>
  );
};

export default Services;