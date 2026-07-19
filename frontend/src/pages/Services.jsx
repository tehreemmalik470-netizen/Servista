import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
// 1. Function add karein
const getServiceKey = (title) => {
  const mapping = {
    "Cleaning Services": "cleaningservices",
    "Electrician Services": "electrician",
    "Carpentor Services": "carpenterservices",
    "Paint Decor Services": "painting&decor",
    "Plumbing Services": "plumbing",
    "Solar installation Services": "solarinstallation",
    "AC Repairing Services": "acrepairing",
    "Pestcontrol Services": "pestcontrol",
    "shifting": "homeshifting"
  };
  return mapping[title] || title.toLowerCase().replace(/\s+/g, '');
};

  // Database se services fetch karna
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/services');
        const data = await response.json();
        setServices(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching services:", error);
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 pt-24">
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-16">
          <h3 className="text-3xl md:text-4xl font-black text-slate-900">Our Services</h3>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                         {services.map((service, index) => (
                  // Yahan hum manual mapping kar rahe hain taaki key match ho
                  <Link 
                    key={index} 
                      to={`/services/${service.title.toLowerCase().replace(/\s+/g, '')}`}
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
    </div>
  );
};

export default Services;