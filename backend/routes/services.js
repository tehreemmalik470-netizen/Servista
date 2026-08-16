const express = require('express');
const router = express.Router();
const Service = require('../models/Service');

// 1. Saari services ko database se get karne ka route (For Home Page)
router.get('/', async (req, res) => {
  try {
    const services = await Service.find({});
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ message: "Problem can be occur during services fetching", error: error.message });
  }
});

// 2. Nayi service add karne ka route (Testing ke liye)
router.post('/add', async (req, res) => {
  try {
    const { title, icon, desc, img } = req.body;
    const newService = new Service({ title, icon, desc, img });
    await newService.save();
    res.status(201).json({ message: "Service successfully added!", newService });
  } catch (error) {
    res.status(500).json({ message: "Service not successfully added!S", error: error.message });
  }
});

module.exports = router;