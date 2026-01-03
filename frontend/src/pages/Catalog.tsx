import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, SortAsc, SortDesc, Grid, List, Loader2 } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import AnimatedSection from '../components/AnimatedSection';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  brand: string;
  rating: number;
  featured: boolean;
  inStock: boolean;
  description?: string;
}

const Catalog = () => {
  const API = import.meta.env.VITE_API_URL;
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API}/api/products`);
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();

        console.log("📦 Raw API Response:", data);

        // Transform to match frontend expectations
        const productsFromDB: Product[] = data.map((p: any) => {
          // Use images array first, then fall back to image field, then placeholder
          let imageUrl = '/placeholder.svg';
          
          if (p.images && Array.isArray(p.images) && p.images.length > 0) {
            imageUrl = p.images[0]; // Use first image from array
            console.log(`✅ Using image array for ${p.name}: ${imageUrl}`);
          } else if (p.image) {
            imageUrl = p.image; // Fallback to image field
            console.log(`⚠️ Using single image field for ${p.name}: ${imageUrl}`);
          } else {
            console.log(`❌ No image found for ${p.name}`);
          }

          return {
            id: p.id.toString(),
            name: p.name,
            price: p.price,
            image: imageUrl,
            category: p.category || "General",
            brand: p.brand || "Unknown",
            rating: p.rating || 4.5,
            featured: Boolean(p.featured),
            inStock: Boolean(p.in_stock),
            description: p.description || "",
          };
        });

        console.log("🎨 Transformed products:", productsFromDB);

        setProducts(productsFromDB);
        setFilteredProducts(productsFromDB);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Get unique categories
  const categories = ['All', ...Array.from(new Set(products.map(p => p.category).filter(Boolean)))];

  // Filter + Sort
  useEffect(() => {
    let filtered = products.filter(product => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === 'All' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    // Sorting
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      switch (sortBy) {
        case 'price':
          aValue = a.price;
          bValue = b.price;
          break;
        case 'rating':
          aValue = a.rating;
          bValue = b.rating;
          break;
        case 'name':
        default:
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
      }
      return sortOrder === 'asc' ? (aValue > bValue ? 1 : -1) : (aValue < bValue ? 1 : -1);
    });

    setFilteredProducts(filtered);
  }, [products, searchTerm, selectedCategory, sortBy, sortOrder]);

  const handleSortToggle = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <section className="bg-gradient-to-r from-primary/10 to-accent/10 border-b border-border">
        <div className="container-max section-padding py-12">
          <AnimatedSection animation="fade-up">
            <div className="text-center">
              <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
                Product Catalog
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Discover our comprehensive range of premium industrial equipment,
                tools, and solutions from world-renowned brands.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Filters/Search */}
      <section className="sticky top-[73px] bg-background/95 backdrop-blur-sm border-b border-border z-40">
        <div className="container-max py-4 sm:py-6">
          <AnimatedSection animation="fade-in">
            <div className="flex flex-col gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search products, brands..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-input rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-base"
                />
              </div>

              {/* Filters Row */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                {/* Category Filter */}
                <div className="flex items-center space-x-2 min-w-0">
                  <Filter className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="border border-input rounded-lg px-3 py-2 bg-background focus:ring-2 focus:ring-primary focus:border-transparent text-sm min-w-0"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sort */}
                <div className="flex items-center space-x-2 min-w-0">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="border border-input rounded-lg px-3 py-2 bg-background focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                  >
                    <option value="name">Name</option>
                    <option value="price">Price</option>
                    <option value="rating">Rating</option>
                  </select>
                  <button
                    onClick={handleSortToggle}
                    className="p-2 hover:bg-muted rounded-lg transition-colors"
                  >
                    {sortOrder === 'asc' ? (
                      <SortAsc className="h-4 w-4" />
                    ) : (
                      <SortDesc className="h-4 w-4" />
                    )}
                  </button>
                </div>

                {/* View Toggle */}
                <div className="flex items-center border border-input rounded-lg ml-auto">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 transition-colors ${
                      viewMode === 'grid'
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-muted'
                    }`}
                  >
                    <Grid className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 transition-colors ${
                      viewMode === 'list'
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-muted'
                    }`}
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Results Count */}
              <div className="text-sm text-muted-foreground">
                {loading ? 'Loading...' : `${filteredProducts.length} products found`}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Products Grid/List */}
      <section className="section-padding">
        <div className="container-max">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <Loader2 className="h-12 w-12 text-primary animate-spin mx-auto mb-4" />
                <p className="text-muted-foreground">Loading products...</p>
              </div>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              {filteredProducts.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-20"
                >
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-2xl font-semibold text-foreground mb-2">
                    No products found
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Try adjusting your search or filter criteria
                  </p>
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedCategory('All');
                    }}
                    className="btn-primary"
                  >
                    Clear Filters
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key={viewMode}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className={
                    viewMode === 'grid'
                      ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                      : 'space-y-6'
                  }
                >
                  {filteredProducts.map((product, index) => (
                    <AnimatedSection
                      key={product.id}
                      animation="scale"
                      delay={index * 0.1}
                    >
                      {viewMode === 'grid' ? (
                        <ProductCard {...product} />
                      ) : (
                        <div className="card-elevated p-6 flex items-center space-x-6">
                          <img
                            src={product.image.startsWith('http') ? product.image : `${API}${product.image}`}
                            alt={product.name}
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = '/placeholder.svg';
                            }}
                            className="w-24 h-24 object-cover rounded-lg bg-muted flex-shrink-0"
                            loading="lazy"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="text-lg font-semibold text-foreground mb-1">
                                  {product.name}
                                </h3>
                                <p className="text-sm text-muted-foreground mb-2">
                                  {product.brand} • {product.category}
                                </p>
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                  {product.description}
                                </p>
                              </div>
                              <div className="text-right ml-4 flex-shrink-0">
                                <p className="text-xl font-bold text-primary mb-2">
                                  {formatPrice(product.price)}
                                </p>
                                {product.inStock ? (
                                  <button className="btn-primary text-sm px-4 py-2">
                                    Add to Cart
                                  </button>
                                ) : (
                                  <button disabled className="bg-gray-100 text-gray-400 px-4 py-2 rounded text-sm">
                                    Out of Stock
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </AnimatedSection>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </section>
    </div>
  );
};

export default Catalog;