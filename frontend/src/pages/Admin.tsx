import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  Pencil, Trash2, Plus, Home, X, Upload,
  Image as ImageIcon, Eye, EyeOff, LogOut
} from "lucide-react";
import { Link } from "react-router-dom";

interface Product {
  id?: number;
  name: string;
  sku?: string;
  brand?: string;
  category?: string;
  description?: string;
  long_description?: string;
  specifications?: string[];
  features?: string[];
  price?: number;
  stock_count?: number;
  in_stock: number;
  images?: string[];
  rating?: number;
  featured?: number;
}

const Admin: React.FC = () => {
  const API = import.meta.env.VITE_API_URL;
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  // Interactive fields
  const [specs, setSpecs] = useState<string[]>([]);
  const [features, setFeatures] = useState<string[]>([]);
  const [formData, setFormData] = useState<Product>({
    name: "",
    price: undefined,
    in_stock: 1,
    sku: "",
    brand: "",
    category: "",
    description: "",
    long_description: "",
    specifications: [],
    features: [],
    stock_count: undefined,
    rating: 4.5,
    featured: 0,
    images: [],
  });

  // 🔐 Auth state
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("adminToken") || "");

  // Handle login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API}/api/admin/login`, {
        username,
        password,
      });
      localStorage.setItem("adminToken", res.data.token);
      setToken(res.data.token);
      console.log({username, password})
    } catch (err: any) {
      alert(err.response?.data?.error || "Login failed");
    }
  };
  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    setToken("");
    setUsername("");
    setPassword("");
  };


  // Fetch products
  const fetchProducts = async () => {
    if (!token) return;
    try {
      const res = await axios.get("http://localhost:5000/api/products", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchProducts();
    }
  }, [token]);

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const target = e.target as HTMLInputElement;
      setFormData((prev) => ({
        ...prev,
        [name]: target.checked ? 1 : 0,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value === "" ? undefined : value,
      }));
    }
  };

  // Handle multiple image changes
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setImageFiles(prev => [...prev, ...newFiles]);
    }
  };

  // Remove image from selection
  const removeImage = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Remove existing image (for edit mode)
  const removeExistingImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images?.filter((_, i) => i !== index) || []
    }));
  };

  // Save Product (Add or Edit)
  const handleSave = async () => {
    try {
      const data = new FormData();

      // Add basic form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== undefined && value !== null && key !== "specifications" && key !== "features" && key !== "images") {
          data.append(key, String(value));
        }
      });

      // Handle specifications - send as array, backend will convert to string
      if (specs.length > 0) {
        data.append("specifications", JSON.stringify(specs));
      }

      // Handle features - send as array, backend will convert to string
      if (features.length > 0) {
        data.append("features", JSON.stringify(features));
      }

      // Add multiple images
      imageFiles.forEach((file, index) => {
        data.append(`images`, file); // Backend should handle multiple files with same name
      });

      // Include existing images for edit mode
      if (editProduct && formData.images && formData.images.length > 0) {
        data.append("existingImages", JSON.stringify(formData.images));
      }

      const url = editProduct
        ? `${API}/api/products/${editProduct.id}`
        : `${API}/api/products`;
      const method = editProduct ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        body: data,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || errorData.error || "Failed to save product");
      }

      setModalOpen(false);
      setEditProduct(null);
      fetchProducts();
      resetForm();
    } catch (err: any) {
      console.error("Failed to save product", err);
      alert(`Failed to save product: ${err.message}`);
    }
  };

  // Reset form function
  const resetForm = () => {
    setFormData({
      name: "",
      price: undefined,
      in_stock: 1,
      sku: "",
      brand: "",
      category: "",
      description: "",
      long_description: "",
      specifications: [],
      features: [],
      stock_count: undefined,
      rating: 4.5,
      featured: 0,
      images: [],
    });
    setSpecs([]);
    setFeatures([]);
    setImageFiles([]);
  };

  // Delete Product
  const handleDelete = async (id?: number) => {
    if (!id) return;
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await axios.delete(`${API}/api/products/${id}`);
      fetchProducts();
    } catch (err) {
      console.error("Failed to delete product", err);
    }
  };

  // Open Add Modal
  const openAddModal = () => {
    setEditProduct(null);
    resetForm();
    setModalOpen(true);
  };

  // Open Edit Modal
  const openEditModal = (product: Product) => {
    setEditProduct(product);
    setFormData(product);
    setSpecs(Array.isArray(product.specifications) ? product.specifications : []);
    setFeatures(Array.isArray(product.features) ? product.features : []);
    setImageFiles([]);
    setModalOpen(true);
  };

  if (!token) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-sm">
          <h2 className="text-2xl font-bold mb-6 text-center">Admin Login</h2>
          <form onSubmit={handleLogin} className="flex flex-col space-y-4">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="border p-2 rounded w-full"
              required
            />
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border p-2 rounded w-full"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2 text-gray-500"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <div className="bg-white shadow-sm border-b px-6 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <Home className="h-4 w-4" />
            Back to Home
          </Link>
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Product
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </div>

      {/* Product Grid */}
      <div className="p-6">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <motion.div
                key={product.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                whileHover={{ y: -2 }}
              >
                {/* Display first image or placeholder */}
                <div className="aspect-square bg-gray-100 flex items-center justify-center">
                  {product.images && product.images.length > 0 ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <ImageIcon className="h-12 w-12 text-gray-400" />
                  )}
                </div>

                <div className="p-4 space-y-2">
                  <h3 className="font-semibold text-gray-900 truncate">{product.name}</h3>
                  <p className="text-sm text-gray-500">{product.brand}</p>
                  {product.price !== undefined && (
                    <p className="font-bold text-primary">₹{product.price}</p>
                  )}
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${product.in_stock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                      {product.in_stock ? "In Stock" : "Out of Stock"}
                    </span>
                    {product.stock_count !== undefined && (
                      <span className="text-xs text-gray-500">Stock: {product.stock_count}</span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => openEditModal(product)}
                      className="p-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition-colors"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="p-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">
                {editProduct ? "Edit Product" : "Add Product"}
              </h2>
              <button
                onClick={() => {
                  setModalOpen(false);
                  setEditProduct(null);
                }}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price || ""}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Brand
                  </label>
                  <input
                    type="text"
                    name="brand"
                    value={formData.brand || ""}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category || ""}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SKU
                  </label>
                  <input
                    type="text"
                    name="sku"
                    value={formData.sku || ""}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stock Count
                  </label>
                  <input
                    type="number"
                    name="stock_count"
                    value={formData.stock_count || ""}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Descriptions */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Short Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description || ""}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors resize-vertical"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Long Description
                  </label>
                  <textarea
                    name="long_description"
                    value={formData.long_description || ""}
                    onChange={handleChange}
                    rows={5}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors resize-vertical"
                  />
                </div>
              </div>

              {/* Specifications */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Specifications
                </label>
                <div className="space-y-2">
                  {specs.map((spec, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input
                        type="text"
                        value={spec}
                        onChange={(e) => {
                          const newSpecs = [...specs];
                          newSpecs[idx] = e.target.value;
                          setSpecs(newSpecs);
                        }}
                        placeholder="e.g., Weight: 2.5kg"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors"
                      />
                      <button
                        onClick={() => setSpecs(specs.filter((_, i) => i !== idx))}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => setSpecs([...specs, ""])}
                    className="px-4 py-2 text-sm text-primary border border-primary rounded-lg hover:bg-primary/5 transition-colors"
                  >
                    + Add Specification
                  </button>
                </div>
              </div>

              {/* Features */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Features
                </label>
                <div className="space-y-2">
                  {features.map((feature, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) => {
                          const newFeatures = [...features];
                          newFeatures[idx] = e.target.value;
                          setFeatures(newFeatures);
                        }}
                        placeholder="e.g., Waterproof design"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors"
                      />
                      <button
                        onClick={() => setFeatures(features.filter((_, i) => i !== idx))}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => setFeatures([...features, ""])}
                    className="px-4 py-2 text-sm text-primary border border-primary rounded-lg hover:bg-primary/5 transition-colors"
                  >
                    + Add Feature
                  </button>
                </div>
              </div>

              {/* Multiple Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Images
                </label>

                {/* Existing Images (Edit Mode) */}
                {editProduct && formData.images && formData.images.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">Current Images:</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {formData.images.map((image, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={image}
                            alt={`Current ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg border"
                          />
                          <button
                            onClick={() => removeExistingImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* New Images Preview */}
                {imageFiles.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">New Images to Upload:</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {imageFiles.map((file, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`New ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg border"
                          />
                          <button
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* File Input */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-2">
                    Drag and drop images here, or click to select
                  </p>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    className="block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-lg file:border-0
                      file:text-sm file:font-medium
                      file:bg-primary file:text-white
                      hover:file:bg-primary/90
                      file:cursor-pointer cursor-pointer"
                  />
                </div>
              </div>

              {/* Options */}
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="in_stock"
                    checked={formData.in_stock === 1}
                    onChange={handleChange}
                    className="w-4 h-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">In Stock</span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={formData.featured === 1}
                    onChange={handleChange}
                    className="w-4 h-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">Featured Product</span>
                </label>
              </div>
            </div>

            {/* Fixed Footer */}
            <div className="flex items-center justify-end gap-4 p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => {
                  setModalOpen(false);
                  setEditProduct(null);
                }}
                className="px-6 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                {editProduct ? "Update Product" : "Add Product"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Admin;
