import React from 'react';
import { motion } from 'framer-motion';
import {
  Award,
  Users,
  Globe,
  Target,
  Heart,
  Shield,
  TrendingUp,
  CheckCircle,
  Star
} from 'lucide-react';
import AnimatedSection from '../components/AnimatedSection';
import { Link } from 'react-router-dom';

const About = () => {
  const milestones = [
    {
      year: '1976',
      title: 'The Beginning',
      description: 'Ammar Group was born with a vision to revolutionize manufacturing solutions in India.',
    },
    {
      year: '1995',
      title: 'Paint Distribution',
      description: 'Ventured into premium paint distribution, bringing world-class coating solutions to Indian industries.',
    },
    {
      year: '2005',
      title: 'Construction Chemicals',
      description: 'Expanded horizons from paints to comprehensive construction chemical solutions, building stronger foundations.',
    },
    {
      year: '2007',
      title: 'Graco Partnership',
      description: 'Became authorized distributor for Graco, introducing cutting-edge fluid handling technology to our portfolio.',
    },
    {
      year: '2012-13',
      title: 'Adhesives Division',
      description: 'Forged strategic partnership with Atul for industrial adhesives, bonding success with innovation.',
    },
    {
      year: '2015',
      title: 'Digital Revolution',
      description: 'Embraced digitalization to enhance customer experience and streamline operations nationwide.',
    },
    {
      year: '2023',
      title: 'Mirka Fine Finish',
      description: 'Added Mirka fine finish tools to our arsenal, perfecting the art of precision finishing solutions.',
    },
  ];
  const values = [
    {
      icon: Shield,
      title: 'Quality Assurance',
      description: 'We only partner with the best brands and maintain the highest quality standards in every product and service we deliver.',
    },
    {
      icon: Heart,
      title: 'Customer First',
      description: 'Our customers\' success is our success. We go above and beyond to ensure complete satisfaction and long-term partnerships.',
    },
    {
      icon: TrendingUp,
      title: 'Continuous Innovation',
      description: 'We constantly evolve with technology and market trends to bring the latest solutions to our customers.',
    },
    {
      icon: Users,
      title: 'Expert Team',
      description: 'Our team of technical experts and industry professionals provides unmatched consultation and support.',
    },
  ];

  const stats = [
    {
      icon: Award,
      number: '25+',
      label: 'Years of Excellence',
      description: 'Quarter century of industry leadership',
    },
    {
      icon: Users,
      number: '10,000+',
      label: 'Satisfied Customers',
      description: 'Trusted by businesses nationwide',
    },
    {
      icon: Globe,
      number: '50+',
      label: 'Premium Brands',
      description: 'Authorized partnerships worldwide',
    },
    {
      icon: Target,
      number: '99%',
      label: 'Customer Satisfaction',
      description: 'Consistently exceeding expectations',
    },
  ];

  const partnerBrands = [
    {
      name: 'Graco',
      description: 'World leader in fluid handling equipment',
      partnership: 'Authorized Dealer since 2000',
    },
    {
      name: 'Mirka',
      description: 'Premium abrasives and sanding solutions',
      partnership: 'Certified Partner since 2008',
    },
    {
      name: 'Berger Paints',
      description: 'Leading paint and coating manufacturer',
      partnership: 'Exclusive Distributor since 2010',
    },
    {
      name: 'Atul Limited',
      description: 'Atul is an improvement driven, integrated chemical company serving about 4,000 customers belonging to 30 industries across the world. ',
      partnership: 'Strategic Partner since 2012',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="gradient-hero text-primary-foreground">
        <div className="container-max section-padding py-20">
          <AnimatedSection animation="fade-up" className="text-center">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              About
              <span className="block text-accent">Ammar Group</span>
            </h1>
            <p className="text-xl text-primary-foreground/90 max-w-3xl mx-auto mb-8">
              Building industrial excellence since 1995. We are your trusted partner
              in providing world-class equipment, solutions, and support for manufacturing,
              construction, and industrial applications.
            </p>
            <div className="flex items-center justify-center space-x-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-accent">50+</div>
                <div className="text-sm opacity-90">Years</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent">10K+</div>
                <div className="text-sm opacity-90">Clients</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent">50+</div>
                <div className="text-sm opacity-90">Brands</div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section-padding">
        <div className="container-max">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <AnimatedSection animation="slide-right">
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                    Our Mission
                  </h2>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    To empower industries with premium equipment, innovative solutions,
                    and expert support that drive efficiency, quality, and growth. We are
                    committed to being the most trusted partner for industrial success
                    across India.
                  </p>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-4">
                    Our Vision
                  </h3>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    To be India's leading provider of industrial solutions, known for
                    excellence, innovation, and customer success. We envision a future
                    where every business has access to world-class equipment and support.
                  </p>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="slide-left">
              <div className="grid grid-cols-2 gap-6">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    whileHover={{ scale: 1.05 }}
                    className="card-elevated p-6 text-center"
                  >
                    <div className="inline-flex items-center justify-center w-12 h-12 gradient-primary rounded-full mb-4">
                      <stat.icon className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <div className="text-2xl font-bold text-primary mb-2">
                      {stat.number}
                    </div>
                    <div className="font-medium text-foreground mb-1">
                      {stat.label}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {stat.description}
                    </div>
                  </motion.div>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section-padding bg-muted/30">
        <div className="container-max">
          <AnimatedSection animation="fade-up" className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Our Journey
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              From humble beginnings to industry leadership - explore the milestones
              that shaped Ammar Group's success story
            </p>
          </AnimatedSection>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gradient-to-b from-primary to-accent" />

            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <AnimatedSection
                  key={milestone.year}
                  animation="fade-up"
                  delay={index * 0.2}
                >
                  <div className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                    <div className={`flex-1 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8'}`}>
                      <div className="card-elevated p-6 max-w-md mx-auto">
                        <div className="text-2xl font-bold text-primary mb-2">
                          {milestone.year}
                        </div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">
                          {milestone.title}
                        </h3>
                        <p className="text-muted-foreground">
                          {milestone.description}
                        </p>
                      </div>
                    </div>

                    {/* Timeline Dot */}
                    <div className="relative">
                      <div className="w-4 h-4 bg-primary rounded-full border-4 border-background shadow-soft" />
                    </div>

                    <div className="flex-1" />
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding">
        <div className="container-max">
          <AnimatedSection animation="fade-up" className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Our Core Values
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              The principles that guide everything we do and define who we are as an organization
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <AnimatedSection
                key={value.title}
                animation="scale"
                delay={index * 0.1}
              >
                <motion.div
                  whileHover={{ y: -5 }}
                  className="card-elevated p-8 h-full"
                >
                  <div className="flex items-start space-x-4">
                    <div className="inline-flex items-center justify-center w-12 h-12 gradient-primary rounded-full flex-shrink-0">
                      <value.icon className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-foreground mb-3">
                        {value.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {value.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Partner Brands */}
      <section className="section-padding bg-gradient-to-r from-primary/5 to-accent/5">
        <div className="container-max">
          <AnimatedSection animation="fade-up" className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Trusted Partnerships
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We are proud to represent world-class brands that share our commitment
              to quality, innovation, and customer success
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 gap-8">
            {partnerBrands.map((brand, index) => (
              <AnimatedSection
                key={brand.name}
                animation="fade-up"
                delay={index * 0.2}
              >
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="card-elevated p-8 text-center"
                >
                  <div className="space-y-4">
                    <div className="text-2xl font-bold text-primary">
                      {brand.name}
                    </div>
                    <p className="text-muted-foreground">
                      {brand.description}
                    </p>
                    <div className="flex items-center justify-center space-x-2 text-sm">
                      <Star className="h-4 w-4 text-accent fill-current" />
                      <span className="text-accent font-medium">
                        {brand.partnership}
                      </span>
                    </div>
                  </div>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding gradient-hero text-primary-foreground">
        <div className="container-max text-center">
          <AnimatedSection animation="scale">
            <div className="max-w-3xl mx-auto space-y-6">
              <h2 className="text-3xl lg:text-4xl font-bold">
                Join Our Success Story
              </h2>
              <p className="text-xl text-primary-foreground/90">
                Become part of the Ammar Group family and experience the difference
                that 50 years of excellence can make for your business.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/catalog" className="btn-accent">
                  Explore Products
                </Link>
                <Link to="/services" className="btn-outline border-white/30 text-white hover:bg-white/10">
                  Our Services
                </Link>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
};

export default About;