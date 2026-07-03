const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// // Middleware
app.use(cors());
app.use(express.json()); // Yeh JSON data read karne ke liye zaroori hai

// // MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("🔥 MongoDB Connected Successfully for Servista..."))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// // Base Route (Server check karne ke liye)
app.get('/', (req, res) => {
    res.send("Servista Backend Server is running!");
});

// // Routes Middleware
// 1. Authentication Routes (Login & Register)
app.use('/api/auth', require('./routes/auth'));

// 2. Services Routes
app.use('/api/services', require('./routes/services'));

// 3. Bookings Routes (Naya Code Yahan Add Kiya Hai)
app.use('/api/bookings', require('./routes/bookings'));

// // Server Port Connection
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🔥 Server is running on http://localhost:${PORT}`);
});