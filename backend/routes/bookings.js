const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const User = require('../models/User'); 

// 1. POST: Save a new booking tied to a specific user with cart items & payment info
router.post('/add', async (req, res) => {
  try {
    const { 
      userId, 
      customerName, 
      email, 
      phone, 
      address, 
      date, 
      time, 
      services, 
      totalAmount, 
      paymentMethod, 
      paymentDetails 
    } = req.body;
    
    if (!userId) {
      return res.status(400).json({ message: "Authentication error: Missing User ID." });
    }

    const newBooking = new Booking({
      userId, 
      customerName, 
      email, 
      phone, 
      address, 
      date,
      time,
      services,
      totalAmount,
      paymentMethod,
      paymentDetails,
      rating: null 
    });

    await newBooking.save();
    res.status(201).json({ message: "Booking confirmed successfully!", newBooking });
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

// 8. CLIENT: SUBMIT RATING & REVIEW
router.put('/rate/:id', async (req, res) => {
  try {
    const { rating, review } = req.body;
    
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

// CLIENT: RESCHEDULE A BOOKING WITH AUTO-STATUS
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
      { new: true }
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
// Backend route example (routes/bookings.js)
router.delete('/cancel/:id', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Agar booking pehle hi completed hai, toh cancel nahi ho sakti
    if (booking.status && booking.status.toLowerCase() === 'completed') {
      return res.status(400).json({ message: "Completed bookings cannot be cancelled." });
    }

    // Agar approved/pending hai toh cancel kar ke refund flag set kar do
    booking.status = 'Cancelled';
    if (booking.paymentMethod && booking.paymentMethod.toLowerCase() !== 'cash') {
      booking.paymentStatus = 'Refund Initiated';
    }
    await booking.save();

    
    res.status(200).json({ message: "Booking cancelled successfully and refund processed if applicable." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// Provider cancel/reject booking route
router.put('/provider-cancel/:id', async (req, res) => {
  try {
    const { paymentMethod } = req.body;
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Booking ko wapas 'Pending' state mein kar dein aur assigned provider hata dein
    booking.status = 'Pending';
    booking.providerId = null; 

    // Agar online payment thi toh refund status update kar dein
    if (paymentMethod && paymentMethod.toLowerCase() !== 'cash') {
      booking.paymentStatus = 'Refund Initiated';
    }

    await booking.save();
    res.status(200).json({ message: "Booking returned to queue successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
module.exports = router;