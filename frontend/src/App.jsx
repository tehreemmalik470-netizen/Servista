import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgetPassword from './pages/ForgetPassword';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './pages/ProtectedRoute'; // path sahi check kar lijiyega
import ProviderDashboard from './pages/ProviderDashboard';
import MyBookings from './pages/MyBookings';
import ProviderProfiles from './pages/ProviderProfiles';
import About from './pages/About';
import ContactUs from './pages/ContactUs';
function App() {
  return (
    <Router>
      <Routes>
        {/* Main Landing Page Route */}
        <Route path="/" element={<Home />} />
        {/* Pehle simple element tha, ab ProtectedRoute ke andar wrap kar diya */}
<Route 
  path="/admin" 
  element={
    <ProtectedRoute>
      <AdminDashboard />
    </ProtectedRoute>
  } 
/>
<Route path="/provider-dashboard" element={<ProviderDashboard />} />
        <Route path="/forgot-password" element={<ForgetPassword />} />
        <Route path="/my-bookings" element={<MyBookings />} />

        {/* Authentication Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/experts" element={<ProviderProfiles />} />
<Route path="/about" element={<About />} />
<Route path="/contactUs" element={<ContactUs />} />
      </Routes>
    </Router>
  );
}
export default App;