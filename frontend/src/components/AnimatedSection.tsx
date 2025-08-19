import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  animation?: 'fade-up' | 'fade-in' | 'slide-left' | 'slide-right' | 'scale' | 'bounce';
  delay?: number;
  duration?: number;
}

const AnimatedSection: React.FC<AnimatedSectionProps> = ({
  children,
  className = '',
  animation = 'fade-up',
  delay = 0,
  duration = 0.6,
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const animations = {
    'fade-up': {
      initial: { opacity: 0, y: 50 },
      animate: { opacity: 1, y: 0 },
    },
    'fade-in': {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
    },
    'slide-left': {
      initial: { opacity: 0, x: -50 },
      animate: { opacity: 1, x: 0 },
    },
    'slide-right': {
      initial: { opacity: 0, x: 50 },
      animate: { opacity: 1, x: 0 },
    },
    'scale': {
      initial: { opacity: 0, scale: 0.8 },
      animate: { opacity: 1, scale: 1 },
    },
    'bounce': {
      initial: { opacity: 0, scale: 0.3 },
      animate: { opacity: 1, scale: 1 },
    },
  };

  const selectedAnimation = animations[animation];

  return (
    <motion.div
      ref={ref}
      initial={selectedAnimation.initial}
      animate={isInView ? selectedAnimation.animate : selectedAnimation.initial}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
        ...(animation === 'bounce' && {
          type: 'spring',
          damping: 10,
          stiffness: 100,
        }),
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedSection;