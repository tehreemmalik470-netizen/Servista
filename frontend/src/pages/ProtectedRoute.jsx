import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');
  const userJson = localStorage.getItem('user');

  // 1. Session check
  if (!token || !userJson) {
    console.log("Session not found. Redirecting to login...");
    return <Navigate to="/login" replace />;
  }

  try {
    const user = JSON.parse(userJson);
    const userRole = user.role ? user.role.toLowerCase().trim() : '';
    const userEmail = user.email ? user.email.toLowerCase().trim() : '';

    // ─── ADMIN EMAIL HARD BYPASS ───
    // Agar koi explicitly admin email se logged in hai, toh use hamesha access dein
    if (userEmail === 'admin@servista.com') {
      console.log("Admin email bypass activated inside ProtectedRoute.");
      return children ? children : <Outlet />;
    }

    // 2. Allowed Roles check
    if (allowedRoles && allowedRoles.length > 0) {
      const hasAccess = allowedRoles.some(role => role.toLowerCase().trim() === userRole);
      
      if (!hasAccess) {
        console.log(`Unauthorized: Role '${userRole}' does not have access to this pipeline section.`);
        // Infinite loop se bachne ke liye aap standard user ko uske relevant page par redirect kar sakte hain, ya homepage par
        return <Navigate to="/" replace />;
      }
    }
  } catch (error) {
    console.error("Error parsing user context data:", error);
    return <Navigate to="/login" replace />;
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;