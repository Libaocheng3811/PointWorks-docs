import React from 'react';
import PointCloudCanvasInner from './PointCloudCanvasInner';
import styles from './styles.module.css';

export default function PointCloudCanvas() {
  return (
    <div className={styles.container}>
      <PointCloudCanvasInner />
    </div>
  );
}
