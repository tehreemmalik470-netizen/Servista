import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';
import { servicesData } from '../data/servicesData';
import { CartContext } from '../context/CartContext';

const SubServices = () => {
  const { serviceCategory } = useParams();
  const { addToCart } = useContext(CartContext);
  
  // Data fetch karein (Cleaning, Electrician, etc.)
  const data = servicesData[serviceCategory]; 
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
    <div className="p-10">
      <h1 className="text-4xl font-black mb-8">{data.title}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {data.items.map((item) => (
  <div key={item.id} className="border p-6 rounded-2xl flex gap-6 items-center shadow-sm hover:shadow-md transition-shadow duration-300">
    
    {/* IMAGE KA UPDATED CODE (BADI IMAGE) */}
    <div className="w-32 h-32 flex-shrink-0"> 
      <img 
        src={item.img} 
        alt={item.name} 
        className="w-full h-full object-cover rounded-xl border border-slate-100" // object-cover se image stretched nahi lagegi
        onError={(e) => { 
          e.target.src = 'https://via.placeholder.com/200'; // Placeholder size bhi 200x200 kar dein
        }} 
      />
    </div>

    {/* Text wala hissa */}
    <div className="flex-grow">
      <h2 className="text-2xl font-bold text-slate-900">{item.name}</h2> {/* Text ka size bhi thoda bara kar dia */}
      <p className="text-blue-600 font-bold text-lg mt-1">Rs. {item.price}</p>
    </div>

    {/* Add to Cart button */}
    <button 
      onClick={() => addToCart(item)}
      className="bg-slate-900 text-white px-8 py-4 rounded-xl hover:bg-blue-600 transition-colors duration-300 font-semibold"
    >
      Add to Cart
    </button>
  </div>
))}
      </div>
    </div>
  );
};

export default SubServices;