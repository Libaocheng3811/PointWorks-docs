import React, { useState } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import styles from './python-api.module.css';

const tabs = [
  {
    key: 'filter',
    label: '加载滤波',
    code: [
      { text: 'import ct', cls: 'kw' },
      { text: '' },
      { text: '# 加载点云文件', cls: 'comment' },
      { text: 'ct.load_cloud("D:/data/scan.las")', cls: '' },
      { text: '' },
      { text: '# 体素降采样', cls: 'comment' },
      { text: 'sampled = ct.voxel_grid("scan", 0.5, 0.5, 0.5)', cls: '' },
      { text: 'sampled.show("sampled")', cls: '' },
      { text: '' },
      { text: '# 统计离群点移除', cls: 'comment' },
      { text: 'clean = ct.statistical_outlier_removal(', cls: '' },
      { text: '    "sampled", nr_k=30, stddev_mult=2.0)', cls: '' },
      { text: 'clean.show("clean")', cls: '' },
      { text: '' },
      { text: '# 保存结果', cls: 'comment' },
      { text: 'ct.save_cloud("clean", "D:/output/clean.laz")', cls: '' },
    ],
  },
  {
    key: 'icp',
    label: 'ICP 配准',
    code: [
      { text: 'import ct', cls: 'kw' },
      { text: '' },
      { text: '# 加载两期数据', cls: 'comment' },
      { text: 'ct.load_cloud("before.las")', cls: '' },
      { text: 'ct.load_cloud("after.las")', cls: '' },
      { text: '' },
      { text: '# 粗配准 (NDT)', cls: 'comment' },
      { text: 'coarse = ct.ndt("before", "after",', cls: '' },
      { text: '    resolution=2.0, step_size=0.1)', cls: '' },
      { text: '' },
      { text: '# 精配准 (ICP)', cls: 'comment' },
      { text: 'result = ct.icp("before", "after",', cls: '' },
      { text: '    max_iterations=100,', cls: '' },
      { text: '    correspondence_distance=0.5)', cls: '' },
      { text: '' },
      { text: 'if result:', cls: '' },
      { text: '    ct.printI(f"RMSE: {result[\'score\']:.6f}")', cls: '' },
      { text: '    result["aligned"].show("aligned")', cls: '' },
    ],
  },
  {
    key: 'batch',
    label: '批量地面分割',
    code: [
      { text: 'import ct', cls: 'kw' },
      { text: '' },
      { text: '# 启用脚本模式（结果不自动显示）', cls: 'comment' },
      { text: 'ct.set_script_mode(True)', cls: '' },
      { text: '' },
      { text: 'ct.load_cloud("D:/data/scan.las")', cls: '' },
      { text: '' },
      { text: '# CSF 地面分割', cls: 'comment' },
      { text: 'result = ct.csf_filter("scan",', cls: '' },
      { text: '    cloth_resolution=1.0,', cls: '' },
      { text: '    rigidness=2,', cls: '' },
      { text: '    iterations=300)', cls: '' },
      { text: '' },
      { text: '# 保存地面点和非地面点', cls: 'comment' },
      { text: 'if result["ground"]:', cls: '' },
      { text: '    result["ground"].show("ground")', cls: '' },
      { text: '    ct.save_cloud("ground",', cls: '' },
      { text: '        "D:/output/ground.laz")', cls: '' },
    ],
  },
];

const capabilities = [
  { icon: '🔌', title: '完整 API 覆盖', desc: '140+ 个函数覆盖全部 C++ 算法，通过 pybind11 原生性能调用' },
  { icon: '⚡', title: '批处理自动化', desc: '编写脚本批量处理数百个点云文件，支持进度反馈' },
  { icon: '🧩', title: '自定义算法', desc: '结合 NumPy、SciPy 在 Python 中实现自定义点云处理流程' },
  { icon: '👁️', title: '实时预览', desc: '代码执行后即时在 3D 视窗中查看结果' },
  { icon: '🔗', title: '链式调用', desc: 'ct.Cloud 便捷方法支持链式操作，简化流水线代码' },
  { icon: '📦', title: '多格式支持', desc: '支持 LAS/LAZ/E57/PLY/PCD/TXT/OBJ/STL 等格式读写' },
];

export default function PythonAPIPage() {
  const [activeTab, setActiveTab] = useState('filter');
  const [copied, setCopied] = useState(false);

  const currentTab = tabs.find((t) => t.key === activeTab);

  const handleCopy = () => {
    const text = 'import ct';
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
            内嵌 Python 3.9 + pybind11 · 140+ 个 API · 与 C++ 原生性能一致
          </p>
          <div className={styles.installBlock}>
            <code className={styles.installCode}>
              <span className={styles.installPrompt}>{'>>> '}</span> import ct
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
                    {line.text || ' '}
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
