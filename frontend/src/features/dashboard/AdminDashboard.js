import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardLayout from './DashboardLayout';
import AdminDashboardHome from './AdminDashboardHome';
import ManageTickets from './ManageTickets';
import ManageUsers from './ManageUsers';
import ManageProfile from './ManageProfile';

const AdminDashboard = () => (
  <Routes>
    {/* Default route for dashboard */}
    <Route path="/" element={<DashboardLayout />}>
      <Route index element={<AdminDashboardHome />} />
      <Route path="tickets" element={<ManageTickets />} />
      <Route path="users" element={<ManageUsers />} />
      <Route path="profile" element={<ManageProfile />} />
    </Route>
  </Routes>
);

export default AdminDashboard;
