import React, { useState, useEffect } from 'react';
import Layout from '@theme/Layout';
import styles from './download.module.css';

const GITHUB_RELEASE = 'https://github.com/Libaocheng3811/PointWorks/releases/tag/v0.9.0-beta';

const releases = [
  {
    icon: '📦',
    name: '安装程序',
    arch: 'Windows 10/11 (x64) · 约 150 MB',
    url: 'https://github.com/Libaocheng3811/PointWorks/releases/download/v0.9.0-beta/PointWorks-Setup-0.9.0-beta.exe',
    available: true,
    os: 'windows-installer',
    tag: '推荐',
  },
  {
    icon: '📁',
    name: '绿色免安装',
    arch: 'Windows 10/11 (x64) · ZIP 压缩包',
    url: 'https://github.com/Libaocheng3811/PointWorks/releases/download/v0.9.0-beta/PointWorks-0.9.0-beta-Portable.zip',
    available: true,
    os: 'windows-portable',
  },
  {
    icon: '🍎',
    name: 'macOS',
    arch: 'macOS 12+ (Intel / Apple Silicon)',
    url: GITHUB_RELEASE,
    available: false,
    os: 'mac',
  },
  {
    icon: '🐧',
    name: 'Linux',
    arch: 'Ubuntu 20.04+ / CentOS 7+',
    url: GITHUB_RELEASE,
    available: false,
    os: 'linux',
  },
];

const changelog = [
  { version: 'v0.9.0-beta', date: '2026-05', items: ['首个公开测试版本', '多格式点云读写（LAS/LAZ/E57/PLY/PCD/TXT/OBJ/STL）', '三维点云可视化（多视窗、法线、颜色渲染）', '滤波处理（直通、体素、统计离群点、半径离群点）', 'CSF 地面分割', 'ICP/NDT 配准', '变化检测（C2C/C2M/M3C2）', '曲面重建（Poisson/Greedy）', '嵌入式 Python 脚本引擎', '中英文国际化'] },
  { version: 'v0.1.0', date: '2025-01', items: ['内部测试版本', '点云可视化（VTK 渲染）', '滤波处理（直通、体素、统计离群点）', 'ICP 配准', 'CSF 地面分割', 'Python 脚本支持'] },
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
          <p className={styles.heroDesc}>v0.9.0-beta · 免费开源 · Windows</p>
          <p className={styles.heroHint}>已为你推荐适合的版本</p>
        </section>

        <div className={styles.platforms}>
          {releases.map((r) => {
            const isRecommended = r.tag === '推荐';
            return (
              <div key={r.name} className={`${styles.platformCard} ${isRecommended ? styles.platformCardRecommended : ''}`}>
                {r.tag && <span className={styles.recommendedBadge}>{r.tag}</span>}
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
            源代码请访问{' '}
            <a href="https://github.com/Libaocheng3811/PointWorks" target="_blank" rel="noopener noreferrer">
              GitHub 仓库
            </a>
            ，历史版本和完整更新日志请查看{' '}
            <a href="https://github.com/Libaocheng3811/PointWorks/releases" target="_blank" rel="noopener noreferrer">
              GitHub Releases
            </a>
            。
          </p>
        </div>
      </main>
    </Layout>
  );
}
