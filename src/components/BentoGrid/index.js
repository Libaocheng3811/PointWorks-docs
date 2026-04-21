import React from 'react';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';

const features = [
  {
    icon: '👁️',
    title: '可视化',
    desc: 'VTK 渲染引擎，八叉树 + LOD 自适应渲染，亿级点云流畅显示',
    to: '/docs/features/visualization/intro',
  },
  {
    icon: '🔧',
    title: '滤波处理',
    desc: '直通滤波、体素降采样、统计离群点移除等多种滤波算法',
    to: '/docs/features/filtering/intro',
  },
  {
    icon: '🎯',
    title: '配准',
    desc: '中心对齐、全局配准（IA-RANSAC）、精配准（ICP）、点对配准',
    to: '/docs/features/registration/intro',
  },
  {
    icon: '✂️',
    title: '分割',
    desc: '形状检测、区域生长、欧式聚类、超体素等分割算法',
    to: '/docs/features/segmentation/intro',
  },
  {
    icon: '🌍',
    title: '地面分割',
    desc: '基于 CSF 布料模拟滤波的地面点提取，适用于多种地形场景',
    to: '/docs/features/ground-segmentation/intro',
  },
  {
    icon: '📊',
    title: '变化检测',
    desc: '云对云 / 云对网格距离计算，色度条可视化对比',
    to: '/docs/features/change-detection/intro',
  },
  {
    icon: '🔲',
    title: '曲面重建',
    desc: 'Poisson 重建、凸包计算、边界提取',
    to: '/docs/features/surface/intro',
  },
  {
    icon: '🐍',
    title: 'Python 脚本',
    desc: '内嵌 Python 3.9 + pybind11，支持自动化批处理',
    to: '/docs/advanced/python-scripting/intro',
    wide: true,
  },
  {
    icon: '💾',
    title: '大点云支持',
    desc: '流式 I/O、八叉树索引、全局坐标偏移',
    to: '/docs/advanced/large-pointcloud',
    wide: true,
  },
];

export default function BentoGrid() {
  return (
    <div className={styles.grid}>
      {features.map((f) => (
        <Link
          key={f.title}
          to={f.to}
          className={`${styles.card} ${f.wide ? styles.cardWide : ''}`}
        >
          <div className={styles.icon}>{f.icon}</div>
          <h3 className={styles.cardTitle}>{f.title}</h3>
          <p className={styles.cardDesc}>{f.desc}</p>
        </Link>
      ))}
    </div>
  );
}
