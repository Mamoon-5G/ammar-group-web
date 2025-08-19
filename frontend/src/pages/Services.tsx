import React from 'react';
import { motion } from 'framer-motion';
import { 
  Wrench, 
  Users, 
  Clock, 
  Shield, 
  Truck, 
  BookOpen,
  Settings,
  Phone,
  CheckCircle,
  ArrowRight
} from 'lucide-react';
import AnimatedSection from '../components/AnimatedSection';
import { Link } from 'react-router-dom';

const Services = () => {
  const services = [
    {
      icon: Wrench,
      title: 'Equipment Installation & Setup',
      description: 'Professional installation and commissioning of industrial equipment with comprehensive testing.',
      features: [
        'On-site installation by certified technicians',
        'Equipment commissioning and testing',
        'Performance validation',
        'Documentation and handover'
      ],
    },
    {
      icon: Users,
      title: 'Technical Consultation',
      description: 'Expert advice on equipment selection, process optimization, and industrial solutions.',
      features: [
        'Equipment selection guidance',
        'Process optimization consulting',
        'Cost-benefit analysis',
        'Custom solution design'
      ],
    },
    {
      icon: Clock,
      title: '24/7 Support & Maintenance',
      description: 'Round-the-clock technical support and preventive maintenance programs.',
      features: [
        '24/7 technical hotline',
        'Preventive maintenance schedules',
        'Emergency repair services',
        'Remote diagnostics support'
      ],
    },
    {
      icon: BookOpen,
      title: 'Training Programs',
      description: 'Comprehensive training programs for operators and maintenance personnel.',
      features: [
        'Equipment operation training',
        'Safety protocols and procedures',
        'Maintenance best practices',
        'Certification programs'
      ],
    },
    {
      icon: Settings,
      title: 'Equipment Calibration',
      description: 'Precision calibration services to ensure optimal performance and accuracy.',
      features: [
        'Precision measurement calibration',
        'Performance verification',
        'Calibration certificates',
        'Compliance documentation'
      ],
    },
    {
      icon: Truck,
      title: 'Logistics & Delivery',
      description: 'Efficient logistics solutions with careful handling and timely delivery.',
      features: [
        'Nationwide delivery network',
        'Special handling for delicate equipment',
        'Installation coordination',
        'Tracking and updates'
      ],
    },
  ];

  const processSteps = [
    {
      step: '01',
      title: 'Consultation',
      description: 'We understand your requirements and assess your specific needs.',
    },
    {
      step: '02',
      title: 'Solution Design',
      description: 'Our experts design the optimal solution tailored to your application.',
    },
    {
      step: '03',
      title: 'Implementation',
      description: 'Professional installation and commissioning with quality assurance.',
    },
    {
      step: '04',
      title: 'Support',
      description: 'Ongoing support, maintenance, and training for optimal performance.',
    },
  ];

  const benefits = [
    'Reduced downtime and increased productivity',
    'Expert technical guidance and support',
    'Compliance with industry standards',
    'Extended equipment life and performance',
    'Cost-effective maintenance solutions',
    'Comprehensive training and documentation',
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="gradient-hero text-primary-foreground">
        <div className="container-max section-padding py-20">
          <AnimatedSection animation="fade-up" className="text-center">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              Comprehensive
              <span className="block text-accent">Industrial Services</span>
            </h1>
            <p className="text-xl text-primary-foreground/90 max-w-3xl mx-auto mb-8">
              Beyond equipment supply, we provide complete technical solutions, 
              expert consultation, and ongoing support to ensure your success.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/catalog" className="btn-accent">
                View Products
              </Link>
              <a href="#services" className="btn-outline border-white/30 text-white hover:bg-white/10">
                Our Services
              </a>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Services Grid */}
      <section id="services" className="section-padding">
        <div className="container-max">
          <AnimatedSection animation="fade-up" className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Our Service Portfolio
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Comprehensive solutions designed to maximize your equipment performance 
              and operational efficiency
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <AnimatedSection
                key={service.title}
                animation="scale"
                delay={index * 0.1}
              >
                <motion.div
                  whileHover={{ y: -5 }}
                  className="card-elevated p-8 h-full"
                >
                  <div className="space-y-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 gradient-primary rounded-full">
                      <service.icon className="h-8 w-8 text-primary-foreground" />
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-semibold text-foreground mb-3">
                        {service.title}
                      </h3>
                      <p className="text-muted-foreground mb-6">
                        {service.description}
                      </p>
                    </div>

                    <ul className="space-y-2">
                      {service.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start space-x-2">
                          <CheckCircle className="h-4 w-4 text-success flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-muted-foreground">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="section-padding bg-muted/30">
        <div className="container-max">
          <AnimatedSection animation="fade-up" className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Our Service Process
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              A systematic approach to ensure successful project delivery and 
              long-term customer satisfaction
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, index) => (
              <AnimatedSection
                key={step.step}
                animation="fade-up"
                delay={index * 0.2}
              >
                <div className="text-center">
                  <div className="relative mb-6">
                    <div className="w-16 h-16 gradient-primary rounded-full flex items-center justify-center text-2xl font-bold text-primary-foreground mx-auto">
                      {step.step}
                    </div>
                    {index < processSteps.length - 1 && (
                      <div className="hidden lg:block absolute top-1/2 left-full w-full h-0.5 bg-gradient-to-r from-primary to-transparent transform -translate-y-1/2" />
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="section-padding">
        <div className="container-max">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <AnimatedSection animation="slide-right">
              <div className="space-y-6">
                <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
                  Why Choose Our Services?
                </h2>
                <p className="text-xl text-muted-foreground">
                  Experience the Ammar Group advantage with our comprehensive 
                  service approach that ensures maximum value and performance.
                </p>
                
                <ul className="space-y-4">
                  {benefits.map((benefit, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center space-x-3"
                    >
                      <CheckCircle className="h-6 w-6 text-success flex-shrink-0" />
                      <span className="text-foreground font-medium">{benefit}</span>
                    </motion.li>
                  ))}
                </ul>

                <div className="pt-6">
                  <Link to="/about" className="btn-primary inline-flex items-center space-x-2">
                    <span>Learn More About Us</span>
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="slide-left">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div className="card-elevated p-6 text-center">
                    <div className="text-3xl font-bold text-primary mb-2">25+</div>
                    <div className="text-sm text-muted-foreground">Years Experience</div>
                  </div>
                  <div className="card-elevated p-6 text-center">
                    <div className="text-3xl font-bold text-primary mb-2">24/7</div>
                    <div className="text-sm text-muted-foreground">Support Available</div>
                  </div>
                </div>
                <div className="space-y-6 mt-8">
                  <div className="card-elevated p-6 text-center">
                    <div className="text-3xl font-bold text-primary mb-2">10K+</div>
                    <div className="text-sm text-muted-foreground">Satisfied Clients</div>
                  </div>
                  <div className="card-elevated p-6 text-center">
                    <div className="text-3xl font-bold text-primary mb-2">99%</div>
                    <div className="text-sm text-muted-foreground">Client Satisfaction</div>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding gradient-hero text-primary-foreground">
        <div className="container-max text-center">
          <AnimatedSection animation="scale">
            <div className="max-w-3xl mx-auto space-y-6">
              <Phone className="h-16 w-16 text-accent mx-auto" />
              <h2 className="text-3xl lg:text-4xl font-bold">
                Ready to Get Started?
              </h2>
              <p className="text-xl text-primary-foreground/90">
                Contact our technical experts today to discuss your requirements 
                and discover the perfect solution for your business.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="tel:+911234567890" className="btn-accent">
                  Call Now: +91 123 456 7890
                </a>
                <Link to="/catalog" className="btn-outline border-white/30 text-white hover:bg-white/10">
                  Browse Products
                </Link>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
};

export default Services;