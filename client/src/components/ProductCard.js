import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  return (
    <Link to={`/product/${product._id}`} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow transform hover:scale-105">
      <div className="relative">
        <img
          src={product.productImageURLs[0]}
          alt={product.name}
          className="w-full h-64 object-cover"
          onError={(e) => {
            e.target.src = 'https://placehold.co/400x400?text=Product+Image';
          }}
        />
        {product.featured && (
          <span className="absolute top-2 right-2 bg-fire-yellow text-white px-2 py-1 rounded text-xs font-bold">
            Featured
          </span>
        )}
        {product.bestSeller && (
          <span className="absolute top-2 left-2 bg-fire-red text-white px-2 py-1 rounded text-xs font-bold">
            Best Seller
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-800 mb-2">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description}</p>
        <p className="text-fire-red text-xl font-bold">₹{product.price}</p>
        <p className="text-xs text-gray-500 mt-2">Stock: {product.stock} units</p>
      </div>
    </Link>
  );
};

export default ProductCard;

