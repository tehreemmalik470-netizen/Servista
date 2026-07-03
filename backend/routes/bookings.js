const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');

// 1. POST: Save a new booking tied to a specific user
router.post('/add', async (req, res) => {
  try {
    const { userId, serviceTitle, customerName, email, phone, address, date } = req.body;
    
    if (!userId) {
      return res.status(400).json({ message: "Authentication error: Missing User ID." });
    }

    const newBooking = new Booking({
      userId, 
      serviceTitle, 
      customerName, 
      email, 
      phone, 
      address, 
      date
    });

    await newBooking.save();
    res.status(201).json({ message: "Booking confirmed successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error making booking", error: error.message });
  }
});

// 2. GET: View all bookings (For Admin Dashboard)
router.get('/all', async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching all bookings", error: error.message });
  }
});
// 3. PUT: Update booking status and assign provider (For Admin)
router.put('/update-status/:id', async (req, res) => {
  try {
    const { status, providerId, providerName } = req.body;
    
    const updateData = { status };
    if (providerId) updateData.providerId = providerId;
    if (providerName) updateData.providerName = providerName;

    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.id,
      updateData,
      { returnDocument:'after'} 
    );

    if (!updatedBooking) {
      return res.status(404).json({ message: "Booking not found!" });
    }

    res.status(200).json({ message: "Booking updated successfully!", updatedBooking });
  } catch (error) {
    res.status(500).json({ message: "Update failed", error: error.message });
  }
});
// 4. GET: Fetch bookings for a specific customer only (Client History Portal)
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const userBookings = await Booking.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json(userBookings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching your personal bookings", error: error.message });
  }
});

// 🔥 5. GET: Fetch bookings assigned to a specific service provider
router.get('/provider/:providerId', async (req, res) => {
  try {
    const { providerId } = req.params;
    // Finds tasks assigned specifically to the logged-in service provider
    const providerTasks = await Booking.find({ providerId }).sort({ createdAt: -1 });
    res.status(200).json(providerTasks);
  } catch (error) {
    res.status(500).json({ message: "Error fetching assigned provider tasks", error: error.message });
  }
});
const User = require('../models/User'); // User model import zaroor check kar lein upar

// 1. CLIENT: SUBMIT NEGOTIATION OFFER
router.put('/negotiate-offer/:id', async (req, res) => {
    try {
        const { proposedPrice } = req.body;
        const updatedBooking = await Booking.findByIdAndUpdate(
            req.params.id,
            { 
                clientProposedPrice: proposedPrice,
                status: 'Negotiating' 
            },
            { new: true }
        );
        res.status(200).json({ message: "Offer submitted successfully!", updatedBooking });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 2. PROVIDER: ACCEPT OR COUNTER THE OFFER
router.put('/respond-offer/:id', async (req, res) => {
    try {
        const { action, counterPrice } = req.body; // action: 'Accept' ya 'Counter'
        
        let updateData = {};
        if (action === 'Accept') {
            const booking = await Booking.findById(req.params.id);
            updateData = {
                status: 'Approved',
                finalPrice: booking.clientProposedPrice // Client ki price lock ho gayi
            };
        } else if (action === 'Counter') {
            updateData = {
                providerCounterPrice: counterPrice,
                // Status 'Negotiating' hi rahega jab tak client accept na kare
            };
        }

        const updatedBooking = await Booking.findByIdAndUpdate(req.params.id, updateData, { new: true });
        res.status(200).json({ message: `Offer ${action}ed successfully!`, updatedBooking });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 3. CLIENT: SUBMIT RATING & REVIEW (Kaam khatam hone ke baad)
router.put('/rate-booking/:id', async (req, res) => {
    try {
        const { rating, reviewText } = req.body;
        
        // Booking ko update karein rating ke sath
        const booking = await Booking.findByIdAndUpdate(
            req.params.id,
            { rating, reviewText },
            { new: true }
        );

        if (!booking) return res.status(404).json({ message: "Booking not found" });

        // PROVIDER KI AVERAGE RATING CALCULATE KARNA
        const providerId = booking.providerId;
        if (providerId) {
            // Is provider ki saari rated bookings nikalna
            const allRatedBookings = await Booking.find({ providerId, rating: { $exists: true } });
            
            const totalReviews = allRatedBookings.length;
            const avgRating = allRatedBookings.reduce((sum, b) => sum + b.rating, 0) / totalReviews;

            // Provider ke document mein save karna
            await User.findByIdAndUpdate(providerId, {
                averageRating: parseFloat(avgRating.toFixed(1)), // e.g., 4.5
                totalReviews: totalReviews
            });
        }

        res.status(200).json({ message: "Thank you for your feedback!", booking });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
// 6. DELETE: Cancel/Delete a booking (For Client Portal)
router.delete('/cancel/:id', async (req, res) => {
  try {
    const deletedBooking = await Booking.findByIdAndDelete(req.params.id);
    if (!deletedBooking) {
      return res.status(404).json({ message: "Booking not found!" });
    }
    res.status(200).json({ message: "Booking cancelled successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Cancellation failed", error: error.message });
  }
});
module.exports = router;