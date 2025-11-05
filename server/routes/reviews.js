const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');

// @route   POST /api/reviews
// @desc    Create a new review
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { productId, rating, comment, mediaUrls } = req.body;

    // Check if user has already reviewed this product
    const existingReview = await Review.findOne({
      user: req.user._id,
      product: productId
    });

    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this product' });
    }

    // Check if it's a verified purchase
    const orders = await Order.find({
      user: req.user._id,
      'orderItems.product': productId,
      orderStatus: 'Delivered'
    });
    const isVerifiedPurchase = orders.length > 0;

    const review = new Review({
      user: req.user._id,
      product: productId,
      rating,
      comment,
      mediaUrls,
      isVerifiedPurchase
    });

    await review.save();

    // Update product rating
    const allReviews = await Review.find({ product: productId });
    const avgRating = allReviews.reduce((acc, item) => acc + item.rating, 0) / allReviews.length;
    await Product.findByIdAndUpdate(productId, {
      rating: avgRating,
      numReviews: allReviews.length
    });

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/reviews/product/:productId
// @desc    Get all reviews for a product
// @access  Public
router.get('/product/:productId', async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId })
      .populate('user', 'name')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/reviews/:id
// @desc    Delete a review
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if user owns the review
    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await review.deleteOne();

    // Update product rating
    const allReviews = await Review.find({ product: review.product });
    const avgRating = allReviews.length 
      ? allReviews.reduce((acc, item) => acc + item.rating, 0) / allReviews.length
      : 0;
    
    await Product.findByIdAndUpdate(review.product, {
      rating: avgRating,
      numReviews: allReviews.length
    });

    res.json({ message: 'Review removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;