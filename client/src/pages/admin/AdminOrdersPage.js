import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const AdminOrdersPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    if (!user || !user.isAdmin) {
      navigate('/');
    } else {
      fetchOrders();
    }
  }, [user, navigate]);

  const fetchOrders = async () => {
    try {
      const config = {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      };
      const response = await axios.get('http://localhost:5000/api/orders', config);
      setOrders(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const config = {
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        }
      };
      await axios.put(`http://localhost:5000/api/orders/${orderId}/status`, { orderStatus: newStatus }, config);
      fetchOrders();
      setSelectedOrder(null);
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Error updating order status');
    }
  };

  if (!user || !user.isAdmin) {
    return null;
  }

  if (loading) {
    return <div className="container mx-auto px-4 py-12 text-center">
      <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-fire-red"></div>
    </div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Order Management</h1>

      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Order Details</h2>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-2xl font-bold text-gray-600 hover:text-gray-800"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <strong>Order Number:</strong> {selectedOrder.orderNumber}
              </div>
              <div>
                <strong>Customer:</strong> {selectedOrder.user?.name || 'Unknown'} ({selectedOrder.user?.email || 'N/A'})
              </div>
              <div>
                <strong>Order Date:</strong> {new Date(selectedOrder.createdAt).toLocaleString()}
              </div>
              <div>
                <strong>Status:</strong>
                <select
                  value={selectedOrder.orderStatus}
                  onChange={(e) => handleStatusChange(selectedOrder._id, e.target.value)}
                  className="ml-2 border rounded-lg px-2 py-1"
                >
                  <option value="Pending">Pending</option>
                  <option value="Payment Verified">Payment Verified</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <strong>Items:</strong>
                <div className="mt-2 space-y-1">
                  {selectedOrder.orderItems.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>{item.name} x{item.quantity}</span>
                      <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <strong>Shipping Address:</strong>
                <p className="text-sm text-gray-700 mt-1">
                  {selectedOrder.shippingAddress.name}<br />
                  {selectedOrder.shippingAddress.address}<br />
                  {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} - {selectedOrder.shippingAddress.zipCode}<br />
                  Phone: {selectedOrder.shippingAddress.phone}
                </p>
              </div>

              <div className="border-t pt-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>₹{selectedOrder.itemsPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span>₹{selectedOrder.shippingPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg text-fire-red border-t pt-2 mt-2">
                  <span>Total:</span>
                  <span>₹{selectedOrder.totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full bg-white rounded-lg shadow-md">
          <thead>
            <tr className="border-b">
              <th className="px-4 py-3 text-left">Order #</th>
              <th className="px-4 py-3 text-left">Customer</th>
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-left">Total</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-4 py-6 text-center text-gray-600">
                  No orders found
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order._id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 font-bold">{order.orderNumber}</td>
                  <td className="px-4 py-3">{order.user?.name || 'Unknown'}</td>
                  <td className="px-4 py-3">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3">₹{order.totalPrice.toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <select
                      value={order.orderStatus}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      className="border rounded-lg px-2 py-1 text-sm"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Payment Verified">Payment Verified</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrdersPage;










