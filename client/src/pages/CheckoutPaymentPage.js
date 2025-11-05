import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import QRCode from 'qrcode';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const CheckoutPaymentPage = () => {
  const { cart, getCartTotal, user, clearCart } = useAuth();
  const navigate = useNavigate();
  const [orderData, setOrderData] = useState(null);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: ''
  });
  const [paymentProofs, setPaymentProofs] = useState([]);

  const orderCreatedRef = useRef(false);
  const orderCreatingRef = useRef(false);

  useEffect(() => {
    if (!cart.length) {
      navigate('/');
      return;
    }

    const createOrder = async () => {
      try {
        // prevent duplicate creations when user toggles payment options
        if (orderCreatedRef.current || orderCreatingRef.current) return;
        orderCreatingRef.current = true;
        const shippingInfo = JSON.parse(localStorage.getItem('shippingInfo'));
        const itemsPrice = getCartTotal();
        const shippingPrice = paymentMethod === 'COD' ? 100 : 50; // Extra charge for COD
        const totalPrice = itemsPrice + shippingPrice;

        const orderData = {
          orderItems: cart,
          shippingAddress: shippingInfo,
          // send the currently selected payment method
          paymentMethod: paymentMethod,
          itemsPrice,
          shippingPrice,
          totalPrice
        };

        const config = {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`
          }
        };

  const response = await axios.post('http://localhost:5000/api/orders', orderData, config);
  setOrderData(response.data);
  orderCreatedRef.current = true;
  orderCreatingRef.current = false;
        
        // Generate QR Code
        // Prefer the server-provided UPI link; if missing, build a fallback UPI string
        try {
          let upiLink = response.data.upiPaymentLink;

          if (!upiLink) {
            // Fallback: construct a UPI string locally. Keep the same merchant UPI as server's default.
            const upiId = 'sanjaytamil248@okicici';
            const upiName = 'Sanjay Tamil Vedi';
            const amount = response.data.totalPrice || totalPrice;
            const orderNum = response.data.orderNumber || response.data._id || Date.now();
            upiLink = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(upiName)}&am=${amount}&tr=${orderNum}&cu=INR&tn=${encodeURIComponent('Firecracker Order Payment')}`;
          }

          const qrUrl = await QRCode.toDataURL(upiLink);
          setQrCodeDataUrl(qrUrl);
        } catch (qrErr) {
          console.error('QR generation failed:', qrErr);
          setQrCodeDataUrl('');
        }
      } catch (error) {
        console.error('Error creating order:', error);
        orderCreatingRef.current = false;
        alert('Error creating order. Please try again.');
      }
    };

    if (user && cart.length) {
      createOrder();
    }
  }, [cart, user, getCartTotal, navigate, paymentMethod]);

  const handleVerifyPayment = () => {
    let message = '';
    switch(paymentMethod) {
      case 'UPI':
        message = 'Thank you for your payment! Your order will be verified by our admin team shortly.';
        break;
      case 'CARD':
        if (!cardDetails.number || !cardDetails.expiry || !cardDetails.cvv) {
          alert('Please fill in all card details');
          return;
        }
        message = 'Card payment processed successfully!';
        break;
      case 'PAYTM':
        message = 'Redirecting to Paytm...';
        // In a real app, you would integrate with Paytm API here
        break;
      case 'COD':
        message = 'Order placed successfully! Payment will be collected on delivery.';
        break;
      case 'WALLET':
        message = 'Payment processed from your wallet balance!';
        break;
      default:
        message = 'Payment processed successfully!';
    }
    
    alert(message);
    clearCart();
    localStorage.removeItem('shippingInfo');
    navigate('/order/success');
  };

  if (!orderData) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-fire-red"></div>
        <p className="mt-4">Creating your order...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Payment</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Order Summary */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
          <div className="space-y-2 mb-4">
            {orderData.orderItems.map((item, index) => (
              <div key={index} className="flex justify-between">
                <span>{item.name} x{item.quantity}</span>
                <span>₹{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="border-t pt-2 mt-4">
            <div className="flex justify-between mb-2">
              <span>Subtotal:</span>
              <span>₹{orderData.itemsPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Shipping:</span>
              <span>₹{orderData.shippingPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xl font-bold text-fire-red border-t pt-2 mt-2">
              <span>Total:</span>
              <span>₹{orderData.totalPrice.toFixed(2)}</span>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="font-bold mb-2">Order Number:</h3>
            <p className="text-fire-red font-bold">{orderData.orderNumber}</p>
          </div>

          <div className="mt-6">
            <h3 className="font-bold mb-2">Delivery Address:</h3>
            <p className="text-gray-700">
              {orderData.shippingAddress.name}<br />
              {orderData.shippingAddress.address}<br />
              {orderData.shippingAddress.city}, {orderData.shippingAddress.state} - {orderData.shippingAddress.zipCode}<br />
              Phone: {orderData.shippingAddress.phone}
            </p>
          </div>
        </div>

        {/* Payment Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">Select Payment Method</h2>

          {/* Wallet / Balance section (UI only) */}
          <div className="bg-gray-50 p-4 rounded mb-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600">Your available balance</div>
                <div className="font-bold">₹{user?.walletBalance ? user.walletBalance.toFixed(2) : '0.00'}</div>
              </div>
              <div>
                <button className="px-4 py-2 bg-white border rounded">Add money</button>
              </div>
            </div>
          </div>

          <div className="space-y-4 mb-6">
            <label className="flex items-center space-x-3">
              <input
                type="radio"
                name="payment"
                value="UPI"
                checked={paymentMethod === 'UPI'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="form-radio text-fire-red"
              />
              <span>UPI Payment</span>
            </label>

            <label className="flex items-center space-x-3">
              <input
                type="radio"
                name="payment"
                value="COD"
                checked={paymentMethod === 'COD'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="form-radio text-fire-red"
              />
              <span>Cash on Delivery (+₹100)</span>
            </label>
          </div>

          {paymentMethod === 'UPI' && (
            <div>
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                <p className="text-yellow-800 font-semibold">ℹ️ Important Information</p>
                <p className="text-yellow-700 mt-2 text-sm">
                  Please complete the payment using the QR code below. Your order will be processed after manual verification by our admin team.
                </p>
              </div>

              <div className="flex flex-col items-center mb-6">
                <h3 className="text-lg font-bold mb-4">Scan to Pay</h3>
                <div className="bg-white p-4 border-2 border-fire-red rounded-lg">
                  {qrCodeDataUrl ? (
                    <div className="relative">
                      <img 
                        src={qrCodeDataUrl} 
                        alt="UPI QR Code" 
                        className="w-64 h-64"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNTYiIGhlaWdodD0iMjU2IiB2aWV3Qm94PSIwIDAgMjU2IDI1NiI+PHJlY3Qgd2lkdGg9IjI1NiIgaGVpZ2h0PSIyNTYiIGZpbGw9IiNmOGY5ZmEiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9Im1vbm9zcGFjZSIgZm9udC1zaXplPSIyNnB4IiBmaWxsPSIjZGVlMmU2Ij5RUiBDb2RlPC90ZXh0Pjwvc3ZnPg==';
                        }}
                      />
                        {/* price overlay removed so QR is fully visible */}
                    </div>
                  ) : (
                    <div className="w-64 h-64 flex items-center justify-center bg-gray-100 rounded-lg">
                      <div className="text-center">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-fire-red mb-2"></div>
                        <p className="text-gray-600">Generating QR Code...</p>
                      </div>
                    </div>
                  )}
                </div>
                <div className="mt-4 space-y-2 text-center">
                  <p className="font-bold text-lg">Total Amount: ₹{orderData.totalPrice.toFixed(2)}</p>
                  <p className="text-sm text-gray-600">Scan using any UPI app (Google Pay, PhonePe, Paytm, etc.)</p>
                </div>
                {/* Payment proof upload for UPI - user can upload screenshot of their payment */}
                <div className="mt-4 w-full">
                  <label className="block font-bold mb-2">Upload payment proof (screenshot/photo)</label>
                  <input
                    type="file"
                    accept="image/*,video/*"
                    multiple
                    onChange={(e) => {
                      const files = Array.from(e.target.files);
                      const urls = files.map(f => ({ url: URL.createObjectURL(f), type: f.type.startsWith('video/') ? 'video' : 'image' }));
                      setPaymentProofs(prev => [...prev, ...urls]);
                    }}
                    className="mb-2"
                  />
                  {paymentProofs.length > 0 && (
                    <div className="flex gap-2 flex-wrap">
                      {paymentProofs.map((p, idx) => (
                        <div key={idx} className="relative w-28 h-28 bg-gray-50 rounded overflow-hidden border">
                          {p.type === 'video' ? (
                            <video src={p.url} className="w-full h-full object-cover" controls />
                          ) : (
                            <img src={p.url} alt={`proof-${idx}`} className="w-full h-full object-cover" />
                          )}
                          <button
                            type="button"
                            onClick={() => setPaymentProofs(prev => prev.filter((_, i) => i !== idx))}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                          >×</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {paymentMethod === 'CARD' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Card Number</label>
                <input
                  type="text"
                  value={cardDetails.number}
                  onChange={(e) => setCardDetails({...cardDetails, number: e.target.value})}
                  placeholder="1234 5678 9012 3456"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
                  <input
                    type="text"
                    value={cardDetails.expiry}
                    onChange={(e) => setCardDetails({...cardDetails, expiry: e.target.value})}
                    placeholder="MM/YY"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">CVV</label>
                  <input
                    type="text"
                    value={cardDetails.cvv}
                    onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value})}
                    placeholder="123"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="bg-gray-50 p-4 rounded mb-6">
            <h4 className="font-bold mb-2">Payment Instructions:</h4>
            <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
              <li>Scan the QR code with any UPI app (Google Pay, PhonePe, Paytm, etc.)</li>
              <li>Verify the order amount: ₹{orderData.totalPrice.toFixed(2)}</li>
              <li>Complete the payment</li>
              <li>Click "I've Paid" below to proceed</li>
              <li>Your order status will be updated once verified by admin</li>
            </ol>
          </div>

          {/* Payment button text changes based on payment method */}
          <button
            onClick={handleVerifyPayment}
            className="w-full bg-fire-red text-white py-3 rounded-lg font-bold text-lg hover:bg-red-700 transition mb-4"
          >
            {paymentMethod === 'UPI' ? "I've Paid - Continue" :
             paymentMethod === 'CARD' ? "Pay ₹" + orderData.totalPrice.toFixed(2) :
             paymentMethod === 'COD' ? "Place Order (Pay on Delivery)" :
             paymentMethod === 'PAYTM' ? "Pay with Paytm" :
             "Complete Payment"}
          </button>

          <button
            onClick={() => navigate('/cart')}
            className="w-full bg-gray-300 text-gray-800 py-3 rounded-lg font-bold hover:bg-gray-400"
          >
            Cancel Order
          </button>

          {/* Display loyalty points that can be earned */}
          <div className="mt-4 text-center text-sm text-gray-600">
            You will earn {Math.floor(orderData.totalPrice * 0.05)} loyalty points with this order!
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPaymentPage;

