import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from "../context/AuthProvider";
import { useAdmin } from "../context/AdminProvider";

const AdminRoute = () => {
  const { user, userRole } = useAdmin(); // Assuming you have a custom hook for auth

  if (!user) {
    // If the user is not logged in, redirect to login page
    return <Navigate to="/login" replace />;
  }

  if (userRole !== 'admin') {
    // If the user is not an admin, redirect to home page or show an error page
    return <Navigate to="/" replace />;
  }

  // If the user is an admin, render the child routes
  return <Outlet />;
};

export default AdminRoute;