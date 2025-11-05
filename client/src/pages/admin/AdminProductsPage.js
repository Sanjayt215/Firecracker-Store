import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const AdminProductsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Day Crackers',
    stock: '',
    productImageURLs: [''],
    safetyWarningText: '⚠️ SAFETY WARNING: Use firecrackers safely. Keep away from children. Use in open spaces only. Read instructions carefully. Not responsible for misuse.',
    demoVideoURL: 'https://www.youtube.com/embed/example',
    featured: false,
    bestSeller: false
  });

  useEffect(() => {
    if (!user || !user.isAdmin) {
      navigate('/');
    } else {
      fetchProducts();
    }
  }, [user, navigate]);

  const fetchProducts = async () => {
    try {
      const config = {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      };
      const response = await axios.get('http://localhost:5000/api/products', config);
      setProducts(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    if (e.target.name === 'imageURL') {
      // Handle multiple image URLs
      const index = parseInt(e.target.dataset.index);
      const newImages = [...formData.productImageURLs];
      newImages[index] = e.target.value;
      setFormData({ ...formData, productImageURLs: newImages });
    } else if (e.target.type === 'checkbox') {
      setFormData({ ...formData, [e.target.name]: e.target.checked });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const addImageInput = () => {
    setFormData({
      ...formData,
      productImageURLs: [...formData.productImageURLs, '']
    });
  };

  const removeImageInput = (index) => {
    setFormData({
      ...formData,
      productImageURLs: formData.productImageURLs.filter((_, i) => i !== index)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        }
      };

      const submitData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        productImageURLs: formData.productImageURLs.filter(url => url.trim() !== '')
      };

      if (editingProduct) {
        await axios.put(`http://localhost:5000/api/products/${editingProduct._id}`, submitData, config);
      } else {
        await axios.post('http://localhost:5000/api/products', submitData, config);
      }

      resetForm();
      fetchProducts();
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Error saving product');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      stock: product.stock,
      productImageURLs: product.productImageURLs,
      safetyWarningText: product.safetyWarningText,
      demoVideoURL: product.demoVideoURL,
      featured: product.featured,
      bestSeller: product.bestSeller
    });
    setShowForm(true);
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const config = {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        };
        await axios.delete(`http://localhost:5000/api/products/${productId}`, config);
        fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Error deleting product');
      }
    }
  };

  const resetForm = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      category: 'Day Crackers',
      stock: '',
      productImageURLs: [''],
      safetyWarningText: '⚠️ SAFETY WARNING: Use firecrackers safely. Keep away from children. Use in open spaces only. Read instructions carefully. Not responsible for misuse.',
      demoVideoURL: 'https://www.youtube.com/embed/example',
      featured: false,
      bestSeller: false
    });
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
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Product Management</h1>
        <button
          onClick={() => {
            if (showForm) {
              // closing the form: hide and reset fields
              setShowForm(false);
              resetForm();
            } else {
              // opening the form: reset fields and show
              resetForm();
              setShowForm(true);
            }
          }}
          className="bg-fire-red text-white px-6 py-3 rounded-lg font-bold hover:bg-red-700"
        >
          {showForm ? 'Cancel' : '+ Add Product'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-bold mb-2">Product Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-lg px-4 py-2"
                />
              </div>
              <div>
                <label className="block font-bold mb-2">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-lg px-4 py-2"
                >
                  <option>Day Crackers</option>
                  <option>Night Crackers</option>
                  <option>Customize Boxes</option>
                  <option>Gift Boxes</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-bold mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows="3"
                className="w-full border rounded-lg px-4 py-2"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-bold mb-2">Price (₹)</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  step="0.01"
                  min="0"
                  className="w-full border rounded-lg px-4 py-2"
                />
              </div>
              <div>
                <label className="block font-bold mb-2">Stock</label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  required
                  min="0"
                  className="w-full border rounded-lg px-4 py-2"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold mb-2">Product Images (URLs)</label>
              {formData.productImageURLs.map((url, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="url"
                    name="imageURL"
                    data-index={index}
                    value={url}
                    onChange={handleChange}
                    placeholder={`Image URL ${index + 1}`}
                    className="flex-1 border rounded-lg px-4 py-2"
                  />
                  <button
                    type="button"
                    onClick={() => removeImageInput(index)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addImageInput}
                className="text-fire-red font-bold"
              >
                + Add Image URL
              </button>
            </div>

            <div>
              <label className="block font-bold mb-2">Safety Warning Text</label>
              <textarea
                name="safetyWarningText"
                value={formData.safetyWarningText}
                onChange={handleChange}
                required
                rows="3"
                className="w-full border rounded-lg px-4 py-2"
              />
            </div>

            <div>
              <label className="block font-bold mb-2">Demo Video URL</label>
              <input
                type="url"
                name="demoVideoURL"
                value={formData.demoVideoURL}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2"
              />
            </div>

            <div className="flex gap-6">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleChange}
                  className="w-4 h-4"
                />
                <span>Featured</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="bestSeller"
                  checked={formData.bestSeller}
                  onChange={handleChange}
                  className="w-4 h-4"
                />
                <span>Best Seller</span>
              </label>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                className="flex-1 bg-fire-red text-white py-3 rounded-lg font-bold hover:bg-red-700"
              >
                {editingProduct ? 'Update Product' : 'Add Product'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full bg-white rounded-lg shadow-md">
          <thead>
            <tr className="border-b">
              <th className="px-4 py-3 text-left">Image</th>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Category</th>
              <th className="px-4 py-3 text-left">Price</th>
              <th className="px-4 py-3 text-left">Stock</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3">
                  <img
                    src={product.productImageURLs[0]}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/64x64';
                    }}
                  />
                </td>
                <td className="px-4 py-3 font-bold">{product.name}</td>
                <td className="px-4 py-3">{product.category}</td>
                <td className="px-4 py-3">₹{product.price}</td>
                <td className="px-4 py-3">{product.stock}</td>
                <td className="px-4 py-3 flex gap-2">
                  <button
                    onClick={() => handleEdit(product)}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminProductsPage;

