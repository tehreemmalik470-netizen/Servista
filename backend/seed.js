const mongoose = require('mongoose');
const Service = require('./models/Service');
require('dotenv').config();

const services = [
  { title: "Cleaning Services", icon: "🧹", desc: "Professional deep cleaning for every room.", img: "/cleaning.jpg" },
  { title: "AC Repairing", icon: "❄️", desc: "Expert gas charging and maintenance.", img: "/ac.jpg" },
  { title: "Plumbing", icon: "🚰", desc: "Fixing leaky taps and blockages.", img: "/plumbing.jpg" },
  { title: "Solar Installation", icon: "☀️", desc: "Professional solar panel setup.", img: "/solar.jpg" },
  { title: "Electrician", icon: "⚡", desc: "Home wiring and circuit fixes.", img: "/electrician.jpg" },
  { title: "Painting & Decor", icon: "🎨", desc: "Premium interior/exterior painting.", img: "/painting.jpg" },
  { title: "Carpenter Services", icon: "🪚", desc: "Door repairs and wood maintenance.", img: "/carpenter.jpg" },
  { title: "Home Shifting", icon: "📦", desc: "Safe house moving helpers.", img: "/shifting.jpg" },
  { title: "Pest Control", icon: "🐜", desc: "Complete insect elimination.", img: "/pest.jpg" }
];

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    await Service.deleteMany(); 
    await Service.insertMany(services);
    console.log("✅ Saari 9 Services Database mein save ho gayi hain!");
    process.exit();
  })
  .catch(err => {
    console.log("Validation Error Details:", err.message);
    process.exit();
  });