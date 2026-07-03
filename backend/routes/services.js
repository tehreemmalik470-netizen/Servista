const express = require('express');
const router = express.Router();
const Service = require('../models/Service');

// 1. Saari services ko database se get karne ka route (For Home Page)
router.get('/', async (req, res) => {
  try {
    const services = await Service.find({});
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ message: "Services fetch karne mein error aya", error: error.message });
  }
});

// 2. Nayi service add karne ka route (Testing ke liye)
router.post('/add', async (req, res) => {
  try {
    const { title, icon, desc, img } = req.body;
    const newService = new Service({ title, icon, desc, img });
    await newService.save();
    res.status(201).json({ message: "Service successfully add ho gayi!", newService });
  } catch (error) {
    res.status(500).json({ message: "Service add nahi ho saki", error: error.message });
  }
});

module.exports = router;