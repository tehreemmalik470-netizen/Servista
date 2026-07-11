const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
  customerName: { type: String, required: true },
  serviceTitle: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  date: { type: Date, required: true },
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