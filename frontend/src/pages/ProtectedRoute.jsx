import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  // LocalStorage se check karenge ke user logged in hai ya nahi
  const user = JSON.parse(localStorage.getItem('user')); 

  // Agar user logged in nahi hai, ya uski email admin ki nahi hai
  // (Aap yahan apni marzi ki admin email rakh sakte hain)
  if (!user || user.email !== 'admin@servista.com') {
    alert("Access Denied! only admin can view this page.");
    return <Navigate to="/login" replace />;
  }

  // Agar admin hai toh page load hone do
  return children;
};

export default ProtectedRoute;