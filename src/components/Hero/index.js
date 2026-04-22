import React, { Suspense, lazy } from 'react';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Fallback from '@site/src/components/PointCloudCanvas/Fallback';
import styles from './styles.module.css';

const PointCloudCanvas = lazy(() => import('@site/src/components/PointCloudCanvas'));

export default function Hero() {
  return (
    <section className={styles.heroBanner}>
      <div className={styles.heroGlow} />
      <div className={styles.particles}>
        <span className={styles.dot} />
        <span className={styles.dot} />
        <span className={styles.dot} />
        <span className={styles.dot} />
        <span className={styles.dot} />
        <span className={styles.dot} />
        <span className={styles.dot} />
        <span className={styles.dot} />
        <span className={styles.dot} />
        <span className={styles.dot} />
        <span className={styles.dot} />
        <span className={styles.dot} />
      </div>
      <div className={styles.heroInner}>
        <div className={styles.heroLeft}>
          <div className={styles.brandRow}>
            <img src={useBaseUrl('/img/logo.svg')} alt="PointWorks" className={styles.heroLogo} />
            <span className={styles.brandName}>PointWorks</span>
          </div>
          <h1 className={styles.heroTitle}>
            下一代智能点云处理平台，<span className={styles.highlight}>无限扩展</span>
          </h1>
          <p className={styles.heroSubtitle}>
            媲美 CloudCompare 的极速性能，融合原生 Python 生态
          </p>
          <div className={styles.versionTag}>
            v0.1.0 · 开源免费 · MIT License
          </div>
          <div className={styles.heroButtons}>
            <Link to="/download" className={styles.btnPrimary}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{marginRight: 8}}>
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              免费下载
            </Link>
            <Link to="/docs/intro" className={styles.btnSecondary}>
              快速开始
            </Link>
            <a
              href="https://github.com/Libaocheng3811/CloudTool2"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.btnGhost}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{marginRight: 6}}>
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
              </svg>
              GitHub
            </a>
          </div>
        </div>
        <div className={styles.heroRight}>
          <Suspense fallback={<Fallback />}>
            <PointCloudCanvas />
          </Suspense>
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
