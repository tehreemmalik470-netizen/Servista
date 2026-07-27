import React, { useState, useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
  const { cart, totalAmount, clearCart } = useContext(CartContext);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '', 
    phone: '', 
    email: '', 
    date: '', 
    time: '', 
    location: '', 
    paymentMethod: 'card', 
    cardNumber: '', 
    cardExpiry: '', 
    cardCvv: '', 
    walletNumber: ''
  });
  const navigate = useNavigate();

  const handleConfirm = async () => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      alert("Please login first to book a service!");
      navigate('/login');
      return;
    }

    // Parse user object or id safely from localStorage
    let userId = '';
    try {
      const parsedUser = JSON.parse(userData);
      userId = parsedUser._id || parsedUser.id || userData;
    } catch {
      userId = userData;
    }

    // Validation: Check if any booking detail/location is empty
    if (!formData.name || !formData.phone || !formData.email || !formData.date || !formData.time || !formData.location) {
      alert("Please fill all the booking details and location!");
      return;
    }

    // Payment Method Validation
    if (formData.paymentMethod === 'card' && (!formData.cardNumber || !formData.cardExpiry || !formData.cardCvv)) {
      alert("Please enter complete card details!");
      return;
    }

    if (formData.paymentMethod === 'easypaisa' && !formData.walletNumber) {
      alert("Please enter your mobile account number!");
      return;
    }

    try {
      // Format cart items for backend
      const formattedServices = cart.map(item => ({
        title: item.title || item.name,
        price: item.price,
        quantity: item.quantity
      }));

      const bookingPayload = {
        userId,
        serviceTitle: cart.length > 0 ? (cart[0].title || cart[0].name) : 'Multiple Services', // Backend ki requirement pori karne ke liye
        customerName: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.location,
        date: formData.date,
        time: formData.time,
        services: formattedServices,
        totalAmount,
        paymentMethod: formData.paymentMethod,
        paymentDetails: {
          cardNumber: formData.paymentMethod === 'card' ? formData.cardNumber : '',
          cardExpiry: formData.paymentMethod === 'card' ? formData.cardExpiry : '',
          walletNumber: formData.paymentMethod === 'easypaisa' ? formData.walletNumber : ''
        }
      };

      const response = await fetch('http://localhost:5000/api/bookings/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(bookingPayload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to make booking");
      }

      alert("Payment Successful & Booking Confirmed!");
      clearCart();
      navigate('/services');
    } catch (error) {
      console.error("Checkout Error:", error);
      alert(error.message || "Something went wrong during booking.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-10 px-4 md:px-20">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Cart & Booking Form */}
        <div className="lg:col-span-2 space-y-6">
          <h1 className="text-2xl font-bold">Checkout</h1>
          
          <div className="bg-white p-4 rounded border">
            <label className="flex items-center gap-2 font-bold cursor-pointer">
              <input type="checkbox" onChange={(e) => e.target.checked ? setShowModal(true) : null} /> Clear Cart
            </label>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="font-bold mb-4">Selected Services</h2>
            {cart.map((item, index) => (
              <div key={index} className="flex justify-between border-b py-3 items-center">
                <div className="flex items-center gap-4">
                  <img src={item.image || item.img || ''} className="w-16 h-16 object-cover rounded bg-gray-200" alt="service" />
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
              <div>
 
  <div className="flex gap-1 w-full">
    {/* Hour Select */}
    <select 
      value={formData.hour || ''} 
      onChange={(e) => {
        const hour = e.target.value;
        const minute = formData.minute || '00';
        const period = formData.period || 'AM';
        setFormData({
          ...formData, 
          hour, 
          time: `${hour}:${minute} ${period}`
        });
      }} 
      className="w-1/3 p-3 border rounded bg-white text-sm"
    >
      <option value="">HH</option>
      {['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'].map((h) => (
        <option key={h} value={h}>{h}</option>
      ))}
    </select>

    {/* Minute Select */}
    <select 
      value={formData.minute || ''} 
      onChange={(e) => {
        const minute = e.target.value;
        const hour = formData.hour || '09';
        const period = formData.period || 'AM';
        setFormData({
          ...formData, 
          minute, 
          time: `${hour}:${minute} ${period}`
        });
      }} 
      className="w-1/3 p-3 border rounded bg-white text-sm"
    >
      <option value="">MM</option>
      <option value="00">00</option>
      <option value="15">15</option>
      <option value="30">30</option>
      <option value="45">45</option>
    </select>

    {/* AM / PM Select */}
    <select 
      value={formData.period || 'AM'} 
      onChange={(e) => {
        const period = e.target.value;
        const hour = formData.hour || '09';
        const minute = formData.minute || '00';
        setFormData({
          ...formData, 
          period, 
          time: `${hour}:${minute} ${period}`
        });
      }} 
      className="w-1/3 p-3 border rounded bg-white text-sm font-semibold"
    >
      <option value="AM">AM</option>
      <option value="PM">PM</option>
    </select>
  </div>
</div>
            </div>
          </div>
        </div>

        {/* Right Side: Location & Payment Method */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border space-y-4">
            <h2 className="font-bold">Service Location</h2>
            <textarea placeholder="Enter address here..." value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} className="w-full p-3 border rounded"></textarea>
            
            <h2 className="font-bold text-lg pt-2">Payment Method</h2>
            
            <div className="space-y-3">
              <label className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer ${formData.paymentMethod === 'card' ? 'border-blue-600 bg-blue-50/50' : 'border-gray-200'}`}>
                <div className="flex items-center gap-3">
                  <input 
                    type="radio" 
                    name="paymentMethod" 
                    value="card" 
                    checked={formData.paymentMethod === 'card'}
                    onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})}
                  />
                  <span className="font-medium">Debit / Credit Card</span>
                </div>
                <div className="flex gap-1 text-xs font-bold text-blue-900">
                  <span>VISA</span> <span>MC</span>
                </div>
              </label>

              <label className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer ${formData.paymentMethod === 'easypaisa' ? 'border-blue-600 bg-blue-50/50' : 'border-gray-200'}`}>
                <div className="flex items-center gap-3">
                  <input 
                    type="radio" 
                    name="paymentMethod" 
                    value="easypaisa" 
                    checked={formData.paymentMethod === 'easypaisa'}
                    onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})}
                  />
                  <span className="font-medium">EasyPaisa / JazzCash</span>
                </div>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Wallet</span>
              </label>
            </div>

            {/* Conditional Fields based on Payment Method */}
            {formData.paymentMethod === 'card' && (
              <div className="space-y-3 pt-2 border-t">
                <input 
                  type="text" 
                  placeholder="Card Number (XXXX XXXX XXXX XXXX)" 
                  value={formData.cardNumber}
                  onChange={(e) => setFormData({...formData, cardNumber: e.target.value})}
                  className="w-full p-3 border rounded text-sm"
                />
                <div className="flex gap-3">
                  <input 
                    type="text" 
                    placeholder="MM / YY" 
                    value={formData.cardExpiry}
                    onChange={(e) => setFormData({...formData, cardExpiry: e.target.value})}
                    className="w-full p-3 border rounded text-sm"
                  />
                  <input 
                    type="password" 
                    placeholder="CVV" 
                    value={formData.cardCvv}
                    onChange={(e) => setFormData({...formData, cardCvv: e.target.value})}
                    className="w-full p-3 border rounded text-sm"
                  />
                </div>
              </div>
            )}

            {formData.paymentMethod === 'easypaisa' && (
              <div className="p-3 bg-gray-50 border rounded text-sm space-y-2">
                <p className="text-gray-600 font-medium">Enter your mobile account number for verification.</p>
                <input 
                  type="tel" 
                  placeholder="Mobile Number (03XXXXXXXXX)" 
                  value={formData.walletNumber}
                  onChange={(e) => setFormData({...formData, walletNumber: e.target.value})}
                  className="w-full p-3 border rounded bg-white text-sm"
                />
              </div>
            )}
            
            <div className="border-t pt-4 font-bold text-lg flex justify-between">
              <span>Total</span>
              <span>Rs. {totalAmount}</span>
            </div>

            <button onClick={handleConfirm} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition">
              Confirm & Book (Rs. {totalAmount})
            </button>
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