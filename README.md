# PointWorks Docs

PointWorks 官方文档与网站源码，使用 [MkDocs Material](https://squidfunk.github.io/mkdocs-material/) 构建，通过 GitHub Pages 部署。

## 本地预览

```bash
# 安装依赖
pip install -r requirements.txt

# 启动本地服务器
mkdocs serve
```

浏览器访问 `http://127.0.0.1:8000` 即可预览。

## 文档结构

```
docs/
├── index.md                  # 官网首页
├── getting-started/          # 快速开始
├── features/                 # 功能说明
├── tutorials/                # 教程
├── advanced/                 # 进阶主题
├── development/              # 开发指南
├── blog/                     # 更新日志
├── assets/                   # 图片等资源
├── stylesheets/              # 自定义样式
└── overrides/                # 自定义模板
```

## 编写规范

- 文档使用 Markdown 编写，遵循 [MkDocs Material 扩展语法](https://squidfunk.github.io/mkdocs-material/reference/)
- 图片放在 `docs/assets/images/` 下对应的子目录
- 每个功能文档包含：概述、入口路径、参数说明、操作步骤、提示

## 贡献

1. Fork 本仓库
2. 创建功能分支
3. 提交 Pull Request

## 相关仓库

- [CloudTool2](https://github.com/TestDemoCommunity/CloudTool2) — PointWorks 主代码仓库
