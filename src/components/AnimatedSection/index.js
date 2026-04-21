import React from 'react';
import useIntersectionObserver from '@site/src/hooks/useIntersectionObserver';
import styles from './styles.module.css';

export default function AnimatedSection({ children, className = '' }) {
  const [ref, isVisible] = useIntersectionObserver();
  return (
    <div
      ref={ref}
      className={`${styles.section} ${isVisible ? styles.sectionVisible : ''} ${className}`}
    >
      {children}
    </div>
  );
}
