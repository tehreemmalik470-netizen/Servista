import React, { useState, useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
  const { cart, totalAmount, clearCart } = useContext(CartContext);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '', phone: '', email: '', date: '', time: '', location: ''
  });
  const navigate = useNavigate();

  const handleConfirm = () => {
    const user = localStorage.getItem('user');
    if (!user) {
      alert("Please login first to book a service!");
      navigate('/login');
      return;
    }
    // Validation: Check if any field is empty
    if (!formData.name || !formData.phone || !formData.email || !formData.date || !formData.time || !formData.location) {
      alert("Please fill all the booking details and location!");
      return;
    }
    alert("Booking Confirmed!");
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-10 px-4 md:px-20">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2 space-y-6">
          <h1 className="text-2xl font-bold">Checkout</h1>
          
          <div className="bg-white p-4 rounded border">
            <label className="flex items-center gap-2 font-bold">
              <input type="checkbox" onChange={(e) => e.target.checked ? setShowModal(true) : null} /> Clear Cart
            </label>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="font-bold mb-4">Selected Services</h2>
            {cart.map((item, index) => (
              <div key={index} className="flex justify-between border-b py-3 items-center">
                <div className="flex items-center gap-4">
                  <img src={item.image || item.img || ''} className="w-16 h-16 object-cover rounded bg-gray-200" />
                  <div>
                    <p className="font-semibold">{item.title || item.name}</p>
                    <p className="text-sm">Qty: {item.quantity}</p>
                  </div>
                </div>
                <p className="font-bold">Rs. {item.price * item.quantity}</p>
              </div>
            ))}
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border space-y-4">
            <h2 className="font-bold">Booking Details</h2>
            <input type="text" placeholder="Full Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full p-3 border rounded" />
            <input type="tel" placeholder="Phone Number" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full p-3 border rounded" />
            <input type="email" placeholder="Email Address" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full p-3 border rounded" />
            <div className="flex gap-4">
              <input type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} className="w-full p-3 border rounded" />
              <input type="time" value={formData.time} onChange={(e) => setFormData({...formData, time: e.target.value})} className="w-full p-3 border rounded" />
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border space-y-4">
            <h2 className="font-bold">Service Location</h2>
            <textarea placeholder="Enter address here..." value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} className="w-full p-3 border rounded"></textarea>
            
            <h2 className="font-bold">Payment Method</h2>
            <select className="w-full p-3 border rounded">
              <option value="easypaisa">EasyPaisa</option>
              <option value="jazzcash">JazzCash</option>
            </select>
            
            <div className="border-t pt-4 font-bold text-lg flex justify-between">
              <span>Total</span>
              <span>Rs. {totalAmount}</span>
            </div>
            <button onClick={handleConfirm} className="w-full bg-blue-600 text-white py-3 rounded">Confirm & Book</button>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-white/10 backdrop-blur-md flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-2xl w-96 border border-gray-200">
            <h2 className="font-bold text-lg">Confirm Deletion</h2>
            <p className="my-4 text-gray-600">Are you sure you want to delete selected items from the cart?</p>
            <div className="flex justify-end gap-4">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 border rounded-lg hover:bg-gray-100">Cancel</button>
              <button onClick={() => { clearCart(); setShowModal(false); }} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default Checkout;