import React, { Suspense, lazy } from 'react';
import Layout from '@theme/Layout';
import styles from './showcase.module.css';

const ShowcaseViewer = lazy(() =>
  import('@site/src/components/PointCloudCanvas')
);

const showcases = [
  {
    title: '城市三维扫描',
    desc: '大规模城市街区激光雷达扫描，覆盖道路、建筑、植被和车辆',
    category: '城市测绘',
    color: '#00F2FE',
  },
  {
    title: '地形高程测量',
    desc: '山区地形高精度三维点云采集，用于等高线提取和土方计算',
    category: '地形测绘',
    color: '#7B61FF',
  },
  {
    title: '建筑物立面建模',
    desc: '历史建筑外立面点云扫描，用于三维建模和修缮方案',
    category: '建筑遗产',
    color: '#FF9100',
  },
  {
    title: '矿山采空区监测',
    desc: '地下矿山表面形变监测，多期点云对比分析',
    category: '工业测量',
    color: '#00FF88',
  },
  {
    title: '隧道工程检测',
    desc: '隧道内壁三维扫描，衬砌变形和裂缝分析',
    category: '工程检测',
    color: '#FF5F57',
  },
  {
    title: '林业资源调查',
    desc: '大面积林区机载激光扫描，单木参数提取和生物量估算',
    category: '生态监测',
    color: '#61AFEF',
  },
];

export default function ShowcasePage() {
  return (
    <Layout title="展示 - PointWorks">
      <main className={styles.page}>
        <section className={styles.hero}>
          <div className={styles.heroGlow} />
          <h1 className={styles.heroTitle}>应用展示</h1>
          <p className={styles.heroDesc}>
            PointWorks 在测绘、建筑、工业、生态等领域的实际应用
          </p>
        </section>

        <section className={styles.viewerSection}>
          <h2 className={styles.sectionTitle}>交互式点云查看</h2>
          <p className={styles.sectionDesc}>拖拽旋转 · 滚轮缩放 · 探索三维细节</p>
          <div className={styles.viewerContainer}>
            <Suspense fallback={<div className={styles.viewerLoading}>加载 3D 查看器...</div>}>
              <ShowcaseViewer />
            </Suspense>
          </div>
        </section>

        <section className={styles.gallerySection}>
          <h2 className={styles.sectionTitle}>应用案例</h2>
          <p className={styles.sectionDesc}>来自不同行业的典型应用场景</p>
          <div className={styles.galleryGrid}>
            {showcases.map((item) => (
              <div key={item.title} className={styles.galleryCard}>
                <div
                  className={styles.cardPreview}
                  style={{
                    background: `radial-gradient(circle at 50% 50%, ${item.color}15, ${item.color}05)`,
                  borderColor: `${item.color}30`,
                  }}
                >
                  <div className={styles.cardDots}>
                    {Array.from({ length: 30 }, (_, i) => (
                      <span
                        key={i}
                        className={styles.cardDot}
                        style={{
                          left: `${Math.random() * 100}%`,
                          top: `${Math.random() * 100}%`,
                          background: item.color,
                          opacity: 0.15 + Math.random() * 0.5,
                          width: `${2 + Math.random() * 3}px`,
                          height: `${2 + Math.random() * 3}px`,
                        }}
                      />
                    ))}
                  </div>
                </div>
                <div className={styles.cardContent}>
                  <span className={styles.cardCategory} style={{ color: item.color, borderColor: `${item.color}40` }}>
                    {item.category}
                  </span>
                  <h3 className={styles.cardTitle}>{item.title}</h3>
                  <p className={styles.cardDesc}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.ctaSection}>
          <p className={styles.ctaText}>
            有使用 PointWorks 的精彩案例？欢迎提交到我们的社区展示
          </p>
          <a
            href="https://github.com/Libaocheng3811/CloudTool2"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.ctaBtn}
          >
            提交案例
          </a>
        </section>
      </main>
    </Layout>
  );
}
