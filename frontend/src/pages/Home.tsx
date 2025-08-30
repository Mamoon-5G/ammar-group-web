import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Award, Users, Wrench, Truck, Clock, Star } from 'lucide-react';
import AnimatedSection from '../components/AnimatedSection';
import ProductCard from '../components/ProductCard';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        const res = await fetch("http://localhost:5000/api/products");
        if (!res.ok) throw new Error("Failed to fetch products");

        const data = await res.json();

        // Transform data to match ProductCard props - FIX: properly map all fields
        const transformedProducts = data.map((p: any) => ({
          id: p.id.toString(),
          name: p.name,
          price: p.price,
          image: p.image || "/uploads/placeholder.svg",
          category: p.category || "General",
          brand: p.brand || "Unknown",
          rating: p.rating || 4.5,
          featured: Boolean(p.featured),
          inStock: Boolean(p.in_stock), // FIX: Map in_stock correctly
          description: p.description || "",
        }));

        // Filter featured products first, then fallback to first 3
        const featured = transformedProducts.filter((p: any) => p.featured);
        setFeaturedProducts(featured.length > 0 ? featured.slice(0, 3) : transformedProducts.slice(0, 3));
        
      } catch (err) {
        console.error("Error fetching featured products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  const trustIndicators = [
    {
      icon: Shield,
      title: 'Trusted Since 1995',
      description: 'Over 25 years of excellence in industrial equipment supply and technical solutions.',
    },
    {
      icon: Award,
      title: 'Certified Partners',
      description: 'Authorized dealers of premium brands like Graco, Mirka, and Berger Paints.',
    },
    {
      icon: Users,
      title: '10,000+ Satisfied Clients',
      description: 'Serving manufacturing, construction, and automotive industries nationwide.',
    },
  ];

  const services = [
    {
      icon: Wrench,
      title: 'Expert Consultation',
      description: 'Technical guidance from our experienced team to find the perfect solution.',
    },
    {
      icon: Truck,
      title: 'Fast Delivery',
      description: 'Quick and reliable delivery across India with proper packaging.',
    },
    {
      icon: Clock,
      title: '24/7 Support',
      description: 'Round-the-clock customer support for all your technical queries.',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden gradient-hero text-primary-foreground">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative container-max section-padding py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <AnimatedSection animation="slide-right">
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8 }}
                  className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium"
                >
                  <Star className="h-4 w-4 text-accent" />
                  <span>Trusted by 10,000+ Clients Since 1995</span>
                </motion.div>
                
                <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                  Industrial Excellence
                  <span className="block text-accent">Delivered</span>
                </h1>
                
                <p className="text-xl text-primary-foreground/90 leading-relaxed max-w-lg">
                  Premium industrial equipment, paints, and technical solutions from 
                  world-class brands. Empowering your projects with precision and reliability.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link to="/catalog" className="btn-accent inline-flex items-center space-x-2">
                    <span>Browse Products</span>
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                  <Link to="/services" className="btn-outline border-white/30 text-white hover:bg-white/10">
                    Our Services
                  </Link>
                </div>
              </div>
            </AnimatedSection>
            
            <AnimatedSection animation="slide-left" delay={0.3}>
              <div className="relative">
                <motion.div
                  animate={{ float: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20"
                >
                  <div className="space-y-6">
                    <div className="text-center">
                      <h3 className="text-2xl font-bold text-white mb-2">
                        Industry Leadership
                      </h3>
                      <p className="text-white/80">
                        Your trusted partner in industrial solutions
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-3xl font-bold text-accent">25+</div>
                        <div className="text-sm text-white/80">Years</div>
                      </div>
                      <div>
                        <div className="text-3xl font-bold text-accent">10K+</div>
                        <div className="text-sm text-white/80">Clients</div>
                      </div>
                      <div>
                        <div className="text-3xl font-bold text-accent">50+</div>
                        <div className="text-sm text-white/80">Brands</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="section-padding bg-muted/30">
        <div className="container-max">
          <AnimatedSection animation="fade-up" className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Why Choose Ammar Group?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Built on trust, driven by excellence, and committed to your success
            </p>
          </AnimatedSection>
          
          <div className="grid md:grid-cols-3 gap-8">
            {trustIndicators.map((item, index) => (
              <AnimatedSection
                key={item.title}
                animation="fade-up"
                delay={index * 0.2}
                className="text-center"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="card-elevated p-8 h-full"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
                    <item.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section-padding">
        <div className="container-max">
          <AnimatedSection animation="fade-up" className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Featured Products
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Discover our top-selling industrial equipment and solutions
            </p>
          </AnimatedSection>
          
          {loading ? (
            <div className="grid md:grid-cols-3 gap-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="card-elevated animate-pulse">
                  <div className="aspect-square bg-muted rounded-t-xl" />
                  <div className="p-6 space-y-4">
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-4 bg-muted rounded w-1/2" />
                    <div className="h-6 bg-muted rounded w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {featuredProducts.map((product, index) => (
                <AnimatedSection
                  key={product.id}
                  animation="scale"
                  delay={index * 0.2}
                >
                  <ProductCard {...product} />
                </AnimatedSection>
              ))}
            </div>
          )}
          
          <AnimatedSection animation="fade-up" delay={0.8} className="text-center mt-12">
            <Link to="/catalog" className="btn-primary inline-flex items-center space-x-2">
              <span>View All Products</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* Services Overview */}
      <section className="section-padding bg-gradient-to-r from-primary/5 to-accent/5">
        <div className="container-max">
          <AnimatedSection animation="fade-up" className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Comprehensive Support
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Beyond products, we provide complete solutions for your success
            </p>
          </AnimatedSection>
          
          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <AnimatedSection
                key={service.title}
                animation="fade-up"
                delay={index * 0.2}
              >
                <motion.div
                  whileHover={{ y: -5 }}
                  className="bg-background border border-border rounded-xl p-8 text-center shadow-soft hover:shadow-medium transition-all duration-300"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 gradient-primary rounded-full mb-6">
                    <service.icon className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {service.description}
                  </p>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
          
          <AnimatedSection animation="fade-up" delay={0.8} className="text-center mt-12">
            <Link to="/services" className="btn-outline">
              Learn More About Our Services
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding gradient-hero text-primary-foreground">
        <div className="container-max text-center">
          <AnimatedSection animation="scale">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied customers who trust Ammar Group for their 
              industrial equipment needs. Get expert advice and premium products today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/catalog" className="btn-accent">
                Shop Now
              </Link>
              <Link to="/about" className="btn-outline border-white/30 text-white hover:bg-white/10">
                Learn About Us
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
};

export default Home;