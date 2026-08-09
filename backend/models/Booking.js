const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
  customerName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  
  // Services / Cart Items list
  services: [{
    title: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true }
  }],
  totalAmount: { type: Number, required: true },

  // Booking Schedule
  date: { type: String, required: true },
  time: { type: String, required: true },

  // Payment Details (Updated for client sender info & transaction tracking)
  paymentMethod: { type: String, enum: ['card', 'easypaisa'], required: true },
  paymentDetails: {
    methodType: { type: String },
    senderAccountNo: { type: String },
    senderName: { type: String },
    transactionId: { type: String }
  },

  providerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  providerName: { type: String },
  status: { 
    type: String, 
    enum: ['Pending', 'Negotiating', 'Approved', 'Completed', 'Cancelled'], 
    default: 'Pending' 
  },
  
  // ─── NEGOTIATION FIELDS ───
  clientProposedPrice: { type: Number }, 
  providerCounterPrice: { type: Number }, 
  finalPrice: { type: Number },          

  // ─── RATING & REVIEW FIELDS ───
  rating: { type: Number, default: null }, 
  reviewText: { type: String, default: "" }            
  
}, { timestamps: true });

module.exports = mongoose.model('Booking', BookingSchema);