import React, { useState } from 'react';
import Layout from '@theme/Layout';
import Head from '@docusaurus/Head';
import styles from './faq.module.css';

const faqData = [
  {
    q: 'PointWorks 是免费的吗？',
    a: '是的，PointWorks 是完全免费的开源软件，采用 MIT 许可证。你可以自由用于商业和学术用途。',
  },
  {
    q: '支持哪些操作系统？',
    a: '目前支持 Windows 10/11（x64）。macOS 和 Linux 版本正在开发中。',
  },
  {
    q: '能处理多大的点云数据？',
    a: 'PointWorks 采用八叉树索引和流式 I/O 技术，理论上可以处理数百 GB 的点云数据。实际性能取决于硬件配置（内存和显卡）。对于超大点云，建议使用大点云支持功能（全局坐标偏移 + 流式加载）。',
  },
  {
    q: '支持哪些点云格式？',
    a: '支持 LAS、LAZ（压缩）、PLY、PCD、E57、TXT、OBJ、STL、VTK 等主流格式，共计 9 种。',
  },
  {
    q: '如何使用 Python 脚本自动化处理？',
    a: 'PointWorks 内嵌 Python 3.9 控制台，支持通过 pybind11 调用软件的全部 C++ 功能。你可以编写 Python 脚本实现批量导入、滤波、配准等自动化工作流。详见文档中的 Python 脚本章节。',
  },
  {
    q: '如何报告 Bug 或建议新功能？',
    a: '请通过 GitHub Issues 提交：https://github.com/Libaocheng3811/CloudTool2/issues 。提交时请附上软件版本、操作系统和复现步骤。',
  },
  {
    q: 'PointWorks 和 CloudCompare 有什么区别？',
    a: 'CloudCompare 是一款通用的 3D 点云和网格处理软件。PointWorks 专注于点云处理领域，提供了更丰富的滤波算法（7 种）、专业的配准流程（IA-RANSAC + ICP）、地面分割（CSF）、变化检测以及内嵌 Python 脚本支持。',
  },
  {
    q: '是否支持插件开发？',
    a: 'PointWorks 支持通过 Python 脚本进行功能扩展。C++ 插件开发接口正在规划中，详见文档的开发指南章节。',
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState(null);

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqData.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };

  return (
    <Layout title="常见问题 - PointWorks" description="PointWorks 常见问题解答">
      <Head>
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      </Head>
      <main className={styles.page}>
        <div className={styles.hero}>
          <h1 className={styles.heroTitle}>常见问题</h1>
          <p className={styles.heroDesc}>关于 PointWorks 的高频问题</p>
        </div>

        <div className={styles.faqList}>
          {faqData.map((item, i) => (
            <div key={i} className={styles.faqItem}>
              <button
                className={styles.question}
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                aria-expanded={openIndex === i}
              >
                <span>{item.q}</span>
                <span className={`${styles.icon} ${openIndex === i ? styles.iconOpen : ''}`}>
                  ▾
                </span>
              </button>
              <div className={`${styles.answer} ${openIndex === i ? styles.answerOpen : ''}`}>
                <div className={styles.answerContent}>{item.a}</div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </Layout>
  );
}
