import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, ShoppingBag, Trash2 } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { Link } from 'react-router-dom';

const CartSidebar: React.FC = () => {
  const {
    state,
    closeCart,
    removeItem,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getTotalItems
  } = useCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(price);
  };

  const API = import.meta.env.VITE_API_URL;

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
    <AnimatePresence>
      {state.isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/50 z-50"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-background shadow-strong z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div className="flex items-center space-x-2">
                <ShoppingBag className="h-6 w-6 text-primary" />
                <h2 className="text-xl font-semibold">
                  Cart ({getTotalItems()})
                </h2>
              </div>
              <button
                onClick={closeCart}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {state.items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingBag className="h-16 w-16 text-muted-foreground/50 mb-4" />
                  <h3 className="text-lg font-medium text-muted-foreground mb-2">
                    Your cart is empty
                  </h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    Add some products to get started
                  </p>
                  <Link
                    to="/catalog"
                    onClick={closeCart}
                    className="btn-primary"
                  >
                    Browse Products
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Clear Cart Button */}
                  {state.items.length > 0 && (
                    <button
                      onClick={clearCart}
                      className="w-full text-sm text-destructive hover:text-destructive/80 font-medium mb-6 flex items-center justify-center space-x-2"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>Clear Cart</span>
                    </button>
                  )}

                  {state.items.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="card-elevated p-4"
                    >
                      <div className="flex space-x-4">
                        <img
                          src={getImageUrl(item.image)}
                          alt={item.name}
                          onError={handleImageError}
                          className="w-16 h-16 object-cover rounded-lg bg-muted"
                          loading="lazy"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm truncate">
                            {item.name}
                          </h4>
                          {item.brand && (
                            <p className="text-xs text-muted-foreground">
                              {item.brand}
                            </p>
                          )}
                          <p className="text-sm font-semibold text-primary mt-1">
                            {formatPrice(item.price)}
                          </p>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-1 hover:bg-destructive/10 hover:text-destructive rounded transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 hover:bg-muted rounded transition-colors"
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="w-8 text-center font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 hover:bg-muted rounded transition-colors"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                        <p className="font-semibold text-foreground">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {state.items.length > 0 && (
              <div className="border-t border-border p-6 space-y-4">
                {/* Total */}
                <div className="flex items-center justify-between text-lg font-semibold">
                  <span>Total:</span>
                  <span className="text-primary">{formatPrice(getTotalPrice())}</span>
                </div>

                {/* Checkout Button */}
                <Link
                  to="/checkout"
                  onClick={closeCart}
                  className="w-full btn-primary text-center block"
                >
                  Proceed to Checkout
                </Link>

                {/* Continue Shopping */}
                <Link
                  to="/catalog"
                  onClick={closeCart}
                  className="w-full btn-outline text-center block"
                >
                  Continue Shopping
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartSidebar;