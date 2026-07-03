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
        enum: ['client', 'provider', 'admin'], 
        default: 'client' 
    },
    
    // ─── PROVIDER SPECIFIC FIELDS ───
    skill: { 
        type: String, 
        default: null 
    },
    isAvailable: { 
        type: Boolean, 
        default: true 
    },
    
    // ─── RATINGS & REVIEWS SYSTEM ───
    averageRating: { 
        type: Number, 
        default: 0 
    },
    totalReviews: { 
        type: Number, 
        default: 0 
    }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);