import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock, ArrowRight } from 'lucide-react';
import logo from '../assets/logo.png';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const partnerBrands = [
    { name: 'Graco', logo: '/placeholder.svg' },
    { name: 'Mirka', logo: '/placeholder.svg' },
    { name: 'Berger', logo: '/placeholder.svg' },
    { name: 'Asian Paints', logo: '/placeholder.svg' },
  ];

  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'Catalog', path: '/catalog' },
    { name: 'Services', path: '/services' },
    { name: 'About Us', path: '/about' },
  ];

  const services = [
    'Industrial Equipment Supply',
    'Technical Consultation',
    'After-sales Support',
    'Equipment Maintenance',
    'Training Programs',
  ];

  return (
    <footer className="bg-muted/50 border-t border-border">
      {/* Partner Brands */}
      <div className="container-max py-12">
        <div className="text-center mb-8">
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Authorized Partner of Leading Brands
          </h3>
          <p className="text-muted-foreground">
            Trusted by industry leaders worldwide
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center">
          {partnerBrands.map((brand) => (
            <div
              key={brand.name}
              className="card-elevated p-6 hover:scale-105 transition-transform duration-300 bg-background w-full flex items-center justify-center min-h-[80px]"
            >
              <span className="text-lg font-bold text-muted-foreground">
                {brand.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="bg-background border-t border-border">
        <div className="container-max py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="space-y-6">
              <Link to="/" className="block">
                <img src={logo} alt="Ammar Group" className="h-12 w-auto" />
              </Link>
              <p className="text-muted-foreground leading-relaxed">
                Leading provider of industrial equipment and solutions since 1995. 
                We specialize in high-quality tools, paints, and technical services 
                for manufacturing and construction industries.
              </p>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-sm">
                  <Phone className="h-4 w-4 text-primary flex-shrink-0" />
                  <span>+91 90829 78776</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <Mail className="h-4 w-4 text-primary flex-shrink-0" />
                  <span>info@ammargroup.in</span>
                </div>
                <div className="flex items-start space-x-3 text-sm">
                  <MapPin className="h-4 w-4 text-primary flex-shrink-0 mt-1" />
                  <span>10A, Pais Street, Nirmal Compund,Gala No 3, Byculla (w) Mumbai 400011</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <Clock className="h-4 w-4 text-primary flex-shrink-0" />
                  <span>Mon-Sat: 9:00 AM - 6:00 PM</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-6">
              <h4 className="text-lg font-semibold text-foreground">Quick Links</h4>
              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className="text-muted-foreground hover:text-primary transition-colors flex items-center space-x-2 group"
                    >
                      <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <span>{link.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div className="space-y-6">
              <h4 className="text-lg font-semibold text-foreground">Our Services</h4>
              <ul className="space-y-3">
                {services.map((service) => (
                  <li key={service}>
                    <div className="text-muted-foreground flex items-center space-x-2">
                      <ArrowRight className="h-3 w-3 text-primary flex-shrink-0" />
                      <span className="text-sm">{service}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Business Hours & CTA */}
            <div className="space-y-6">
              <h4 className="text-lg font-semibold text-foreground">Get In Touch</h4>
              <div className="card-elevated p-6 gradient-primary text-primary-foreground">
                <h5 className="font-semibold mb-2">Need Expert Advice?</h5>
                <p className="text-sm mb-4 opacity-90">
                  Our technical team is ready to help you find the right solution.
                </p>
                <Link
                  to="/catalog"
                  className="bg-white/20 hover:bg-white/30 text-white font-medium px-4 py-2 rounded-lg transition-colors text-sm block text-center"
                >
                  Browse Products
                </Link>
              </div>
              
              <div className="bg-muted/50 p-4 rounded-lg">
                <h5 className="font-medium text-foreground mb-2">Business Hours</h5>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Monday - Friday</span>
                    <span>9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday</span>
                    <span>9:00 AM - 4:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday</span>
                    <span>Closed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border bg-muted/30">
          <div className="container-max py-6">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="text-sm text-muted-foreground">
                © {currentYear} Ammar Group. All rights reserved. | Designed with precision for industrial excellence.
              </div>
              <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                <Link to="#" className="hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
                <Link to="#" className="hover:text-primary transition-colors">
                  Terms of Service
                </Link>
                <Link to="#" className="hover:text-primary transition-colors">
                  Support
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;