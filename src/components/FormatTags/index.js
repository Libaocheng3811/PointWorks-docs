import React from 'react';
import styles from './styles.module.css';

const formats = ['LAS', 'LAZ', 'PLY', 'PCD', 'E57', 'TXT', 'OBJ', 'STL', 'VTK'];

export default function FormatTags() {
  return (
    <section className={styles.section}>
      <h2 className={styles.title}>支持的格式</h2>
      <div className={styles.tags}>
        {formats.map((f) => (
          <span key={f} className={styles.tag}>{f}</span>
        ))}
      </div>
      <p className={styles.subtitle}>覆盖主流点云和网格格式</p>
    </section>
  );
}
