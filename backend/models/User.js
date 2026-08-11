const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['Client', 'Provider', 'Admin'],
    default: 'Client'
  },
  // ─── LOCATION FIELD FOR SIALKOT AREAS ───
  location: {
    type: String,
    // Agar Client ho toh location required nahi hoti, isliye custom function lagaya hai
    required: function() { return this.role === 'Provider'; },
    default: ''
  },
  isAvailable: {
    type: Boolean,
    default: true // Yeh naye users ke liye hamesha true set karega
  },
  // Provider specific fields
  // ─── FIXED: Changed from 'skills: [String]' to 'skill: String' to match frontend ───
  skill: {
    type: String,
    default: ''
  },
  experience: {
    type: String,
    default: ''
  },
  rate: {
    type: Number,
    default: 0
  },
  // ─── PAYOUT & BANKING DETAILS FOR PROVIDERS ───
  walletType: {
    type: String,
    default: 'Direct Bank Transfer / Card'
  },
  bankName: {
    type: String,
    default: ''
  },
  accountTitle: {
    type: String,
    default: ''
  },
  accountNumber: {
    type: String,
    default: ''
  },
  // ─── NEW ADDED FIELD FOR EASYPAISA / JAZZCASH ───
  mobileNumber: {
    type: String,
    default: ''
  }
}, { timestamps:true }); // Agar timestamps: true hai toh wahi rehne dein

module.exports = mongoose.model('User', userSchema);