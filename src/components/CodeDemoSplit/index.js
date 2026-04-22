import React, { useState, useRef, useMemo, Suspense, lazy } from 'react';
import styles from './styles.module.css';

const PointCloudDemo = lazy(() =>
  import('@site/src/components/CodeDemoSplit/PointCloudDemo')
);

const examples = [
  {
    id: 'voxel',
    label: '体素降采样',
    desc: '120,000 pts → 8,000 pts',
    lines: [
      { text: 'import pointworks as pw', cls: 'kw' },
      { text: '' },
      { text: '# 加载原始点云', cls: 'comment' },
      { text: 'pcd = pw.load("terrain.las")', cls: '' },
      { text: 'print(f"原始点数: {pcd.size:,}")', cls: '' },
      { text: '' },
      { text: '# 体素降采样 (5cm)', cls: 'comment' },
      { text: 'down = pcd.voxel_downsample(', cls: '' },
      { text: '    leaf_size=0.05)', cls: '' },
      { text: 'print(f"降采样后: {down.size:,}")', cls: '' },
      { text: 'down.save("downsampled.las")', cls: '' },
    ],
  },
  {
    id: 'csf',
    label: '地面分离',
    desc: '分离地面点与地物点',
    lines: [
      { text: 'import pointworks as pw', cls: 'kw' },
      { text: '' },
      { text: '# 加载扫描数据', cls: 'comment' },
      { text: 'pcd = pw.load("city_scan.las")', cls: '' },
      { text: '' },
      { text: '# CSF 地面滤波', cls: 'comment' },
      { text: 'ground, objects = pcd.filter(', cls: '' },
      { text: '    method="csf",', cls: '' },
      { text: '    cloth_resolution=0.5)', cls: '' },
      { text: '' },
      { text: 'ground.save("ground.las")', cls: '' },
      { text: 'objects.save("objects.las")', cls: '' },
    ],
  },
  {
    id: 'outlier',
    label: '去噪处理',
    desc: '移除统计离群点',
    lines: [
      { text: 'import pointworks as pw', cls: 'kw' },
      { text: '' },
      { text: '# 加载含噪声点云', cls: 'comment' },
      { text: 'pcd = pw.load("noisy.las")', cls: '' },
      { text: '' },
      { text: '# 统计离群点移除', cls: 'comment' },
      { text: 'clean, _ = pcd.remove_outlier(', cls: '' },
      { text: '    nb_neighbors=20,', cls: '' },
      { text: '    std_ratio=2.0)', cls: '' },
      { text: '' },
      { text: 'print(f"移除 {pcd.size - clean.size} 个噪点")', cls: '' },
      { text: 'clean.save("clean.las")', cls: '' },
    ],
  },
];

export default function CodeDemoSplit() {
  const [activeExample, setActiveExample] = useState('voxel');
  const [isRunning, setIsRunning] = useState(false);
  const [hasRun, setHasRun] = useState(false);
  const timerRef = useRef(null);

  const current = examples.find((e) => e.id === activeExample);

  const handleRun = () => {
    if (isRunning) return;
    setIsRunning(true);
    timerRef.current = setTimeout(() => {
      setIsRunning(false);
      setHasRun(true);
    }, 1200);
  };

  const handleReset = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setIsRunning(false);
    setHasRun(false);
  };

  const handleSwitch = (id) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setIsRunning(false);
    setHasRun(false);
    setActiveExample(id);
  };

  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>代码驱动，所见即所得</h2>
      <p className={styles.sectionDesc}>选择用例，点击运行，实时查看处理效果</p>
      <div className={styles.splitContainer}>
        <div className={styles.editorPanel}>
          <div className={styles.editorHeader}>
            <div className={styles.windowDots}>
              <span className={styles.dotRed} />
              <span className={styles.dotYellow} />
              <span className={styles.dotGreen} />
            </div>
            <span className={styles.fileName}>demo.py</span>
            <div className={styles.editorHeaderRight} />
          </div>
          <div className={styles.exampleBar}>
            {examples.map((ex) => (
              <button
                key={ex.id}
                className={`${styles.exampleBtn} ${activeExample === ex.id ? styles.exampleBtnActive : ''}`}
                onClick={() => handleSwitch(ex.id)}
              >
                {ex.label}
              </button>
            ))}
          </div>
          <div className={styles.editorBody}>
            {current.lines.map((line, i) => (
              <div key={i} className={styles.codeLine}>
                <span className={styles.lineNum}>{i + 1}</span>
                <span className={`${styles.lineContent} ${line.cls || ''}`}>
                  {line.text || ' '}
                </span>
              </div>
            ))}
            <span className={styles.cursor} />
          </div>
          <div className={styles.actionBar}>
            <button
              className={`${styles.runBtn} ${isRunning ? styles.runBtnRunning : ''} ${hasRun ? styles.runBtnDone : ''}`}
              onClick={handleRun}
              disabled={isRunning || hasRun}
            >
              {isRunning && <span className={styles.spinner} />}
              {isRunning ? '处理中...' : hasRun ? '已完成' : '运行'}
            </button>
            <button
              className={styles.resetBtn}
              onClick={handleReset}
              disabled={isRunning}
            >
              重置
            </button>
          </div>
        </div>
        <div className={styles.previewPanel}>
          <Suspense fallback={<div className={styles.previewLoading}>加载 3D 预览...</div>}>
            <PointCloudDemo exampleId={activeExample} hasRun={hasRun} isRunning={isRunning} />
          </Suspense>
        </div>
      </div>
    </section>
  );
}
