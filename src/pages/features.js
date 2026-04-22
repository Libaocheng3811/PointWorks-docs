import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import styles from './features.module.css';

const categories = [
  {
    title: '核心能力',
    desc: '点云处理的基础操作',
    items: [
      { icon: '👁️', title: '可视化', desc: '基于 VTK 的高性能三维渲染引擎，八叉树空间索引 + LOD 自适应渲染，支持亿级点云流畅交互。', to: '/docs/features/visualization/intro' },
      { icon: '🔧', title: '滤波处理', desc: '直通滤波、体素降采样、统计离群点移除、半径离群点、条件滤波、网格最小值、局部最大值共 7 种算法。', to: '/docs/features/filtering/intro' },
      { icon: '🎯', title: '配准', desc: '中心对齐、全局配准（IA-RANSAC）、精配准（ICP）、手动点对配准，支持多站扫描数据拼接。', to: '/docs/features/registration/intro' },
    ],
  },
  {
    title: '分析工具',
    desc: '专业级点云分析功能',
    items: [
      { icon: '✂️', title: '分割', desc: '形状检测、形态学分割、区域生长、欧式聚类、超体素分割，覆盖主流点云分割场景。', to: '/docs/features/segmentation/intro' },
      { icon: '🌍', title: '地面分割', desc: '基于 CSF（Cloth Simulation Filter）布料模拟滤波的地面点提取算法，适用于多种地形。', to: '/docs/features/ground-segmentation/intro' },
      { icon: '🌿', title: '植被分割', desc: '从地面三维点云中分离植被点，适用于林业调查、城市绿化管理等应用。', to: '/docs/features/vegetation/intro' },
      { icon: '🔍', title: '变化检测', desc: '云对云距离计算、云对网格距离计算，色度条可视化对比分析。', to: '/docs/features/change-detection/intro' },
    ],
  },
  {
    title: '数据管理',
    desc: '海量数据的高效处理',
    items: [
      { icon: '📊', title: '数据管理', desc: '支持 LAS、LAZ、PLY、PCD、E57、TXT、OBJ、STL、VTK 等 9 种主流格式。项目文件管理，工作区状态保存。', to: '/docs/features/data-management/intro' },
      { icon: '💾', title: '大点云支持', desc: '流式 I/O、八叉树索引、全局坐标偏移，可处理数百 GB 级点云数据。', to: '/docs/advanced/large-pointcloud' },
    ],
  },
  {
    title: '高级功能',
    desc: '扩展你的工作流程',
    items: [
      { icon: '✏️', title: '编辑工具', desc: '颜色编辑、坐标变换、法线计算、尺度缩放、包围盒操作，全面的数据编辑能力。', to: '/docs/features/editing/intro' },
      { icon: '📏', title: '测量工具', desc: '距离、角度、面积、体积测量，支持点对点、点到面等多种测量方式。', to: '/docs/features/measure/intro' },
      { icon: '🗺️', title: '深度图', desc: '将三维点云投影为深度图，用于表面分析和数据压缩。', to: '/docs/features/range-image/intro' },
      { icon: '🔲', title: '曲面重建与网格', desc: 'Poisson 曲面重建、凸包计算、边界提取，从点云生成高质量三角网格模型。', to: '/docs/features/surface/intro' },
      { icon: '📐', title: '距离计算', desc: '计算点云与点云之间的距离，支持多种距离度量方式。', to: '/docs/features/distance/intro' },
      { icon: '🐍', title: 'Python 脚本', desc: '内嵌 Python 3.9 控制台和编辑器，通过 pybind11 调用全部 C++ 功能，支持自动化批处理。', to: '/docs/advanced/python-scripting/intro' },
    ],
  },
];

const compareData = [
  ['点云可视化', 'VTK', 'DC', 'VCGLib'],
  ['滤波处理', '7 种算法', '基础', '网格滤波'],
  ['点云配准', 'ICP + IA-RANSAC', 'ICP', '-'],
  ['地面分割', 'CSF', 'RANSAC', '-'],
  ['变化检测', '云对云/网格', '云对云', '-'],
  ['Python 脚本', '内嵌 pybind11', '-', 'PyMeshLab'],
  ['曲面重建', 'Poisson', '-', '专业级'],
  ['开源协议', 'MIT', 'GPL', 'GPL'],
];

export default function FeaturesPage() {
  return (
    <Layout title="功能介绍 - PointWorks">
      <main className={styles.page}>
        <section className={styles.hero}>
          <div className={styles.heroGlow} />
          <h1 className={styles.heroTitle}>功能介绍</h1>
          <p className={styles.heroDesc}>从数据导入到高级分析，一站式点云处理解决方案</p>
        </section>

        {categories.map((cat) => (
          <section key={cat.title} className={styles.category}>
            <div className={styles.categoryHeader}>
              <h2 className={styles.categoryTitle}>{cat.title}</h2>
              <span className={styles.categoryDesc}>{cat.desc}</span>
            </div>
            <div className={styles.grid}>
              {cat.items.map((f) => (
                <Link key={f.title} to={f.to} className={styles.card}>
                  <div className={styles.cardIcon}>{f.icon}</div>
                  <h3 className={styles.cardTitle}>{f.title}</h3>
                  <p className={styles.cardDesc}>{f.desc}</p>
                  <span className={styles.cardLink}>查看文档 →</span>
                </Link>
              ))}
            </div>
          </section>
        ))}

        <section className={styles.compareSection}>
          <h2 className={styles.compareTitle}>与同类软件对比</h2>
          <div className={styles.compareWrap}>
            <table className={styles.compareTable}>
              <thead>
                <tr>
                  <th>功能</th>
                  <th className={styles.highlightCol}>PointWorks</th>
                  <th>CloudCompare</th>
                  <th>MeshLab</th>
                </tr>
              </thead>
              <tbody>
                {compareData.map(([feature, pw, cc, ml]) => (
                  <tr key={feature}>
                    <td>{feature}</td>
                    <td className={styles.highlightCol}>{pw}</td>
                    <td>{cc}</td>
                    <td>{ml}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </Layout>
  );
}
