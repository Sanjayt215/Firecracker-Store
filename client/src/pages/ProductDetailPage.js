import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/products/${id}`);
        setProduct(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching product:', error);
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    navigate('/cart');
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-fire-red"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-xl text-gray-600">Product not found.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Images */}
        <div>
          <div className="mb-4">
            <img
              src={product.productImageURLs[selectedImage]}
              alt={product.name}
              className="w-full h-96 object-cover rounded-lg"
              onError={(e) => {
                e.target.src = 'https://placehold.co/600x600?text=Product+Image';
              }}
            />
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {product.productImageURLs.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`${product.name} ${index + 1}`}
                className={`w-20 h-20 object-cover rounded cursor-pointer border-2 ${
                  selectedImage === index ? 'border-fire-red' : 'border-gray-300'
                }`}
                onClick={() => setSelectedImage(index)}
                onError={(e) => {
                  e.target.src = 'https://placehold.co/80x80?text=Image';
                }}
              />
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
          <p className="text-3xl font-bold text-fire-red mb-4">₹{product.price}</p>
          
          {/* Safety Warning */}
          <div className="bg-red-50 border-l-4 border-fire-red p-4 mb-6">
            <p className="text-red-800 font-semibold">⚠️ SAFETY WARNING</p>
            <p className="text-red-700 mt-2">{product.safetyWarningText}</p>
          </div>

          <div className="mb-6">
            <p className="text-gray-700 mb-2">{product.description}</p>
            <p className="text-gray-600"><strong>Category:</strong> {product.category}</p>
            <p className="text-gray-600"><strong>Stock:</strong> {product.stock} units available</p>
            <p className="text-gray-600"><strong>Rating:</strong> {'⭐'.repeat(Math.floor(product.rating))} ({product.rating}/5)</p>
          </div>

          {/* Demo Video */}
          <div className="mb-6">
            <h3 className="text-xl font-bold mb-2">Demo Video</h3>
            {(() => {
              // Normalize demoVideoURL to a YouTube embed URL if possible
              const url = product.demoVideoURL || '';
              // Try to extract a YouTube video id from common URL formats including shorts
              // Handle: watch?v=ID, youtu.be/ID, embed/ID, shorts/ID, or just the ID
              const ytIdMatch = url.match(/(?:v=|v\/|embed\/|youtu\.be\/|watch\?v=|shorts\/)([A-Za-z0-9_-]{11})/);
              let videoId = null;
              if (ytIdMatch && ytIdMatch[1]) {
                videoId = ytIdMatch[1];
              } else {
                // maybe the user saved just the id (11 chars) or pasted a URL with params - try a last-segment fallback
                const plainIdMatch = url.match(/^([A-Za-z0-9_-]{11})$/);
                if (plainIdMatch) {
                  videoId = plainIdMatch[1];
                } else if (url) {
                  // fallback: take last path segment and strip query params
                  try {
                    const lastSeg = url.replace(/\/$/, '').split('/').pop();
                    const cleaned = lastSeg ? lastSeg.split(/[?&]/)[0] : null;
                    if (cleaned && /^[A-Za-z0-9_-]{11}$/.test(cleaned)) videoId = cleaned;
                  } catch (e) {
                    // ignore
                  }
                }
              }

              if (!videoId) {
                return (
                  <div className="rounded-lg bg-gray-100 p-6 text-center text-sm text-gray-600">
                    Demo not available or invalid video URL.
                  </div>
                );
              }

              const embedUrl = `https://www.youtube.com/embed/${videoId}`;

              return (
                <div className="relative pb-[56.25%] h-0 overflow-hidden rounded-lg bg-black">
                  <iframe
                    className="absolute top-0 left-0 w-full h-full"
                    src={embedUrl}
                    title={`${product.name} Demo`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="strict-origin-when-cross-origin"
                  />
                </div>
              );
            })()}
          </div>

          {/* Add to Cart */}
          <div className="mb-6">
            <label className="block mb-2 font-bold">Quantity:</label>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                className="bg-gray-200 px-4 py-2 rounded font-bold hover:bg-gray-300"
              >
                -
              </button>
              <span className="text-xl font-bold">{quantity}</span>
              <button
                onClick={() => quantity < product.stock && setQuantity(quantity + 1)}
                className="bg-gray-200 px-4 py-2 rounded font-bold hover:bg-gray-300"
              >
                +
              </button>
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="w-full bg-fire-red text-white py-4 rounded-lg font-bold text-lg hover:bg-red-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;

