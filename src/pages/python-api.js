import React, { useState } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import styles from './python-api.module.css';

const tabs = [
  {
    key: 'filter',
    label: '加载滤波',
    code: [
      { text: 'import pointworks as pw', cls: 'kw' },
      { text: '' },
      { text: '# 加载点云', cls: 'comment' },
      { text: 'pcd = pw.load("city_scan.las")', cls: '' },
      { text: 'print(f"点数: {pcd.size:,}")', cls: '' },
      { text: '' },
      { text: '# 体素降采样', cls: 'comment' },
      { text: 'pcd = pcd.voxel_downsample(leaf_size=0.05)', cls: '' },
      { text: '' },
      { text: '# 统计离群点移除', cls: 'comment' },
      { text: 'pcd, _ = pcd.remove_statistical_outlier(', cls: '' },
      { text: '    nb_neighbors=20, std_ratio=2.0)', cls: '' },
      { text: 'print(f"滤波后点数: {pcd.size:,}")', cls: '' },
    ],
  },
  {
    key: 'icp',
    label: 'ICP 配准',
    code: [
      { text: 'import pointworks as pw', cls: 'kw' },
      { text: '' },
      { text: '# 加载源点云和目标点云', cls: 'comment' },
      { text: 'source = pw.load("scan_01.las")', cls: '' },
      { text: 'target = pw.load("scan_02.las")', cls: '' },
      { text: '' },
      { text: '# 粗配准 (IA-RANSAC)', cls: 'comment' },
      { text: 'coarse = pw.global_registration(', cls: '' },
      { text: '    source, target, voxel_size=0.5)', cls: '' },
      { text: '' },
      { text: '# 精配准 (ICP)', cls: 'comment' },
      { text: 'result = pw.icp_registration(', cls: '' },
      { text: '    source, target,', cls: '' },
      { text: '    init_transform=coarse.transform)', cls: '' },
      { text: 'print(f"RMSE: {result.fitness:.6f}")', cls: '' },
    ],
  },
  {
    key: 'batch',
    label: '批量处理',
    code: [
      { text: 'import pointworks as pw', cls: 'kw' },
      { text: 'from pathlib import Path', cls: 'kw' },
      { text: '' },
      { text: '# 遍历文件夹中所有 LAS 文件', cls: 'comment' },
      { text: 'las_dir = Path("./scans/")', cls: '' },
      { text: '' },
      { text: 'for las_file in las_dir.glob("*.las"):', cls: '' },
      { text: '    pcd = pw.load(str(las_file))', cls: '' },
      { text: '' },
      { text: '    # 自动地面分割', cls: 'comment' },
      { text: '    ground = pcd.filter(method="csf")', cls: '' },
      { text: '' },
      { text: '    # 保存结果', cls: 'comment' },
      { text: '    out = las_dir / "ground" / las_file.name', cls: '' },
      { text: '    ground.save(str(out))', cls: '' },
      { text: '    print(f"完成: {las_file.name}")', cls: '' },
    ],
  },
];

const capabilities = [
  { icon: '🔌', title: '完整 API 覆盖', desc: '全部 C++ 算法通过 pybind11 暴露为 Python 接口' },
  { icon: '📓', title: 'Jupyter 兼容', desc: '在 Notebook 中交互式探索点云数据' },
  { icon: '⚡', title: '批处理自动化', desc: '编写脚本批量处理数百个点云文件' },
  { icon: '🧩', title: '自定义算法', desc: '结合 NumPy、SciPy 扩展点云处理流程' },
  { icon: '👁️', title: '实时预览', desc: '代码执行后即时在 3D 视窗中查看结果' },
  { icon: '📦', title: '插件开发', desc: '开发自定义插件并分享到社区' },
];

export default function PythonAPIPage() {
  const [activeTab, setActiveTab] = useState('filter');
  const [copied, setCopied] = useState(false);

  const currentTab = tabs.find((t) => t.key === activeTab);

  const handleCopy = () => {
    const text = 'pip install pointworks';
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <Layout title="Python API - PointWorks">
      <main className={styles.page}>
        <section className={styles.hero}>
          <div className={styles.heroGlow} />
          <h1 className={styles.heroTitle}>Python 驱动的点云处理</h1>
          <p className={styles.heroDesc}>
            内嵌 Python 3.9 + pybind11 · 完整调用全部 C++ 算法 · 与原生性能一致
          </p>
          <div className={styles.installBlock}>
            <code className={styles.installCode}>
              <span className={styles.installPrompt}>$</span> pip install pointworks
            </code>
            <button className={styles.copyBtn} onClick={handleCopy}>
              {copied ? '已复制' : '复制'}
            </button>
          </div>
        </section>

        <section className={styles.demoSection}>
          <div className={styles.tabBar}>
            {tabs.map((tab) => (
              <button
                key={tab.key}
                className={`${styles.tab} ${activeTab === tab.key ? styles.tabActive : ''}`}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className={styles.editorPanel}>
            <div className={styles.editorHeader}>
              <div className={styles.windowDots}>
                <span className={styles.dotRed} />
                <span className={styles.dotYellow} />
                <span className={styles.dotGreen} />
              </div>
              <span className={styles.fileName}>demo.py</span>
            </div>
            <div className={styles.editorBody}>
              {currentTab.code.map((line, i) => (
                <div key={i} className={styles.codeLine}>
                  <span className={styles.lineNum}>{i + 1}</span>
                  <span className={`${styles.lineContent} ${line.cls === 'comment' ? styles.comment : line.cls === 'kw' ? styles.kw : ''}`}>
                    {line.text || ' '}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.capabilitiesSection}>
          <h2 className={styles.sectionTitle}>API 能力</h2>
          <p className={styles.sectionDesc}>Python 接口覆盖全部核心功能</p>
          <div className={styles.capabilitiesGrid}>
            {capabilities.map((c) => (
              <div key={c.title} className={styles.capCard}>
                <div className={styles.capIcon}>{c.icon}</div>
                <h3 className={styles.capTitle}>{c.title}</h3>
                <p className={styles.capDesc}>{c.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.ctaSection}>
          <Link to="/docs/advanced/python-scripting/intro" className={styles.ctaBtn}>
            开始使用 Python API
          </Link>
        </section>
      </main>
    </Layout>
  );
}
