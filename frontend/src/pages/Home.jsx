import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
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
    <div className="min-h-screen bg-white text-slate-900 font-sans antialiased">
      
      {/* ─── HERO SECTION ─── */}
      <main className="max-w-7xl mx-auto px-6 py-12 lg:py-20 grid lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-6 space-y-8 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Trusted by 5,000+ Homeowners in Sialkot</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#0f172a] tracking-tight leading-[1.1]">
            Your One-Stop <br /> Solution for <span className="text-blue-600">Home <br /> Services</span>
          </h1>
          <p className="text-slate-500 text-sm sm:text-base max-w-md leading-relaxed font-medium">
            Connect with vetted, top-rated professionals for plumbing, electrical, cleaning, and more. Book in seconds, relax in minutes.
          </p>
          <div className="flex flex-row items-center gap-4 pt-4">
            <a href="#services" className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-4 rounded-xl transition-all shadow-xl shadow-blue-600/25 text-center text-sm flex items-center gap-2">
              Book a Service <span className="text-lg">→</span>
            </a>
          </div>
        </div>          
        <div className="lg:col-span-6 relative">
          <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl aspect-[4/5] lg:aspect-square group bg-slate-100">
            <img src="hero.jpg" alt="Servista Professional" className="w-full h-full object-cover" /> 
          </div>
        </div>
      </main>

      {/* ─── SERVICES SECTION (DYNAMIC) ─── */}
      <section id="services" className="max-w-7xl mx-auto px-6 py-24 bg-white">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-sm md:text-base font-black text-blue-600 uppercase tracking-[0.3em]">Our Expertise</h2>
          <h3 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Expert Services at <span className="text-blue-600">Your Doorstep</span></h3>
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

      {/* ─── HOW IT WORKS SECTION ─── */}
      <section className="bg-slate-100 py-24 px-6 border-t border-b border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <span className="text-sm font-black text-blue-600 uppercase tracking-[0.3em] block">
              Our Working Process
            </span>
            <h3 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
              How Servista <span className="text-blue-600">Works</span>
            </h3>
            <p className="text-slate-600 text-sm md:text-base max-w-xl mx-auto font-medium">
              Book any expert home service in three incredibly simple steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative">
            <div className="bg-white p-10 rounded-[2rem] border border-slate-200/60 shadow-md hover:shadow-2xl transition-all duration-300 text-left space-y-5 relative group">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-black text-xl group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-sm">
                01
              </div>
              <h4 className="text-xl font-black text-slate-900 tracking-tight">Select a Service</h4>
              <p className="text-slate-500 text-sm font-medium leading-relaxed">
                Choose from our wide range of trusted home services like Plumbing, Cleaning, or Carpentry directly.
              </p>
            </div>

            <div className="bg-white p-10 rounded-[2rem] border border-slate-200/60 shadow-md hover:shadow-2xl transition-all duration-300 text-left space-y-5 relative group">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black text-xl group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300 shadow-sm">
                02
              </div>
              <h4 className="text-xl font-black text-slate-900 tracking-tight">Fill Booking Details</h4>
              <p className="text-slate-500 text-sm font-medium leading-relaxed">
                Enter your convenient date, contact number, and your Sialkot address securely.
              </p>
            </div>

            <div className="bg-white p-10 rounded-[2rem] border border-slate-200/60 shadow-md hover:shadow-2xl transition-all duration-300 text-left space-y-5 relative group">
              <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-black text-xl group-hover:bg-purple-600 group-hover:text-white transition-all duration-300 shadow-sm">
                03
              </div>
              <h4 className="text-xl font-black text-slate-900 tracking-tight">Relax & Get it Done</h4>
              <p className="text-slate-500 text-sm font-medium leading-relaxed">
                Our vetted professional arrives right on schedule at your doorstep to fix it perfectly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CLEAN PREMIUM FOOTER ─── */}
      <footer className="bg-slate-950 text-white pt-16 pb-8 px-6 border-t border-slate-900">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-slate-900">
          
          <div className="md:col-span-5 space-y-4 text-left">
            <span className="text-xl font-black tracking-tight text-white block">SERVISTA</span>
            <p className="text-slate-400 text-xs font-medium leading-relaxed max-w-sm">
              Sialkot's premium on-demand digital platform connecting verified technicians seamlessly.
            </p>
          </div>

          <div className="md:col-span-4 space-y-4 text-left">
            <h4 className="text-xs font-black text-blue-500 uppercase tracking-widest">Navigation</h4>
            <div className="grid grid-cols-2 gap-3 text-xs font-semibold text-slate-400">
              <span className="cursor-pointer hover:text-white transition-colors" onClick={() => navigate('/')}>• Home</span>
              <a href="#services" className="hover:text-white transition-colors">• Services</a>
              <span className="cursor-pointer hover:text-white transition-colors" onClick={() => navigate('/experts')}>• Find Experts</span>
              <span className="cursor-pointer hover:text-white transition-colors" onClick={() => navigate('/about')}>• About</span>
              <span className="cursor-pointer hover:text-white transition-colors" onClick={() => navigate('/contactUs')}>• Contact Us</span>
              <span className="cursor-pointer hover:text-white transition-colors" onClick={() => navigate('/my-bookings')}>• My Bookings</span>
            </div>
          </div>

          <div className="md:col-span-3 space-y-4 text-left">
            <h4 className="text-xs font-black text-blue-500 uppercase tracking-widest">Support</h4>
            
            <div className="space-y-4 pt-1">
              <div className="flex items-start gap-3 text-slate-400">
                <span className="text-blue-500 text-base font-bold mt-0.5">📍</span>
                <div className="text-xs font-medium">
                  <span className="block text-slate-500 font-bold uppercase text-[10px] tracking-wider">Office Location</span>
                  Shahabpura Road, Sialkot
                </div>
              </div>

              <div className="flex items-start gap-3 text-slate-300">
                <span className="text-emerald-500 text-base font-bold mt-0.5">✉️</span>
                <div className="text-xs font-semibold">
                  <span className="block text-slate-500 font-bold uppercase text-[10px] tracking-wider">Email Address</span>
                  <a href="mailto:support@servista.com" className="text-slate-200 hover:text-emerald-400 transition-colors">
                    support@servista.com
                  </a>
                </div>
              </div>
            </div>

          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px] font-bold uppercase tracking-wider text-left">
          <p>© 2026 SERVISTA Co. All rights reserved.</p>
        </div>
      </footer>

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

    </div>
  );
};

export default Home;