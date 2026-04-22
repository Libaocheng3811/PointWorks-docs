import React from 'react';
import Layout from '@theme/Layout';
import Hero from '@site/src/components/Hero';
import BentoGrid from '@site/src/components/BentoGrid';
import CodeDemoSplit from '@site/src/components/CodeDemoSplit';
import FormatTags from '@site/src/components/FormatTags';
import CTABlock from '@site/src/components/CTABlock';
import AnimatedSection from '@site/src/components/AnimatedSection';
import styles from './index.module.css';

export default function Home() {
  return (
    <Layout title="PointWorks - 专业三维点云处理软件" description="开源专业三维点云处理软件，支持可视化、滤波、配准、分割、变化检测">
      <main className={styles.page}>
        <Hero />

        <div className={styles.contentWrapper}>
          <div className={styles.featuresSection}>
            <AnimatedSection>
              <h2 className={styles.sectionTitle}>核心特性</h2>
              <p className={styles.sectionDesc}>一站式点云处理，从导入到分析</p>
            </AnimatedSection>
            <AnimatedSection>
              <BentoGrid />
            </AnimatedSection>
          </div>

          <AnimatedSection>
            <CodeDemoSplit />
          </AnimatedSection>

          <AnimatedSection>
            <FormatTags />
          </AnimatedSection>

          <div className={styles.sectionGap} />

          <AnimatedSection>
            <CTABlock />
          </AnimatedSection>
        </div>
      </main>
    </Layout>
  );
}
