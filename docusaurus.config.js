import { themes as prismThemes } from 'prism-react-renderer';

export default {
  title: 'PointWorks',
  tagline: '专业三维点云处理软件',
  url: 'https://libaocheng3811.github.io',
  baseUrl: '/PointWorks-docs/',
  favicon: 'img/favicon.svg',
  trailingSlash: false,
  organizationName: 'Libaocheng3811',
  projectName: 'PointWorks-docs',
  deploymentBranch: 'gh-pages',

  i18n: {
    defaultLocale: 'zh',
    locales: ['zh'],
  },

  headTags: [
    {
      tagName: 'script',
      attributes: { type: 'application/ld+json' },
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'PointWorks',
        applicationCategory: 'DesktopApplication',
        operatingSystem: 'Windows',
        description: '专业三维点云处理软件',
        softwareVersion: '0.1.0',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'CNY' },
        programmingLanguage: 'C++',
      }),
    },
    {
      tagName: 'script',
      attributes: { type: 'application/ld+json' },
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'PointWorks',
        logo: 'https://libaocheng3811.github.io/PointWorks-docs/img/logo.svg',
        sameAs: ['https://github.com/Libaocheng3811/CloudTool2'],
      }),
    },
  ],

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.js',
          editUrl: 'https://github.com/Libaocheng3811/PointWorks-docs/edit/main/',
          showLastUpdateAuthor: true,
          showLastUpdateTime: true,
        },
        blog: {
          showReadingTime: true,
          blogTitle: '更新日志',
          blogDescription: 'PointWorks 版本更新和技术文章',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
        sitemap: {
          changefreq: 'weekly',
          priority: 0.5,
          filename: 'sitemap.xml',
        },
        gtag: false,
      },
    ],
  ],

  plugins: [require.resolve('@easyops-cn/docusaurus-search-local')],

  themes: ['@docusaurus/theme-mermaid'],

  onBrokenLinks: 'warn',

  markdown: {
    format: 'mdx',
    hooks: {
      onBrokenMarkdownImages: 'warn',
      onBrokenMarkdownLinks: 'warn',
    },
  },

  themeConfig: {
    image: 'img/og-image.png',
    metadata: [
      { name: 'keywords', content: '点云, point cloud, 三维, 3D, VTK, PCL, Qt, LAS, LAZ, 点云处理, 点云软件' },
      { name: 'description', content: 'PointWorks - 开源专业三维点云处理软件，支持可视化、滤波、配准、分割、变化检测' },
      { property: 'og:type', content: 'website' },
      { property: 'og:locale', content: 'zh_CN' },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],

    colorMode: {
      defaultMode: 'dark',
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },

    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['python', 'cpp', 'cmake', 'bash'],
    },

    navbar: {
      title: 'PointWorks',
      logo: { alt: 'PointWorks', src: 'img/logo.svg' },
      items: [
        { type: 'docSidebar', sidebarId: 'defaultSidebar', label: '文档', position: 'left' },
        { to: '/download', label: '下载', position: 'left' },
        { to: '/features', label: '功能', position: 'left' },
        { to: '/community', label: '社区', position: 'left' },
        { href: 'https://github.com/Libaocheng3811/CloudTool2', label: 'GitHub', position: 'right' },
      ],
    },

    tableOfContents: {
      minHeadingLevel: 2,
      maxHeadingLevel: 3,
    },

    docs: {
      sidebar: {
        hideable: true,
        autoCollapseCategories: true,
      },
    },

    footer: {
      style: 'dark',
      links: [
        {
          title: '产品',
          items: [
            { label: '功能介绍', to: '/features' },
            { label: '下载', to: '/download' },
            { label: '更新日志', to: '/blog' },
          ],
        },
        {
          title: '文档',
          items: [
            { label: '快速开始', to: '/docs/getting-started/intro' },
            { label: '功能说明', to: '/docs/features/intro' },
            { label: '教程', to: '/docs/tutorials/intro' },
            { label: 'Python 脚本', to: '/docs/advanced/python-scripting/intro' },
          ],
        },
        {
          title: '社区',
          items: [
            { label: 'GitHub', href: 'https://github.com/Libaocheng3811/CloudTool2' },
            { label: '常见问题', to: '/faq' },
            { label: '贡献指南', to: '/community' },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} PointWorks Team. Built with Docusaurus.`,
    },
  },
};
