import React from 'react';
import Layout from '@theme/Layout';
import styles from './community.module.css';

const channels = [
  {
    icon: '📂',
    title: 'GitHub 仓库',
    desc: '源代码、Issues、 Discussions',
    url: 'https://github.com/Libaocheng3811/CloudTool2',
  },
  {
    icon: '📋',
    title: '问题反馈',
    desc: '提交 Bug 报告或功能建议',
    url: 'https://github.com/Libaocheng3811/CloudTool2/issues',
  },
  {
    icon: '📖',
    title: '文档',
    desc: '完整的使用说明和开发指南',
    url: '/docs/intro',
  },
  {
    icon: '📰',
    title: '更新日志',
    desc: '版本发布记录和技术文章',
    url: '/blog',
  },
  {
    icon: '❓',
    title: '常见问题',
    desc: '使用中遇到的问题解答',
    url: '/faq',
  },
];

export default function CommunityPage() {
  return (
    <Layout title="社区 - PointWorks">
      <main className={styles.page}>
        <div className={styles.hero}>
          <h1 className={styles.heroTitle}>加入社区</h1>
          <p className={styles.heroDesc}>参与贡献、获取帮助、分享经验</p>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>交流渠道</h2>
          <div className={styles.links}>
            {channels.map((ch) => (
              <a
                key={ch.title}
                href={ch.url}
                target={ch.url.startsWith('http') ? '_blank' : undefined}
                rel={ch.url.startsWith('http') ? 'noopener noreferrer' : undefined}
                className={styles.linkCard}
              >
                <span className={styles.linkIcon}>{ch.icon}</span>
                <div>
                  <p className={styles.linkTitle}>{ch.title}</p>
                  <p className={styles.linkDesc}>{ch.desc}</p>
                </div>
              </a>
            ))}
          </div>
        </div>

        <div className={styles.contribSection}>
          <h3>参与贡献</h3>
          <p>
            PointWorks 是一个开源项目，欢迎各种形式的贡献。你可以：
          </p>
          <ul style={{ paddingLeft: 20, lineHeight: 2 }}>
            <li>提交 Bug 报告和功能建议</li>
            <li>改进文档，修正错误或不清晰的描述</li>
            <li>贡献代码，实现新算法或优化现有功能</li>
            <li>分享使用经验，帮助其他用户</li>
          </ul>
        </div>
      </main>
    </Layout>
  );
}
