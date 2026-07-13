import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Link add karna zaroori hai
import Footer from '../components/Footer';

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Booking Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState('');
  const [formData, setFormData] = useState({
    customerName: '', email: '', phone: '', address: '', date: ''
  });
  const [bookingMessage, setBookingMessage] = useState('');

  // Mapping object (Logic jo humne finalize ki thi)
  const serviceMapping = {
    "cleaning": "cleaningservices",
    "plumbing": "plumbing",
    "electrician": "electrician",
    "carpenter": "carpentor",
    "shifting": "shifting",
    "acrepairing": "acrepairing",
    "solarinstallation": "solarinstallation",
    "pestcontrol": "pestcontrol",
    "paint": "paint-decor"
  };

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/services');
        const data = await response.json();
        setServices(data);
        setLoading(false);
      } catch (error) {
        console.error("Fetch error:", error);
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  // ... (handleOpenModal, handleInputChange, handleBookingSubmit functions yahan rakhein)

  return (
    <div className="min-h-screen bg-slate-50 pt-24 ...">
      <section className="max-w-7xl mx-auto px-6 py-12">
        {/* ... (Header section) */}
        
        {loading ? (
          <div className="flex justify-center py-20">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
             {services.map((service, index) => (
  // Yahan hum manual mapping kar rahe hain taaki key match ho
  <Link 
    key={index} 
    to={`/services/${service.key}`} 
    className="group bg-white rounded-[2rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 block"
  >
    <div className="relative h-48 overflow-hidden bg-slate-50">
      <img src={service.img} alt={service.title} className="w-full h-full object-cover" />
    </div>
    <div className="p-6 space-y-3">
      <h4 className="text-xl font-black text-slate-900 tracking-tight">{service.title}</h4>
      <p className="text-slate-500 text-sm font-medium">{service.desc}</p>
      <div className="pt-4 border-t border-slate-50">
        <span className="text-blue-600 font-bold underline text-[10px] uppercase tracking-widest">View Details</span>
      </div>
    </div>
  </Link>
))}
                    
              
  
          </div>
        )}
      </section>

      {/* Modal and Footer code... */}
      <Footer />
    </div>
  );
};

export default Services;