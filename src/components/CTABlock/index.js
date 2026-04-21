import React from 'react';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';

export default function CTABlock() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <h2 className={styles.title}>准备好开始了吗？</h2>
        <p className={styles.desc}>
          PointWorks 是完全免费的开源软件。下载安装包，几分钟内即可开始处理你的点云数据。
        </p>
        <div className={styles.buttons}>
          <Link to="/download" className={styles.btnDownload}>
            下载 PointWorks
          </Link>
          <Link to="/docs/intro" className={styles.btnDocs}>
            查看文档
          </Link>
        </div>
      </div>
    </section>
  );
}
