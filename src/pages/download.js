import React, { useState, useEffect } from 'react';
import Layout from '@theme/Layout';
import styles from './download.module.css';

const releases = [
  {
    icon: '🪟',
    name: 'Windows',
    arch: 'Windows 10/11 (x64)',
    url: 'https://github.com/Libaocheng3811/CloudTool2/releases/latest',
    available: true,
    os: 'windows',
  },
  {
    icon: '🍎',
    name: 'macOS',
    arch: 'macOS 12+ (Intel / Apple Silicon)',
    url: 'https://github.com/Libaocheng3811/CloudTool2/releases/latest',
    available: false,
    os: 'mac',
  },
  {
    icon: '🐧',
    name: 'Linux',
    arch: 'Ubuntu 20.04+ / CentOS 7+',
    url: 'https://github.com/Libaocheng3811/CloudTool2/releases/latest',
    available: false,
    os: 'linux',
  },
  {
    icon: '📦',
    name: '源代码',
    arch: 'GitHub Repository',
    url: 'https://github.com/Libaocheng3811/CloudTool2',
    available: true,
    os: 'source',
  },
];

const changelog = [
  { version: 'v0.1.0', date: '2025-01', items: ['首次发布', '点云可视化（VTK 渲染）', '滤波处理（直通、体素、统计离群点）', 'ICP 配准', 'CSF 地面分割', 'Python 脚本支持'] },
];

function detectOS() {
  if (typeof navigator === 'undefined') return 'windows';
  const ua = navigator.userAgent.toLowerCase();
  if (ua.includes('win')) return 'windows';
  if (ua.includes('mac')) return 'mac';
  if (ua.includes('linux')) return 'linux';
  return 'windows';
}

export default function DownloadPage() {
  const [detectedOS, setDetectedOS] = useState('windows');

  useEffect(() => {
    setDetectedOS(detectOS());
  }, []);

  return (
    <Layout title="下载 - PointWorks">
      <main className={styles.page}>
        <section className={styles.hero}>
          <div className={styles.heroGlow} />
          <h1 className={styles.heroTitle}>下载 PointWorks</h1>
          <p className={styles.heroDesc}>v0.1.0 · 免费开源 · 跨平台</p>
          <p className={styles.heroHint}>已为你推荐适合的版本</p>
        </section>

        <div className={styles.platforms}>
          {releases.map((r) => {
            const isRecommended = r.os === detectedOS && r.available;
            return (
              <div key={r.name} className={`${styles.platformCard} ${isRecommended ? styles.platformCardRecommended : ''}`}>
                {isRecommended && <span className={styles.recommendedBadge}>推荐</span>}
                <div className={styles.platformIcon}>{r.icon}</div>
                <h3 className={styles.platformName}>{r.name}</h3>
                <p className={styles.platformArch}>{r.arch}</p>
                {r.available ? (
                  <a
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${styles.downloadBtn} ${isRecommended ? styles.downloadBtnPrimary : ''}`}
                  >
                    下载
                  </a>
                ) : (
                  <span className={styles.downloadBtnDisabled}>即将推出</span>
                )}
              </div>
            );
          })}
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>系统要求</h2>
          <div className={styles.requirements}>
            <p><strong>操作系统：</strong>Windows 10/11（64 位）</p>
            <p><strong>内存：</strong>8 GB RAM 以上（推荐 16 GB）</p>
            <p><strong>显卡：</strong>支持 OpenGL 3.3+ 的独立显卡</p>
            <p><strong>磁盘空间：</strong>500 MB 以上</p>
            <p><strong>处理器：</strong>x86_64 架构，支持 AVX 指令集</p>
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>更新日志</h2>
          <div className={styles.timeline}>
            {changelog.map((release) => (
              <div key={release.version} className={styles.timelineItem}>
                <div className={styles.timelineDot} />
                <div className={styles.timelineContent}>
                  <h3 className={styles.timelineVersion}>{release.version} <span className={styles.timelineDate}>{release.date}</span></h3>
                  <ul className={styles.timelineList}>
                    {release.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>校验</h2>
          <div className={styles.requirements}>
            <p>下载完成后，建议校验安装包的完整性：</p>
            <p className={styles.checksum}>SHA256: (发布后提供)</p>
          </div>
        </div>

        <div className={styles.olderVersions}>
          <p>
            历史版本和完整更新日志请查看{' '}
            <a href="/blog">更新日志</a>
            ，或访问{' '}
            <a href="https://github.com/Libaocheng3811/CloudTool2/releases" target="_blank" rel="noopener noreferrer">
              GitHub Releases
            </a>
            。
          </p>
        </div>
      </main>
    </Layout>
  );
}
