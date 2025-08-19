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
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Mock products data (replace with API call)
  useEffect(() => {
    const mockProducts: Product[] = [
      {
        id: '1',
        name: 'GRACO 390 PC',
        price: 110000,
        image: '/sprayers/390.webp',
        category: 'Paint Equipment',
        brand: 'Graco',
        rating: 4.8,
        featured: true,
        inStock: true,
        description: 'Professional airless paint sprayer for high-volume applications',
      },
      {
        id: '2',
        name: 'Graco Spray Machine 490',
        price: 190000,
        image: '/sprayers/490.webp',
        category: 'Paint Equipment',
        brand: 'Graco',
        rating: 4.7,
        featured: true,
        inStock: true,
        description: 'Premium electric random orbital sander with dust extraction',
      },
      {
        id: '3',
        name: 'FinishPro GX 19 Electric Airless Sprayer',
        price: 85000,
        image: '/sprayers/finishpro.webp',
        category: 'Paint Equipment',
        brand: 'Graco',
        rating: 4.7,
        featured: true,
        inStock: true,
        description: 'High-performance industrial primer for metal surfaces',
      },
      {
        id: '4',
        name: 'Graco Ultra Max 2 490 PC Pro Stand Airless Unit',
        price: 165000,
        image: '/sprayers/490-ultra-max-2.webp',
        category: 'Paint Equipment',
        brand: 'Graco',
        rating: 4.5,
        featured: false,
        inStock: true,
        description: 'High volume low pressure spray gun for precision coating',
      },
      {
        id: '5',
        name: 'Mirka Pros 625',
        price: 30000,
        image: '/mirka/pros625.webp',
        category: 'Sanding Tools',
        brand: 'Mirka',
        rating: 4.9,
        featured: false,
        inStock: true,
        description: 'Revolutionary mesh abrasive discs for superior dust extraction',
      },
      {
        id: '6',
        name: 'Asian Paints Enamel Paint',
        price: 3200,
        image: '/placeholder.svg',
        category: 'Paints & Coatings',
        brand: 'Asian Paints',
        rating: 4.4,
        featured: false,
        inStock: false,
        description: 'Premium quality enamel paint for industrial applications',
      },
      {
        id: '7',
        name: 'Graco Ultra 395 Airless Paint Sprayer',
        price: 150000,
        image: '/sprayers/395-ultra.webp',
        category: 'Paint Equipment',
        brand: 'Wagner',
        rating: 4.3,
        featured: false,
        inStock: true,
        description: 'Professional paint roller system for efficient coverage',
      },
      {
        id: '8',
        name: 'Backing Pad MF 150 mm',
        price: 7400,
        image: '/mirka/backingpad.webp',
        category: 'Sanding Tools',
        brand: 'Mirka',
        rating: 4.8,
        featured: false,
        inStock: true,
        description: 'Precision orbital sander with excellent dust extraction',
      },
    ];

    setTimeout(() => {
      setProducts(mockProducts);
      setFilteredProducts(mockProducts);
      setLoading(false);
    }, 1000);
  }, []);

  // Get unique categories
  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

  // Filter and sort products
  useEffect(() => {
    let filtered = products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    // Sort products
    filtered.sort((a, b) => {
      let aValue, bValue;

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

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredProducts(filtered);
  }, [products, searchTerm, selectedCategory, sortBy, sortOrder]);

  const handleSortToggle = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
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

      {/* Filters and Search */}
      <section className="sticky top-[73px] bg-background/95 backdrop-blur-sm border-b border-border z-40">
        <div className="container-max py-6">
          <AnimatedSection animation="fade-in">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search products, brands..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-input rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
              </div>

              <div className="flex items-center gap-4">
                {/* Category Filter */}
                <div className="flex items-center space-x-2">
                  <Filter className="h-5 w-5 text-muted-foreground" />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="border border-input rounded-lg px-3 py-2 bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sort */}
                <div className="flex items-center space-x-2">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="border border-input rounded-lg px-3 py-2 bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="name">Name</option>
                    <option value="price">Price</option>
                    <option value="rating">Rating</option>
                  </select>
                  <button
                    onClick={handleSortToggle}
                    className="p-2 hover:bg-muted rounded-lg transition-colors"
                  >
                    {sortOrder === 'asc' ?
                      <SortAsc className="h-5 w-5" /> :
                      <SortDesc className="h-5 w-5" />
                    }
                  </button>
                </div>

                {/* View Toggle */}
                <div className="flex items-center border border-input rounded-lg">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 transition-colors ${viewMode === 'grid'
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-muted'
                      }`}
                  >
                    <Grid className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 transition-colors ${viewMode === 'list'
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-muted'
                      }`}
                  >
                    <List className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Results Count */}
            <div className="mt-4 text-sm text-muted-foreground">
              {loading ? 'Loading...' : `${filteredProducts.length} products found`}
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
                            src={product.image}
                            alt={product.name}
                            className="w-24 h-24 object-cover rounded-lg bg-muted flex-shrink-0"
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
                                <p className="text-sm text-muted-foreground">
                                  {product.description}
                                </p>
                              </div>
                              <div className="text-right ml-4">
                                <p className="text-xl font-bold text-primary mb-2">
                                  ₹{product.price.toLocaleString()}
                                </p>
                                <button className="btn-primary text-sm px-4 py-2">
                                  View Details
                                </button>
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