import React from 'react';
import { Link } from 'react-router-dom';

const OrderSuccessPage = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-6">
          <span className="text-8xl">✅</span>
        </div>
        <h1 className="text-4xl font-bold mb-4 text-green-600">Order Placed Successfully!</h1>
        <p className="text-xl text-gray-700 mb-8">
          Thank you for your purchase. Your order has been received and is being processed.
        </p>

        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
          <p className="text-yellow-800 font-semibold">⚠️ What's Next?</p>
          <p className="text-yellow-700 mt-2">
            Our admin team will verify your payment and update the order status. 
            You can track your order status in your profile page.
          </p>
        </div>

        <div className="flex gap-4 justify-center">
          <Link
            to="/profile"
            className="bg-fire-red text-white px-6 py-3 rounded-lg font-bold hover:bg-red-700"
          >
            View Orders
          </Link>
          <Link
            to="/"
            className="bg-gray-300 text-gray-800 px-6 py-3 rounded-lg font-bold hover:bg-gray-400"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;










