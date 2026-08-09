import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar'; 
import Footer from './components/Footer';
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
import SubServices from './pages/SubServices';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';

function App() {
  return (
    <Router>
      <div>
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
        <Route path="/services/:serviceCategory" element={<SubServices />} />
       
        {/* PROTECTED ROUTES LAYER */}
        <Route element={<ProtectedRoute />}>
          {/* General Protected Routes (Sirf Token chahiye) */}
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="/provider-profiles" element={<ProviderProfiles />} />
          <Route path="/experts" element={<ProviderProfiles />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
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
      <Footer /> {/* 2. Yahan Footer dal dein */}
    </div>
    </Router>
  );
}
export default App;