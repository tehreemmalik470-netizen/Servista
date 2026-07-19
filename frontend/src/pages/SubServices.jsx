import React, { useContext, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { servicesData } from '../data/servicesData';
import { CartContext } from '../context/CartContext';

const SubServices = () => {
  const { serviceCategory } = useParams();
  const { addToCart } = useContext(CartContext);
  
  // Toast Notification ke liye state
  const [showToast, setShowToast] = useState(false);
  
  // Data fetch karein (Cleaning, Electrician, etc.)
  const data = servicesData[serviceCategory]; 

  // Add to Cart handler function
  const handleAddToCart = (item) => {
    addToCart(item); // Purana cart context ka function
    setShowToast(true); // Popup show karein
    
    // 3 second baad popup khud gayab ho jayega
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  // SubServices.jsx mein return se pehle
  if (!data) {
    return (
      <div className="p-10 text-center">
        <h1 className="text-2xl font-bold">Service not found!</h1>
        <p>Aapne URL mein jo service category di hai: <strong>{serviceCategory}</strong>, wo data mein nahi mil rahi.</p>
      </div>
    );
  }

  return (
    <div className="p-10 relative">
      <h1 className="text-4xl font-black mb-8">{data.title}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {data.items.map((item) => (
          <div key={item.id} className="border p-6 rounded-2xl flex gap-6 items-center shadow-sm hover:shadow-md transition-shadow duration-300">
            
            {/* IMAGE KA UPDATED CODE (BADI IMAGE) */}
            <div className="w-32 h-32 flex-shrink-0"> 
              <img 
                src={item.img} 
                alt={item.name} 
                className="w-full h-full object-cover rounded-xl border border-slate-100"
                onError={(e) => { 
                  e.target.src = 'https://via.placeholder.com/200';
                }} 
              />
            </div>

            <div className="flex-grow">
              <h2 className="text-2xl font-bold text-slate-900">{item.name}</h2>
              
              {/* Description yahan aayegi */}
              {item.description && (
                <p className="text-sm text-gray-500 mb-2">{item.description}</p>
              )}
              
              <p className="text-blue-600 font-bold text-lg mt-1">Rs. {item.price}</p>
            </div>

            {/* Add to Cart button - handleAddToCart use kiya */}
            <button 
              onClick={() => handleAddToCart(item)}
              className="bg-slate-900 text-white px-8 py-4 rounded-xl hover:bg-blue-600 transition-colors duration-300 font-semibold"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>

      {/* Reference image jaisa Toast Popup Notification */}
      {showToast && (
        <div className="fixed top-24 right-8 bg-[#2a5c9a] text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-6 z-50 transition-all duration-300">
          <span className="text-sm font-medium">Product added successfully!</span>
          <Link 
            to="/cart" 
            className="bg-[#e65a3f] hover:bg-[#d4482d] text-white px-4 py-2 rounded-md text-sm font-bold transition-colors"
          >
            View Cart
          </Link>
        </div>
      )}
    </div>
  );
};

export default SubServices;