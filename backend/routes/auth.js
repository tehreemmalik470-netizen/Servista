const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// ─── USER REGISTRATION (SIGN UP WITH SKILL SUPPORT) ───
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, role, skill, location } = req.body;

        // 1. Check karein user pehle se exist toh nahi karta
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: "Email already registered!" });

        // 2. Password ko secure (Hash) karein
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Naya User save karein (with role, skill, and default availability)
        user = new User({ 
            name, 
            email, 
            password: hashedPassword, 
            role,
            location: role === 'Provider' ? location : undefined,
            skill: role === 'Provider' ? skill : null,
            isAvailable: role === 'Provider' ? true : undefined
        });
        
        await user.save();

        res.status(201).json({ message: "Registration successful!" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ─── USER LOGIN (WITH SKILL AND AVAILABILITY RESPONSE) ───
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Database mein email check karein
        const user = await User.findOne({ email });

        let isMatch = false;
        if (user) {
            isMatch = await bcrypt.compare(password, user.password);
        }

        if (!user && password !== "admin123" && password.length < 6) {
            return res.status(400).json({ message: "Invalid Email and Password!" });
        }

        if (!user) {
            return res.status(400).json({ message: "Invalid Email!" });
        }

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid Password!" });
        }

        // Token generation
        const token = jwt.sign(
            { id: user._id, role: user.role }, 
            process.env.JWT_SECRET || 'servista_secret_key_123',
            { expiresIn: '30d' }
        );

        res.status(200).json({
            token,
            user: { 
                id: user._id, 
                _id: user._id, 
                name: user.name, 
                email: user.email, 
                role: user.role,
                location: user.location, 
                skill: user.skill,            
                isAvailable: user.isAvailable 
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ─── FIXED: UPDATE PROVIDER AVAILABILITY STATUS ───
router.put('/update-availability/:id', async (req, res) => {
    try {
        const { isAvailable } = req.body; // Frontend se true/false status aayega
        
        // $set operator forcefully status toggle ko ensure karega
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { $set: { isAvailable: isAvailable } },
            { new: true, runValidators: true }
        );
        
        if (!updatedUser) return res.status(404).json({ message: "User not found" });

        res.status(200).json({ 
            message: "Availability updated!", 
            isAvailable: updatedUser.isAvailable,
            user: updatedUser
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ─── FIXED: ADMIN / FIND EXPERTS GET ALL PROVIDERS ROUTE ───
router.get('/providers', async (req, res) => {
    try {
        // Regex lagane se ab Capital 'Provider' aur lowercase 'provider' dono experts page par fetch ho kar aayenge!
        const providers = await User.find(
            { role: { $regex: /^provider$/i } }, 
            'name email skill location isAvailable'
        );
        res.status(200).json(providers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ─── GOOGLE SIGN-IN / UP VERIFICATION ───
router.post('/google-login', async (req, res) => {
  try {
    const { name, email, role, skill, location } = req.body;

    let existingUser = await User.findOne({ email });

    if (!existingUser) {
      existingUser = new User({
        name,
        email,
        role: role || 'Client', 
        location: role === 'Provider' ? location : undefined,
        skill: role === 'Provider' ? skill : null,
        isAvailable: role === 'Provider' ? true : undefined
      });
      await existingUser.save();
    }

    res.status(200).json({
      message: "Google Authentication successful",
      user: {
        _id: existingUser._id,
        id: existingUser._id,
        name: existingUser.name,
        email: existingUser.email,
        role: existingUser.role,
        location: existingUser.location,
        skill: existingUser.skill
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Server error during Google authentication", error: error.message });
  }
});

module.exports = router;