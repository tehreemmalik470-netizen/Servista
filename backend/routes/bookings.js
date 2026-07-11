const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const User = require('../models/User'); 

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
      date,
      rating: null // 0 ki jagah null rakhein
    });
    await newBooking.save();
    res.status(201).json({ message: "Booking confirmed successfully!" });
  } catch (error) {
    console.error("Booking Error:", error); 
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
// NEW: Fetch bookings for a specific provider
router.get('/provider/:providerId', async (req, res) => {
  try {
    const { providerId } = req.params;
    
    // Yahan check karein ke providerId valid hai ya nahi
    const bookings = await Booking.find({ providerId: providerId }).sort({ createdAt: -1 });
    
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching provider bookings", error: error.message });
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
      { status: 'Approved', providerId, providerName }, 
  { new: true } 
    );

    if (!updatedBooking) {
      return res.status(404).json({ message: "Booking not found!" });
    }

    res.status(200).json({ message: "Booking updated successfully!", updatedBooking });
  } catch (error) {
    res.status(500).json({ message: "Update failed", error: error.message });
  }
});

router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const query = mongoose.Types.ObjectId.isValid(userId) 
      ? { userId: new mongoose.Types.ObjectId(userId) } 
      : { customerName: userId };

    const userBookings = await Booking.find(query).sort({ createdAt: -1 });
    res.status(200).json(userBookings);
  } catch (error) {
    res.status(500).json({ message: "Error", error: error.message });
  }
});

// 6. CLIENT: SUBMIT NEGOTIATION OFFER
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

// 7. PROVIDER: ACCEPT OR COUNTER THE OFFER
router.put('/respond-offer/:id', async (req, res) => {
  try {
    const { action, counterPrice } = req.body;
    
    let updateData = {};
    if (action === 'Accept') {
      const booking = await Booking.findById(req.params.id);
      updateData = {
        status: 'Approved',
        finalPrice: booking.clientProposedPrice
      };
    } else if (action === 'Counter') {
      updateData = {
        providerCounterPrice: counterPrice,
      };
    }

    const updatedBooking = await Booking.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.status(200).json({ message: `Offer ${action}ed successfully!`, updatedBooking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 8. CLIENT: SUBMIT RATING & REVIEW (Combined both versions)
router.put('/rate/:id', async (req, res) => {
  try {
    const { rating, review } = req.body;
    
    // Validation: Sirf tabhi update karein agar rating 1 aur 5 ke beech ho
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Please provide a valid rating between 1 and 5." });
    }

    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.id,
      { rating, review },
      { new: true }
    );

    if (!updatedBooking) {
      return res.status(404).json({ message: "Booking not found!" });
    }

    res.status(200).json({ message: "Rating submitted successfully!", updatedBooking });
  } catch (error) {
    res.status(500).json({ message: "Failed to submit rating", error: error.message });
  }
});

// ✨ SUPER PROFESSIONAL ─── CLIENT: RESCHEDULE A BOOKING WITH AUTO-STATUS
router.put('/reschedule/:id', async (req, res) => {
  try {
    const { date } = req.body;
    
    if (!date) {
      return res.status(400).json({ message: "New date is required." });
    }

    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.id,
      { 
        date: date,
        status: 'Rescheduled' 
      },
      { returnDocument: 'after' }
    );

    if (!updatedBooking) {
      return res.status(404).json({ message: "Booking not found!" });
    }

    return res.status(200).json({ message: "Booking rescheduled successfully!", updatedBooking });
  } catch (error) {
    return res.status(500).json({ message: "Reschedule failed", error: error.message });
  }
});

// 9. DELETE: Cancel/Delete a booking (For Client Portal)
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