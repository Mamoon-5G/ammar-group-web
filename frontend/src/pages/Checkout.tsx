import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ShoppingBag, 
  CreditCard, 
  Truck, 
  Shield,
  MapPin,
  Phone,
  Mail,
  User,
  ArrowLeft,
  Plus,
  Minus,
  Trash2
} from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import AnimatedSection from '../components/AnimatedSection';
import { useToast } from '../hooks/use-toast';

interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company?: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  gst?: string;
}

const Checkout = () => {
  const { state, updateQuantity, removeItem, getTotalPrice, clearCart } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    gst: '',
  });

  const [isProcessing, setIsProcessing] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const required = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'state', 'pincode'];
    return required.every(field => customerInfo[field as keyof CustomerInfo]?.trim());
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (state.items.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Please add items to your cart before checkout.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    // Simulate order processing
    setTimeout(() => {
      toast({
        title: "Order Placed Successfully!",
        description: "We'll contact you shortly to confirm your order.",
      });
      
      clearCart();
      navigate('/');
      setIsProcessing(false);
    }, 2000);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(price);
  };

  const subtotal = getTotalPrice();
  const gstAmount = subtotal * 0.18; // 18% GST
  const shippingCost = subtotal > 50000 ? 0 : 1500; // Free shipping above ₹50,000
  const total = subtotal + gstAmount + shippingCost;

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-4">Your cart is empty</h2>
          <p className="text-muted-foreground mb-8">Add some products to proceed with checkout</p>
          <Link to="/catalog" className="btn-primary">
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-muted/30">
        <div className="container-max py-6">
          <AnimatedSection animation="fade-in">
            <div className="flex items-center justify-between">
              <div>
                <Link 
                  to="/catalog" 
                  className="inline-flex items-center space-x-2 text-primary hover:text-primary-hover mb-4"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Continue Shopping</span>
                </Link>
                <h1 className="text-3xl font-bold text-foreground">Checkout</h1>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Order Total</p>
                <p className="text-2xl font-bold text-primary">{formatPrice(total)}</p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>

      <div className="container-max section-padding">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Customer Information Form */}
          <div className="lg:col-span-2">
            <AnimatedSection animation="slide-right">
              <form onSubmit={handleSubmitOrder} className="space-y-8">
                {/* Personal Information */}
                <div className="card-elevated p-8">
                  <div className="flex items-center space-x-3 mb-6">
                    <User className="h-6 w-6 text-primary" />
                    <h2 className="text-xl font-semibold text-foreground">Personal Information</h2>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        First Name *
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={customerInfo.firstName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-input rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={customerInfo.lastName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-input rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={customerInfo.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-input rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={customerInfo.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-input rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
                        required
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Company Name (Optional)
                      </label>
                      <input
                        type="text"
                        name="company"
                        value={customerInfo.company}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-input rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-foreground mb-2">
                        GST Number (Optional)
                      </label>
                      <input
                        type="text"
                        name="gst"
                        value={customerInfo.gst}
                        onChange={handleInputChange}
                        placeholder="22AAAAA0000A1Z5"
                        className="w-full px-4 py-3 border border-input rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="card-elevated p-8">
                  <div className="flex items-center space-x-3 mb-6">
                    <MapPin className="h-6 w-6 text-primary" />
                    <h2 className="text-xl font-semibold text-foreground">Shipping Address</h2>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Address *
                      </label>
                      <textarea
                        name="address"
                        value={customerInfo.address}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-4 py-3 border border-input rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
                        required
                      />
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          City *
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={customerInfo.city}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-input rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          State *
                        </label>
                        <select
                          name="state"
                          value={customerInfo.state}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-input rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
                          required
                        >
                          <option value="">Select State</option>
                          <option value="Delhi">Delhi</option>
                          <option value="Haryana">Haryana</option>
                          <option value="Punjab">Punjab</option>
                          <option value="Uttar Pradesh">Uttar Pradesh</option>
                          <option value="Rajasthan">Rajasthan</option>
                          <option value="Maharashtra">Maharashtra</option>
                          <option value="Gujarat">Gujarat</option>
                          {/* Add more states as needed */}
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Pincode *
                        </label>
                        <input
                          type="text"
                          name="pincode"
                          value={customerInfo.pincode}
                          onChange={handleInputChange}
                          pattern="[0-9]{6}"
                          className="w-full px-4 py-3 border border-input rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={isProcessing}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full btn-primary py-4 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary-foreground border-t-transparent" />
                      <span>Processing Order...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2">
                      <CreditCard className="h-6 w-6" />
                      <span>Place Order</span>
                    </div>
                  )}
                </motion.button>
              </form>
            </AnimatedSection>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <AnimatedSection animation="slide-left">
              <div className="sticky top-24 space-y-6">
                {/* Cart Items */}
                <div className="card-elevated p-6">
                  <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center space-x-2">
                    <ShoppingBag className="h-5 w-5" />
                    <span>Order Summary</span>
                  </h2>
                  
                  <div className="space-y-4 max-h-64 overflow-y-auto">
                    {state.items.map((item) => (
                      <div key={item.id} className="flex items-center space-x-3 pb-4 border-b border-border last:border-b-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded-lg bg-muted flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm text-foreground truncate">
                            {item.name}
                          </h4>
                          <p className="text-xs text-muted-foreground">{item.brand}</p>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-sm font-semibold text-primary">
                              {formatPrice(item.price)}
                            </span>
                            <div className="flex items-center space-x-1">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="p-1 hover:bg-muted rounded transition-colors"
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="text-sm font-medium w-6 text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="p-1 hover:bg-muted rounded transition-colors"
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="card-elevated p-6 space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">{formatPrice(subtotal)}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">GST (18%)</span>
                    <span className="font-medium">{formatPrice(gstAmount)}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="font-medium">
                      {shippingCost === 0 ? 'Free' : formatPrice(shippingCost)}
                    </span>
                  </div>
                  
                  <div className="border-t border-border pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-foreground">Total</span>
                      <span className="text-xl font-bold text-primary">{formatPrice(total)}</span>
                    </div>
                  </div>
                </div>

                {/* Trust Indicators */}
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="space-y-2">
                    <Shield className="h-6 w-6 text-success mx-auto" />
                    <p className="text-xs text-muted-foreground">Secure Payment</p>
                  </div>
                  <div className="space-y-2">
                    <Truck className="h-6 w-6 text-success mx-auto" />
                    <p className="text-xs text-muted-foreground">Fast Delivery</p>
                  </div>
                  <div className="space-y-2">
                    <Phone className="h-6 w-6 text-success mx-auto" />
                    <p className="text-xs text-muted-foreground">24/7 Support</p>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;