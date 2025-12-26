import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Star,
  ShoppingCart,
  CreditCard,
  Shield,
  Truck,
  Award,
  Check,
  Plus,
  Minus,
  Heart
} from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import AnimatedSection from '../components/AnimatedSection';
import { useToast } from '../hooks/use-toast';

interface ProductDetail {
  id: string;
  name: string;
  price: number;
  images: string[];
  category: string;
  brand: string;
  rating: number;
  description: string;
  longDescription?: string;
  specifications?: Record<string, string>;
  features?: string[];
  inStock: boolean;
  stockCount: number;
  sku: string;
}

const ProductDetail = () => {
  const API = import.meta.env.VITE_API_URL;
  const { id } = useParams<{ id: string }>();
  const { addItem, openCart } = useCart();
  const { toast } = useToast();
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  // ✅ Fetch product from backend
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${API}/api/products/${id}`);
        if (!res.ok) throw new Error("Failed to fetch product");
        const data = await res.json();

        setProduct({
          ...data,
          id: data.id?.toString() || '0',
          name: data.name || 'Unknown Product',
          price: Number(data.price) || 0,
          images: data.images && data.images.length > 0
            ? data.images
            : ["/uploads/placeholder.svg"],
          category: data.category || 'General',
          brand: data.brand || 'Unknown',
          rating: Number(data.rating) || 4.5,
          description: data.description || 'No description available',
          features: Array.isArray(data.features) ? data.features : [],
          specifications: data.specifications && typeof data.specifications === "object"
            ? data.specifications
            : {},
          longDescription: data.long_description || data.longDescription || "",
          inStock: Boolean(data.in_stock),
          stockCount: Number(data.stock_count) || 0,
          sku: data.sku || 'N/A',
        });
      } catch (err) {
        console.error(err);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id, API]);

  const handleAddToCart = () => {
    if (!product) return;

    try {
      const validQuantity = Math.max(1, Number(quantity) || 1);

      for (let i = 0; i < validQuantity; i++) {
        addItem({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.images[0] || '/placeholder.svg',
          category: product.category,
          brand: product.brand,
        });
      }

      toast({
        title: "Added to Cart",
        description: `${validQuantity} x ${product.name} added to your cart.`,
      });

      openCart();
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleBuyNow = () => {
    handleAddToCart();
    // 👉 navigate("/checkout") if you want auto-redirect
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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">Product Not Found</h2>
          <Link to="/catalog" className="btn-primary">
            Back to Catalog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="container-max py-6">
        <AnimatedSection animation="fade-in">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
            <Link to="/" className="hover:text-primary">Home</Link>
            <span>/</span>
            <Link to="/catalog" className="hover:text-primary">Catalog</Link>
            <span>/</span>
            <span className="text-foreground">{product.name}</span>
          </div>
          <Link
            to="/catalog"
            className="inline-flex items-center space-x-2 text-primary hover:text-primary-hover mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Catalog</span>
          </Link>
        </AnimatedSection>
      </div>

      {/* Product Details */}
      <div className="container-max pb-16">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Images */}
          <AnimatedSection animation="slide-right">
            <div className="space-y-4">
              {/* Main Image */}
              <div className="aspect-square rounded-xl overflow-hidden bg-muted">
                <img
                  src={getImageUrl(product.images[selectedImage])}
                  alt={product.name}
                  onError={handleImageError}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>

              {/* Thumbnail Gallery */}
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square rounded-lg overflow-hidden bg-muted border-2 transition-colors ${selectedImage === index
                      ? 'border-primary'
                      : 'border-transparent hover:border-muted-foreground'
                      }`}
                  >
                    <img
                      src={getImageUrl(image)}
                      alt={`${product.name} ${index + 1}`}
                      onError={handleImageError}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </button>
                ))}
              </div>
            </div>
          </AnimatedSection>

          {/* Product Info */}
          <AnimatedSection animation="slide-left">
            <div className="space-y-6">
              {/* Brand & Category */}
              <div className="flex items-center space-x-4">
                {product.brand && (
                  <span className="bg-primary-light text-primary px-3 py-1 rounded-full text-sm font-medium">
                    {product.brand}
                  </span>
                )}
                {product.category && (
                  <span className="text-muted-foreground text-sm">
                    {product.category}
                  </span>
                )}
              </div>

              {/* Title & Rating */}
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                  {product.name}
                </h1>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${i < Math.floor(product.rating || 0)
                          ? 'text-accent fill-current'
                          : 'text-muted-foreground'
                          }`}
                      />
                    ))}
                  </div>
                  <span className="text-muted-foreground">
                    ({product.rating || 0}) • SKU: {product.sku || 'N/A'}
                  </span>
                </div>
              </div>

              {/* Price */}
              <div className="space-y-2">
                <div className="text-3xl font-bold text-primary">
                  {formatPrice(product.price)}
                </div>
                <p className="text-sm text-muted-foreground">
                  + GST & Shipping • {product.stockCount || 0} in stock
                </p>
              </div>

              {/* Description */}
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>

              {/* Quantity & Actions */}
              <div className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <label className="font-medium">Quantity:</label>
                    <div className="flex items-center border border-input rounded-lg">
                      <button
                        onClick={() => setQuantity(Math.max(1, Number(quantity) - 1))}
                        className="p-2 hover:bg-muted transition-colors"
                        disabled={quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="px-4 py-2 font-medium">{quantity}</span>
                      <button
                        onClick={() => {
                          const maxQuantity = product?.stockCount || 999;
                          const currentQuantity = Number(quantity) || 1;
                          setQuantity(Math.min(maxQuantity, currentQuantity + 1));
                        }}
                        className="p-2 hover:bg-muted transition-colors"
                        disabled={quantity >= (product?.stockCount || 999)}
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleAddToCart}
                    className="flex-1 btn-primary flex items-center justify-center space-x-2"
                  >
                    <ShoppingCart className="h-5 w-5" />
                    <span>Add to Cart</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleBuyNow}
                    className="flex-1 btn-accent flex items-center justify-center space-x-2"
                  >
                    <CreditCard className="h-5 w-5" />
                    <span>Buy Now</span>
                  </motion.button>

                  <button
                    onClick={() => setIsWishlisted(!isWishlisted)}
                    className={`p-3 border border-input rounded-lg transition-colors ${isWishlisted
                      ? 'bg-destructive text-destructive-foreground'
                      : 'hover:bg-muted'
                      }`}
                  >
                    <Heart
                      className={`h-5 w-5 ${isWishlisted ? 'fill-current' : ''}`}
                    />
                  </button>
                </div>
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border">
                <div className="text-center">
                  <Shield className="h-8 w-8 text-primary mx-auto mb-2" />
                  <p className="text-sm font-medium">Genuine Product</p>
                  <p className="text-xs text-muted-foreground">Authorized Dealer</p>
                </div>
                <div className="text-center">
                  <Truck className="h-8 w-8 text-primary mx-auto mb-2" />
                  <p className="text-sm font-medium">Fast Delivery</p>
                  <p className="text-xs text-muted-foreground">Pan India Shipping</p>
                </div>
                <div className="text-center">
                  <Award className="h-8 w-8 text-primary mx-auto mb-2" />
                  <p className="text-sm font-medium">Warranty</p>
                  <p className="text-xs text-muted-foreground">2 Years</p>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>

        {/* Detailed Information */}
        <div className="mt-16 grid lg:grid-cols-2 gap-12">
          {/* Description */}
          <AnimatedSection animation="fade-up">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-foreground">Description</h2>
              <div className="prose prose-gray max-w-none">
                {product.longDescription && product.longDescription.trim()
                  ? product.longDescription.split('\n\n').map((p, i) => (
                    <p key={i} className="text-muted-foreground leading-relaxed mb-4">
                      {p}
                    </p>
                  ))
                  : <p className="text-muted-foreground">No additional details available.</p>}
              </div>
            </div>
          </AnimatedSection>

          {/* Specifications */}
          <AnimatedSection animation="fade-up" delay={0.2}>
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-foreground">Specifications</h2>
              <div className="card-elevated">
                <div className="divide-y divide-border">
                  {product.specifications && Object.keys(product.specifications).length > 0 ? (
                    Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="px-6 py-4 flex justify-between">
                        <span className="font-medium text-foreground">{key}</span>
                        <span className="text-muted-foreground">{value}</span>
                      </div>
                    ))
                  ) : (
                    <div className="px-6 py-4 text-center text-muted-foreground">
                      No specifications available
                    </div>
                  )}
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>

        {/* Features */}
        <AnimatedSection animation="fade-up" delay={0.4} className="mt-12">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground">Key Features</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {product.features && product.features.length > 0 ? (
                product.features.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-3 p-4 card-elevated">
                    <Check className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{feature}</span>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center text-muted-foreground p-8">
                  No key features listed.
                </div>
              )}
            </div>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
};

export default ProductDetail;
