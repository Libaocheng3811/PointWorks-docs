import React from 'react';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './styles.module.css';

export default function Hero() {
  return (
    <section className={styles.heroBanner}>
      <div className={styles.heroGlow} />
      <div className={styles.heroContent}>
        <img src={useBaseUrl('/img/logo.svg')} alt="PointWorks Logo" className={styles.heroLogo} />
        <h1 className={styles.heroTitle}>PointWorks</h1>
        <p className={styles.heroSubtitle}>专业三维点云处理软件</p>
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
      <div className={styles.scrollHint}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M12 5v14M5 12l7 7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </section>
  );
}
