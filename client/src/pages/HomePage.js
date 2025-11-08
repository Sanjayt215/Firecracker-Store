import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [bestSellerProducts, setBestSellerProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const [featured, bestSeller] = await Promise.all([
          axios.get('http://localhost:5000/api/products?featured=true'),
          axios.get('http://localhost:5000/api/products?bestSeller=true')
        ]);
        setFeaturedProducts(featured.data);
        setBestSellerProducts(bestSeller.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const categories = [
    { name: 'Day Crackers', slug: 'day-crackers', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSN_6XO7-ZMchBBMhdTeSngznmh0dJt7opnkyRR56vWgt_OY0C9x3Ko6L4Y_murvZAQSXc&usqp=CAU' },
    { name: 'Night Crackers', slug: 'night-crackers', image: 'https://www.shutterstock.com/image-photo/red-firework-night-background-dusk-260nw-2356643451.jpg' },
    { name: 'Customize Boxes', slug: 'accessories', image: 'https://srichimafireworks.in/wp-content/uploads/2021/09/gift-boxes.jpeg' },
    { name: 'Gift Boxes', slug: 'display-boxes', image: 'https://crackersonlinechennai.com/wp-content/uploads/2025/08/WhatsApp-Image-2025-08-23-at-5.57.19-PM-300x300.jpeg' }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-fire-red via-fire-orange to-fire-yellow text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-4">🎆 Firecracker Store</h1>
          <p className="text-xl md:text-2xl mb-8">Light up your celebrations with premium firecrackers</p>
          <Link
            to="/category/all"
            className="bg-white text-fire-red px-8 py-4 rounded-full text-lg font-bold hover:bg-fire-yellow transition inline-block"
          >
            Shop Now
          </Link>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-8">Browse Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link
                key={category.slug}
                to={`/category/${category.slug}`}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all transform hover:scale-105"
              >
                <div className="relative h-48">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://placehold.co/400x300';
                    }}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-30"></div>
                </div>
                <div className="p-4 text-center">
                  <h3 className="text-xl font-bold text-gray-800">{category.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-8">Featured Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.slice(0, 4).map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Best Sellers */}
      {bestSellerProducts.length > 0 && (
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-8">Best Sellers</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {bestSellerProducts.slice(0, 4).map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Safety Banner */}
      <section className="py-8 bg-red-50 border-l-4 border-fire-red">
        <div className="container mx-auto px-4">
          <div className="flex items-center space-x-4">
            <span className="text-4xl">⚠️</span>
            <div>
              <h3 className="text-xl font-bold text-fire-red">Safety First!</h3>
              <p className="text-gray-700">Always follow safety guidelines. Keep firecrackers away from children. Use in open spaces only.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

