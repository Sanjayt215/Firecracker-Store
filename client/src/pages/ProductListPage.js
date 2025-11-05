import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

const ProductListPage = () => {
  const { slug } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const categoryMap = {
    'day-crackers': 'Day Crackers',
    'night-crackers': 'Night Crackers',
    'accessories': 'Customize Boxes',
    'display-boxes': 'Gift Boxes'
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // Determine display name and API filter category
        const displayCategory = categoryMap[slug];
        // Special rules:
        // - 'accessories' (Customize Boxes) should show ALL products (no filter)
        // - 'display-boxes' (Gift Boxes) should fetch products stored under legacy 'Display Boxes'
        const apiCategory = slug === 'display-boxes'
          ? 'Display Boxes'
          : slug === 'accessories'
            ? undefined
            : displayCategory;

        // If no apiCategory, fetch all products
        const url = apiCategory
          ? `http://localhost:5000/api/products?category=${encodeURIComponent(apiCategory)}`
          : `http://localhost:5000/api/products`;
        const response = await axios.get(url);
        setProducts(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, [slug]);

  const filteredProducts = products.filter(product => {
    if (filter === 'featured') return product.featured;
    if (filter === 'best-seller') return product.bestSeller;
    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    return 0;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6 capitalize">{categoryMap[slug] || 'All Products'}</h1>

      <div className="mb-6 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-4">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded ${filter === 'all' ? 'bg-fire-red text-white' : 'bg-gray-200'}`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('featured')}
            className={`px-4 py-2 rounded ${filter === 'featured' ? 'bg-fire-red text-white' : 'bg-gray-200'}`}
          >
            Featured
          </button>
          <button
            onClick={() => setFilter('best-seller')}
            className={`px-4 py-2 rounded ${filter === 'best-seller' ? 'bg-fire-red text-white' : 'bg-gray-200'}`}
          >
            Best Seller
          </button>
        </div>
        <p className="text-gray-600">{filteredProducts.length} products found</p>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-fire-red"></div>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600">No products found in this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {sortedProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductListPage;



