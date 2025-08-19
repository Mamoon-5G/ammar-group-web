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
}) => {
  const { addItem, openCart } = useCart();

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

  return (
    <motion.div
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.98 }}
      className="card-product group relative"
    >
      {/* Featured Badge */}
      {featured && (
        <div className="absolute top-3 left-3 z-10">
          <div className="bg-accent text-accent-foreground px-2 py-1 rounded-full text-xs font-semibold flex items-center space-x-1">
            <Award className="h-3 w-3" />
            <span>Featured</span>
          </div>
        </div>
      )}

      {/* Stock Status */}
      {!inStock && (
        <div className="absolute top-3 right-3 z-10">
          <div className="bg-destructive text-destructive-foreground px-2 py-1 rounded-full text-xs font-semibold">
            Out of Stock
          </div>
        </div>
      )}

      <Link to={`/catalog/${id}`} className="block">
        {/* Image Container */}
        <div className="relative overflow-hidden rounded-t-xl bg-muted aspect-square">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
          
          {/* Overlay Actions */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center space-x-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="bg-white/90 hover:bg-white text-foreground p-2 rounded-full shadow-medium"
              >
                <Eye className="h-4 w-4" />
              </motion.button>
              {inStock && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleAddToCart}
                  className="bg-primary hover:bg-primary-hover text-primary-foreground p-2 rounded-full shadow-medium"
                >
                  <ShoppingCart className="h-4 w-4" />
                </motion.button>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          {/* Brand & Category */}
          <div className="flex items-center justify-between text-xs">
            {brand && (
              <span className="text-primary font-medium bg-primary-light px-2 py-1 rounded">
                {brand}
              </span>
            )}
            {category && (
              <span className="text-muted-foreground">
                {category}
              </span>
            )}
          </div>

          {/* Product Name */}
          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
            {name}
          </h3>

          {/* Rating */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 ${
                    i < Math.floor(rating)
                      ? 'text-accent fill-current'
                      : 'text-muted-foreground'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">
              ({rating})
            </span>
          </div>

          {/* Price & Action */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-lg font-bold text-primary">
                {formatPrice(price)}
              </p>
              <p className="text-xs text-muted-foreground">
                + GST & Shipping
              </p>
            </div>
            
            {inStock ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAddToCart}
                className="btn-primary text-sm px-4 py-2"
              >
                Add to Cart
              </motion.button>
            ) : (
              <button
                disabled
                className="bg-muted text-muted-foreground text-sm px-4 py-2 rounded-lg cursor-not-allowed"
              >
                Out of Stock
              </button>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;