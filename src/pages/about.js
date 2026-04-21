import React from 'react';
import Layout from '@theme/Layout';
import styles from './about.module.css';

export default function AboutPage() {
  return (
    <Layout title="关于 - PointWorks">
      <main className={styles.page}>
        <div className={styles.hero}>
          <h1 className={styles.heroTitle}>关于 PointWorks</h1>
          <p className={styles.heroDesc}>开源、专业、现代化的三维点云处理平台</p>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>项目简介</h2>
          <p>
            PointWorks 是一款面向测绘、遥感和三维重建领域的专业点云处理桌面软件。
            基于 Qt5 / VTK / PCL 技术栈构建，提供从数据导入、可视化浏览到滤波、配准、分割、
            变化检测、曲面重建的完整工作流。软件内嵌 Python 脚本环境，支持自动化批处理和自定义扩展。
          </p>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>技术栈</h2>
          <div className={styles.techStack}>
            {['C++', 'Qt5', 'VTK', 'PCL', 'Python 3.9', 'pybind11', 'CMake'].map((t) => (
              <span key={t} className={styles.techTag}>{t}</span>
            ))}
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>设计理念</h2>
          <p>
            我们相信专业的点云处理工具应该是免费、开源的。PointWorks 致力于降低点云处理的门槛，
            让更多研究者和工程师能够高效地处理三维点云数据。项目采用 MIT 开源许可证，
            欢迎社区贡献代码、提交反馈和参与开发。
          </p>
        </div>

        <div className={styles.license}>
          <h2 className={styles.sectionTitle}>开源许可证</h2>
          <p>
            PointWorks 采用 MIT 许可证发布，你可以自由地使用、复制、修改、合并、发布、分发、
            再授权和/或销售本软件的副本。
          </p>
          <pre>{`MIT License

Copyright (c) ${new Date().getFullYear()} PointWorks Team

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.`}</pre>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>引用</h2>
          <p>如果你在学术论文或报告中使用了 PointWorks，请引用本软件：</p>
          <pre className={styles.license}>{`@misc{pointworks,
  title = {PointWorks: An Open-Source 3D Point Cloud Processing Software},
  author = {PointWorks Team},
  year = {${new Date().getFullYear()}},
  url = {https://github.com/Libaocheng3811/CloudTool2}
}`}</pre>
        </div>
      </main>
    </Layout>
  );
}
