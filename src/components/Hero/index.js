import React from 'react';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';

export default function Hero() {
  return (
    <section className={styles.heroBanner}>
      <div className={styles.heroContent}>
        <img src="/img/logo.svg" alt="PointWorks Logo" className={styles.heroLogo} />
        <h1 className={styles.heroTitle}>PointWorks</h1>
        <p className={styles.heroSubtitle}>专业三维点云处理软件</p>
        <p className={styles.heroTech}>基于 Qt5 / VTK / PCL 构建</p>
        <div className={styles.heroButtons}>
          <Link to="/docs/intro" className={styles.btnPrimary}>
            快速开始
          </Link>
          <Link to="/download" className={styles.btnSecondary}>
            下载软件
          </Link>
          <a
            href="https://github.com/Libaocheng3811/CloudTool2"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.btnSecondary}
          >
            GitHub
          </a>
        </div>
      </div>
      <div className={styles.scrollHint}>↓</div>
    </section>
  );
}
