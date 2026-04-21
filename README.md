# PointWorks Docs

PointWorks 官方文档与网站源码，使用 [Docusaurus 3](https://docusaurus.io/) 构建，通过 GitHub Pages 部署。

## 本地预览

```bash
# 安装依赖
npm install

# 启动开发服务器
npm start
```

浏览器访问 `http://localhost:3000` 即可预览。

## 构建生产版本

```bash
npm run build
```

构建产物输出到 `build/` 目录。

## 项目结构

```
├── docs/                  # 文档内容（Markdown）
│   ├── intro.md           # 文档首页
│   ├── getting-started/   # 快速开始
│   ├── features/          # 功能说明
│   ├── tutorials/         # 教程
│   ├── advanced/          # 进阶主题
│   └── development/       # 开发指南
├── src/
│   ├── pages/             # 自定义页面（首页、下载、功能等）
│   ├── components/        # React 组件
│   ├── hooks/             # 自定义 Hooks
│   ├── theme/             # 主题覆盖（404 页面等）
│   └── css/               # 全局样式
├── static/                # 静态资源（图片、robots.txt）
├── blog/                  # 博客/更新日志
├── docusaurus.config.js   # 站点配置
└── sidebars.js            # 文档侧边栏
```

## 编写规范

- 文档使用 MDX 格式编写，支持 [Docusaurus Markdown](https://docusaurus.io/docs/markdown-features)
- 图片放在 `static/img/` 下对应子目录
- 每个功能文档包含：概述、入口路径、参数说明、操作步骤、提示

## 贡献

1. Fork 本仓库
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

## 相关仓库

- [CloudTool2](https://github.com/TestDemoCommunity/CloudTool2) — PointWorks 主代码仓库
