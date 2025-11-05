import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !user.isAdmin) {
      navigate('/');
    }
  }, [user, navigate]);

  if (!user || !user.isAdmin) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          to="/admin/products"
          className="bg-white rounded-lg shadow-md p-8 hover:shadow-xl transition transform hover:scale-105"
        >
          <div className="text-6xl mb-4">📦</div>
          <h2 className="text-2xl font-bold mb-2">Manage Products</h2>
          <p className="text-gray-600">Add, edit, or remove products</p>
        </Link>

        <Link
          to="/admin/orders"
          className="bg-white rounded-lg shadow-md p-8 hover:shadow-xl transition transform hover:scale-105"
        >
          <div className="text-6xl mb-4">📋</div>
          <h2 className="text-2xl font-bold mb-2">Manage Orders</h2>
          <p className="text-gray-600">View and update order status</p>
        </Link>

        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="text-6xl mb-4">👥</div>
          <h2 className="text-2xl font-bold mb-2">Manage Users</h2>
          <p className="text-gray-600">Coming soon</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;









