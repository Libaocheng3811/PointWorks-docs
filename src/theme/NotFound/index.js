import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';

export default function NotFound() {
  return (
    <Layout title="页面未找到">
      <main className={styles.notFound}>
        <p className={styles.code}>404</p>
        <p className={styles.title}>抱歉，你访问的页面不存在</p>
        <div className={styles.actions}>
          <Link to="/" className={styles.btnPrimary}>返回首页</Link>
          <Link to="/docs/intro" className={styles.btnSecondary}>查看文档</Link>
          <Link to="/download" className={styles.btnSecondary}>下载软件</Link>
        </div>
      </main>
    </Layout>
  );
}
