import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Eye, Star, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  category?: string;
  brand?: string;
  rating?: number;
  featured?: boolean;
  inStock?: boolean;
  hideCart?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  price,
  image,
  category,
  brand,
  rating = 4.5,
  featured = false,
  inStock = true,
  hideCart = false,
}) => {
  const { addItem, openCart } = useCart();
  const API = import.meta.env.VITE_API_URL;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id,
      name,
      price,
      image,
      category,
      brand,
    });
    openCart();
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(price);
  };

  // Handle image URL - ensure it includes the API base URL if it's a relative path
  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return '/placeholder.svg';
    if (imagePath.startsWith('http')) return imagePath;
    if (imagePath.startsWith('/uploads/') || imagePath.startsWith('/images/')) {
      return `${API}${imagePath}`;
    }
    return imagePath;
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    target.src = '/placeholder.svg';
  };

  return (
    <Link to={`/catalog/${id}`} className="block">
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 group relative"
      >
        {/* Featured Badge - Improved positioning with z-index */}
        {featured && (
          <div className="absolute top-3 left-3 z-20">
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 rounded-full flex items-center gap-1 shadow-lg">
              <Award className="h-3 w-3" />
              <span className="text-xs font-medium">Featured</span>
            </div>
          </div>
        )}

        {/* Stock Status Badge */}
        {!inStock && (
          <div className="absolute top-3 right-3 z-20">
            <div className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
              Out of Stock
            </div>
          </div>
        )}

        {/* Image Container */}
        <div className="relative aspect-square bg-gray-100 overflow-hidden">
          <img
            src={getImageUrl(image)}
            alt={name}
            onError={handleImageError}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
          
          {/* Gradient Overlay on Hover */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
          
          {/* Overlay Actions - Only show if cart is not hidden */}
          {!hideCart && (
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors"
                >
                  <Eye className="h-4 w-4 text-gray-700" />
                </motion.button>
                {inStock && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleAddToCart}
                    className="p-2 bg-primary/90 backdrop-blur-sm text-white rounded-full shadow-lg hover:bg-primary transition-colors"
                  >
                    <ShoppingCart className="h-4 w-4" />
                  </motion.button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          {/* Brand & Category */}
          <div className="flex items-center justify-between">
            {brand && (
              <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
                {brand}
              </span>
            )}
            {category && !brand && (
              <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                {category}
              </span>
            )}
          </div>

          {/* Product Name */}
          <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-primary transition-colors">
            {name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 ${
                    i < Math.floor(rating)
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-gray-600">({rating})</span>
          </div>

          {/* Price & Action */}
          <div className="flex items-center justify-between pt-2">
            <div>
              <p className="text-lg font-bold text-gray-900">
                {formatPrice(price)}
              </p>
              <p className="text-xs text-gray-500">Incl. of taxes</p>
            </div>

            {!hideCart && (
              <div className="flex flex-col items-end gap-1">
                <button
                  onClick={handleAddToCart}
                  disabled={!inStock}
                  className={`px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                    inStock
                      ? 'bg-primary text-white hover:bg-primary/90'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {inStock ? 'Add to Cart' : 'Unavailable'}
                </button>
                <span className={`text-xs ${
                  inStock ? 'text-green-600' : 'text-red-600'
                }`}>
                  {inStock ? "In Stock" : "Out of Stock"}
                </span>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default ProductCard;