const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { protect, admin } = require('../middleware/auth');

// @route   POST /api/orders
// @desc    Create new order
// @access  Private
 router.post('/', protect, async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      totalPrice
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    // Normalize incoming items to match Order schema
    // Frontend sends: { productId, name, image, price, quantity }
    // Schema expects: { product: ObjectId, name, image, price, quantity }
    const normalizedItems = orderItems.map((item) => ({
      product: item.product || item.productId, // allow either field
      name: item.name,
      image: item.image,
      price: item.price,
      quantity: item.quantity
    }));

    // Basic validation: ensure each item has a product id and quantity
    for (const it of normalizedItems) {
      if (!it.product) {
        return res.status(400).json({ message: 'Order item missing product reference' });
      }
      if (!it.quantity || it.quantity < 1) {
        return res.status(400).json({ message: 'Invalid item quantity' });
      }
    }

    // Generate unique order number
    const orderNumber = `ORD-${uuidv4().split('-')[0].toUpperCase()}`;

    // Create UPI payment link
    const upiId = 'sanjaytamil248@okicici'; // Replace with actual merchant UPI ID
    const upiName = 'Sanjay Tamil Vedi';
    const paymentAmount = totalPrice;
    const upiPaymentLink = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(upiName)}&am=${paymentAmount}&tr=${orderNumber}&cu=INR&tn=${encodeURIComponent('Firecracker Order Payment')}`;

    const order = new Order({
      orderNumber,
      user: req.user._id,
      orderItems: normalizedItems,
      shippingAddress,
      paymentMethod,
      upiPaymentLink,
      itemsPrice: Number(itemsPrice) || 0,
      shippingPrice: Number(shippingPrice) || 0,
      totalPrice: Number(totalPrice) || 0
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/orders/myorders
// @desc    Get logged in user orders
// @access  Private
router.get('/myorders', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate('orderItems.product');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/orders/:id
// @desc    Get order by ID
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('orderItems.product');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if user is authorized
    if (order.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/orders
// @desc    Get all orders
// @access  Private/Admin
router.get('/', protect, admin, async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate('user', 'name email')
      .populate('orderItems.product');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/orders/:id/status
// @desc    Update order status
// @access  Private/Admin
router.put('/:id/status', protect, admin, async (req, res) => {
  try {
    const { orderStatus } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.orderStatus = orderStatus;
    
    if (orderStatus === 'Payment Verified') {
      order.paidAt = new Date();
    }
    
    if (orderStatus === 'Delivered') {
      order.deliveredAt = new Date();
    }

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

