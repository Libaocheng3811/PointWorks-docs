import React from 'react';
import Layout from '@theme/Layout';
import styles from './download.module.css';

const releases = [
  {
    icon: '🪟',
    name: 'Windows',
    arch: 'Windows 10/11 (x64)',
    url: 'https://github.com/Libaocheng3811/CloudTool2/releases/latest',
    available: true,
  },
  {
    icon: '🍎',
    name: 'macOS',
    arch: 'macOS 12+ (Intel / Apple Silicon)',
    url: 'https://github.com/Libaocheng3811/CloudTool2/releases/latest',
    available: false,
  },
  {
    icon: '🐧',
    name: 'Linux',
    arch: 'Ubuntu 20.04+ / CentOS 7+',
    url: 'https://github.com/Libaocheng3811/CloudTool2/releases/latest',
    available: false,
  },
  {
    icon: '📦',
    name: '源代码',
    arch: 'GitHub Repository',
    url: 'https://github.com/Libaocheng3811/CloudTool2',
    available: true,
  },
];

export default function DownloadPage() {
  return (
    <Layout title="下载 - PointWorks">
      <main className={styles.page}>
        <div className={styles.hero}>
          <h1 className={styles.heroTitle}>下载 PointWorks</h1>
          <p className={styles.heroDesc}>v0.1.0 · 免费开源 · 跨平台</p>
        </div>

        <div className={styles.platforms}>
          {releases.map((r) => (
            <div key={r.name} className={styles.platformCard}>
              <div className={styles.platformIcon}>{r.icon}</div>
              <h3 className={styles.platformName}>{r.name}</h3>
              <p className={styles.platformArch}>{r.arch}</p>
              {r.available ? (
                <a
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.downloadBtn}
                >
                  下载
                </a>
              ) : (
                <span className={styles.downloadBtnDisabled}>
                  即将推出
                </span>
              )}
            </div>
          ))}
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
          <h2 className={styles.sectionTitle}>校验</h2>
          <div className={styles.requirements}>
            <p>下载完成后，建议校验安装包的完整性：</p>
            <p className={styles.checksum}>SHA256: (发布后提供)</p>
          </div>
        </div>

        <div className={styles.olderVersions}>
          <p>
            历史版本和更新日志请查看{' '}
            <a href="/blog">更新日志</a>，
            或访问{' '}
            <a
              href="https://github.com/Libaocheng3811/CloudTool2/releases"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub Releases
            </a>
            。
          </p>
        </div>
      </main>
    </Layout>
  );
}
