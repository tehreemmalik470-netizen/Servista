import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
const Cart = () => {
  const { cart, removeFromCart, updateQuantity } = useContext(CartContext);
  const totalPrice = cart?.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0) || 0;
  const [itemToRemove, setItemToRemove] = useState(null);
const navigate = useNavigate();
  return (
    <div className="max-w-7xl mx-auto px-6 py-10 min-h-screen">
      
      {/* Top Heading with Back Icon */}
      <div className="mb-8 flex items-center gap-2">
        <Link to="/services" className="text-xl font-bold text-slate-800 hover:text-blue-600">
          
        </Link>
        <h1 className="text-2xl font-bold text-slate-800">My Cart</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Left Side: Cart Items List */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {cart?.length === 0 ? (
            <div className="p-10 border rounded-xl bg-slate-50 text-center text-slate-500">
              Your cart is empty. <Link to="/services" className="text-blue-600 underline">Add some services!</Link>
            </div>
          ) : (
            cart?.map((item, index) => (
              <div key={index} className="border border-slate-200 rounded-xl p-4 flex gap-6 items-start relative bg-slate-50">
                
                {/* Item Image */}
                <img 
                  src={item.img} 
                  alt={item.name} 
                  className="w-24 h-24 object-cover rounded-lg"
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/150' }}
                />

                {/* Item Details */}
                <div className="flex flex-col flex-grow">
                  <h3 className="font-bold text-slate-800 text-lg">{item.name}</h3>
                  <p className="text-orange-500 font-semibold mb-3">Rs {item.price}</p>
                  
                  {/* Quantity Controls */}
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => updateQuantity(item.id, -1)}
                      className="bg-blue-800 text-white w-6 h-6 rounded flex items-center justify-center font-bold"
                    >
                      -
                    </button>
                    <span className="font-semibold text-sm">{item.quantity || 1}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, 1)}
                      className="bg-blue-800 text-white w-6 h-6 rounded flex items-center justify-center font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Remove (X) Button */}
                <button 
                  onClick={() => setItemToRemove(item.id)} 
                  className="absolute top-4 right-4 bg-blue-900 text-white w-6 h-6 rounded flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                >
                  ✖
                </button>
              </div>
            ))
          )}
        </div>

        {/* Right Side: Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-slate-100 p-6 rounded-xl border border-slate-200 sticky top-10">
            <h2 className="text-xl font-bold text-center mb-6">Order Summary</h2>
            <div className="flex justify-between items-center mb-8 border-b border-slate-300 pb-4">
              <span className="font-semibold text-slate-700">Total</span>
              <span className="font-bold text-slate-900">Rs. {totalPrice}</span>
            </div>
            <button 
  onClick={() => navigate('/checkout')} 
  className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold">
  Proceed To Checkout
</button>
          </div>
        </div>
      </div>
{/* Remove Confirmation Modal - Background fixed to show content behind */}
{itemToRemove && (
  <div className="fixed inset-0 bg-transparent backdrop-blur-sm flex items-center justify-center z-50">
    <div className="bg-white p-8 rounded-xl shadow-2xl text-center w-80">
      <h2 className="text-xl font-bold mb-4">Are you sure?</h2>
      <p className="mb-6 text-gray-600">Do you want to remove this item from your cart?</p>
      <div className="flex gap-4 justify-center">
        <button 
          onClick={() => { removeFromCart(itemToRemove); setItemToRemove(null); }}
          className="bg-[#e65a3f] text-white px-6 py-2 rounded-lg font-bold hover:bg-[#d4482d]"
        >
          Yes, Remove It!
        </button>
        <button 
          onClick={() => setItemToRemove(null)}
          className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg font-bold hover:bg-gray-300"
        >
          Cancel
        </button>
        
      </div>
      
    </div>
  </div>
)}
     
             
    </div>
  );
};

export default Cart;