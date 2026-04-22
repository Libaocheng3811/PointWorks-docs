import React from 'react';
import Layout from '@theme/Layout';
import styles from './community.module.css';

const plugins = [
  {
    name: 'CSF 地面滤波增强版',
    author: 'PointWorks Team',
    downloads: '1.2k',
    stars: 4.8,
    desc: '多参数优化的 CSF 滤波，支持复杂地形场景',
    tag: '官方',
  },
  {
    name: 'RANSAC 形状检测插件',
    author: 'community',
    downloads: '856',
    stars: 4.5,
    desc: '平面、圆柱、球体等几何形状自动检测与拟合',
    tag: '社区',
  },
  {
    name: 'AI 建筑物语义分割',
    author: 'community',
    downloads: '643',
    stars: 4.7,
    desc: '基于深度学习的建筑物点云语义分割',
    tag: 'AI',
  },
  {
    name: '大疆航测点云优化',
    author: 'community',
    downloads: '512',
    stars: 4.3,
    desc: '针对大疆无人机航测数据的专用优化流程',
    tag: '专用',
  },
  {
    name: '点云去噪 AI',
    author: 'community',
    downloads: '489',
    stars: 4.6,
    desc: '智能移除扫描噪声，保留边缘细节',
    tag: 'AI',
  },
  {
    name: '管线自动提取',
    author: 'community',
    downloads: '378',
    stars: 4.4,
    desc: '从工矿点云中自动提取管线设施',
    tag: '专用',
  },
];

const channels = [
  { icon: '📂', title: 'GitHub 仓库', desc: '源代码、Issues、Discussions', url: 'https://github.com/Libaocheng3811/CloudTool2' },
  { icon: '📋', title: '问题反馈', desc: '提交 Bug 报告或功能建议', url: 'https://github.com/Libaocheng3811/CloudTool2/issues' },
  { icon: '📖', title: '文档', desc: '完整的使用说明和开发指南', url: '/docs/intro' },
  { icon: '📰', title: '更新日志', desc: '版本发布记录和技术文章', url: '/blog' },
  { icon: '❓', title: '常见问题', desc: '使用中遇到的问题解答', url: '/faq' },
];

function StarRating({ value }) {
  const full = Math.floor(value);
  const half = value % 1 >= 0.5;
  return (
    <span className={styles.stars}>
      {'★'.repeat(full)}
      {half && '½'}
      <span className={styles.starValue}>{value}</span>
    </span>
  );
}

export default function CommunityPage() {
  return (
    <Layout title="社区 - PointWorks">
      <main className={styles.page}>
        <section className={styles.hero}>
          <div className={styles.heroGlow} />
          <h1 className={styles.heroTitle}>加入 PointWorks 生态</h1>
          <p className={styles.heroDesc}>用 Python 插件无限扩展你的工作流程</p>
        </section>

        <section className={styles.pluginSection}>
          <h2 className={styles.sectionTitle}>插件市场</h2>
          <p className={styles.sectionDesc}>社区贡献的扩展插件，一行代码即可安装</p>
          <div className={styles.pluginGrid}>
            {plugins.map((p) => (
              <div key={p.name} className={styles.pluginCard}>
                <div className={styles.pluginHeader}>
                  <h3 className={styles.pluginName}>{p.name}</h3>
                  <span className={`${styles.pluginTag} ${styles[`tag${p.tag}`]}`}>{p.tag}</span>
                </div>
                <p className={styles.pluginDesc}>{p.desc}</p>
                <div className={styles.pluginMeta}>
                  <span className={styles.pluginAuthor}>by {p.author}</span>
                  <span className={styles.pluginDownloads}>{p.downloads} 下载</span>
                </div>
                <div className={styles.pluginFooter}>
                  <StarRating value={p.stars} />
                  <button className={styles.installBtn}>安装</button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.channelSection}>
          <h2 className={styles.sectionTitle}>交流渠道</h2>
          <p className={styles.sectionDesc}>获取帮助、参与讨论、分享经验</p>
          <div className={styles.channelGrid}>
            {channels.map((ch) => (
              <a
                key={ch.title}
                href={ch.url}
                target={ch.url.startsWith('http') ? '_blank' : undefined}
                rel={ch.url.startsWith('http') ? 'noopener noreferrer' : undefined}
                className={styles.channelCard}
              >
                <span className={styles.channelIcon}>{ch.icon}</span>
                <div>
                  <p className={styles.channelTitle}>{ch.title}</p>
                  <p className={styles.channelDesc}>{ch.desc}</p>
                </div>
              </a>
            ))}
          </div>
        </section>

        <section className={styles.contribSection}>
          <h2 className={styles.contribTitle}>参与贡献</h2>
          <p className={styles.contribDesc}>
            PointWorks 是一个开源项目，欢迎各种形式的贡献。你可以提交 Bug 报告和功能建议、改进文档、贡献代码、或分享使用经验。
          </p>
          <div className={styles.contribWays}>
            <div className={styles.contribWay}>
              <span className={styles.contribIcon}>🐛</span>
              <span>提交 Bug</span>
            </div>
            <div className={styles.contribWay}>
              <span className={styles.contribIcon}>📝</span>
              <span>改进文档</span>
            </div>
            <div className={styles.contribWay}>
              <span className={styles.contribIcon}>💻</span>
              <span>贡献代码</span>
            </div>
            <div className={styles.contribWay}>
              <span className={styles.contribIcon}>💡</span>
              <span>功能建议</span>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
