import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

// Small ratings summary component (average + distribution bars)
const RatingsSummary = ({ reviews = [], loading }) => {
  const total = reviews.length;
  const counts = [0,0,0,0,0]; // index 0 -> 1-star, index 4 ->5-star

  reviews.forEach(r => {
    const idx = Math.max(0, Math.min(4, r.rating - 1));
    counts[idx]++;
  });

  const average = total ? (reviews.reduce((s,r) => s + r.rating, 0) / total) : 0;

  const bar = (count) => {
    const pct = total ? Math.round((count / total) * 100) : 0;
    return (
      <div className="flex items-center gap-3">
        <div className="w-10 text-sm text-gray-600">{count > 0 ? '' : ''}</div>
        <div className="flex-1 bg-gray-200 rounded h-3 overflow-hidden">
          <div className="bg-orange-400 h-3" style={{ width: `${pct}%` }} />
        </div>
        <div className="w-12 text-sm text-gray-600 text-right">{pct}%</div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="flex items-center gap-6">
        <div className="text-center">
          <div className="text-4xl font-bold text-fire-red">{(Math.round(average * 10) / 10) || 0}</div>
          <div className="text-sm text-gray-600">out of 5</div>
          <div className="text-sm text-gray-500">{total} global ratings</div>
        </div>
        <div className="flex-1">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">5 star</div>
              <div className="w-3/4 ml-4">{bar(counts[4])}</div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">4 star</div>
              <div className="w-3/4 ml-4">{bar(counts[3])}</div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">3 star</div>
              <div className="w-3/4 ml-4">{bar(counts[2])}</div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">2 star</div>
              <div className="w-3/4 ml-4">{bar(counts[1])}</div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">1 star</div>
              <div className="w-3/4 ml-4">{bar(counts[0])}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ReviewSection = ({ product }) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '', mediaFiles: [] });
  const [loading, setLoading] = useState(true);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);

  const fetchReviews = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/reviews/product/${product._id}`);
      setReviews(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setLoading(false);
    }
  }, [product._id]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleMediaUpload = (e) => {
    const files = Array.from(e.target.files);
    setUploadProgress(0);
    
    // Create preview URLs for immediate display
    const newPreviewUrls = files.map(file => ({
      url: URL.createObjectURL(file),
      type: file.type.startsWith('video/') ? 'video' : 'image'
    }));
    
    setPreviewUrls(prevUrls => [...prevUrls, ...newPreviewUrls]);
    
    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    // Create file URLs and add to review
    const fileUrls = files.map(file => URL.createObjectURL(file));
    setNewReview(prev => ({
      ...prev,
      mediaFiles: [...prev.mediaFiles, ...fileUrls]
    }));
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please login to submit a review');
      return;
    }

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        }
      };

      await axios.post('http://localhost:5000/api/reviews', {
        productId: product._id,
        rating: newReview.rating,
        comment: newReview.comment,
        mediaUrls: newReview.mediaFiles
      }, config);

      // Reset form and refresh reviews
      setNewReview({ rating: 5, comment: '', mediaFiles: [] });
      setPreviewUrls([]);
      setUploadProgress(0);
      fetchReviews();
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Error submitting review. Please try again.');
    }
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Customer Reviews</h2>
      <RatingsSummary reviews={reviews} loading={loading} />

      {/* Review Form */}
      {user && (
        <form onSubmit={handleSubmitReview} className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="mb-4">
            <label className="block font-bold mb-2">Rating</label>
            <select
              value={newReview.rating}
              onChange={(e) => setNewReview(prev => ({ ...prev, rating: parseInt(e.target.value) }))}
              className="border rounded-lg px-4 py-2"
            >
              <option value="5">⭐⭐⭐⭐⭐ (5)</option>
              <option value="4">⭐⭐⭐⭐ (4)</option>
              <option value="3">⭐⭐⭐ (3)</option>
              <option value="2">⭐⭐ (2)</option>
              <option value="1">⭐ (1)</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block font-bold mb-2">Your Review</label>
            <textarea
              value={newReview.comment}
              onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
              required
              className="w-full border rounded-lg px-4 py-2"
              rows="4"
            ></textarea>
          </div>

          <div className="mb-4">
            <label className="block font-bold mb-2">Upload Photos/Videos</label>
            <input
              type="file"
              accept="image/*,video/*"
              multiple
              onChange={handleMediaUpload}
              className="border rounded-lg px-4 py-2"
            />
            {newReview.mediaFiles.length > 0 && (
              <div className="mt-2">
                {uploadProgress > 0 && uploadProgress < 100 && (
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                    <div className="bg-fire-red h-2.5 rounded-full" style={{ width: `${uploadProgress}%` }}></div>
                  </div>
                )}
                <div className="flex gap-2 flex-wrap">
                  {previewUrls.map((file, index) => (
                    <div key={index} className="relative w-24 h-24">
                      {file.type === 'video' ? (
                        <video
                          src={file.url}
                          className="w-full h-full object-cover rounded"
                          controls
                        />
                      ) : (
                        <img 
                          src={file.url} 
                          alt={`Preview ${index + 1}`}
                          className="w-full h-full object-cover rounded"
                        />
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          setPreviewUrls(prev => prev.filter((_, i) => i !== index));
                          setNewReview(prev => ({
                            ...prev,
                            mediaFiles: prev.mediaFiles.filter((_, i) => i !== index)
                          }));
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="bg-fire-red text-white px-6 py-2 rounded-lg font-bold hover:bg-red-700"
          >
            Submit Review
          </button>
        </form>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-4">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-fire-red"></div>
          </div>
        ) : reviews.length === 0 ? (
          <p className="text-gray-600 text-center py-4">No reviews yet. Be the first to review!</p>
        ) : (
          reviews.map((review) => (
            <div key={review._id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-bold">{review.user.name}</p>
                  <p className="text-gray-600 text-sm">{new Date(review.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center">
                  <span className="text-yellow-400">{'⭐'.repeat(review.rating)}</span>
                  {review.isVerifiedPurchase && (
                    <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                      Verified Purchase
                    </span>
                  )}
                </div>
              </div>
              <p className="text-gray-700 mb-4">{review.comment}</p>
              {review.mediaUrls?.length > 0 && (
                <div className="flex gap-2 flex-wrap">
                  {review.mediaUrls.map((url, index) => (
                    <div key={index} className="relative w-24 h-24">
                      {url.includes('video') ? (
                        <video
                          src={url}
                          className="w-full h-full object-cover rounded"
                          controls
                        />
                      ) : (
                        <img
                          src={url}
                          alt={`Review media ${index + 1}`}
                          className="w-full h-full object-cover rounded"
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ReviewSection;