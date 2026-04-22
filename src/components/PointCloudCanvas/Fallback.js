import React from 'react';
import styles from './Fallback.module.css';

export default function Fallback() {
  return (
    <div className={styles.container}>
      <div className={styles.glow} />
      <div className={styles.ring} />
      <div className={styles.ring2} />
      <div className={styles.grid} />
      <div className={styles.points}>
        {Array.from({ length: 40 }, (_, i) => (
          <span
            key={i}
            className={styles.dot}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${3 + Math.random() * 3}s`,
              opacity: 0.3 + Math.random() * 0.7,
              width: `${2 + Math.random() * 3}px`,
              height: `${2 + Math.random() * 3}px`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
