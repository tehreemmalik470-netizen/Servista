import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar'; 
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgetPassword from './pages/ForgetPassword';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './pages/ProtectedRoute';
import ProviderDashboard from './pages/ProviderDashboard';
import MyBookings from './pages/MyBookings';
import ProviderProfiles from './pages/ProviderProfiles';
import About from './pages/About';
import ContactUs from './pages/ContactUs';
import Services from './pages/Services'; 

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="/about" element={<About />} />
        <Route path="/contactUs" element={<ContactUs />} />
        <Route path="/services" element={<Services />} /> 
        
        {/* PROTECTED ROUTES LAYER */}
        <Route element={<ProtectedRoute />}>
          {/* General Protected Routes (Sirf Token chahiye) */}
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="/provider-profiles" element={<ProviderProfiles />} />
          <Route path="/experts" element={<ProviderProfiles />} />
        </Route>

        {/* ADMIN SPECIFIC ROUTES */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
        </Route>

        {/* PROVIDER SPECIFIC ROUTES */}
        <Route element={<ProtectedRoute allowedRoles={['provider']} />}>
          <Route path="/provider-dashboard" element={<ProviderDashboard />} />
        </Route>

      </Routes>
    </Router>
  );
}

export default App;