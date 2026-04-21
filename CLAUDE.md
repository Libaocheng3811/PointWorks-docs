# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

PointWorks official documentation site built with **MkDocs Material**. Documents a professional 3D point cloud processing desktop application (Qt5/VTK/PCL). All content is written in **Chinese (Simplified)**. Deployed to GitHub Pages at `https://testdemocommunity.github.io/PointWorks-docs/`.

Related code repository: [CloudTool2](https://github.com/TestDemoCommunity/CloudTool2)

## Commands

```bash
# Install dependencies
pip install -r requirements.txt

# Local dev server (auto-reloads on file changes, http://127.0.0.1:8000)
mkdocs serve

# Production build (output to site/)
mkdocs build
```

No JS tooling, no Makefile, no package.json — pure Python/MkDocs project.

## Architecture

**Single config file**: `mkdocs.yml` — controls site metadata, navigation tree, theme settings, plugins, and markdown extensions.

**Content lives in `docs/`**: Markdown files following the `nav` structure defined in `mkdocs.yml`. Major sections: `getting-started/`, `features/` (largest, 15+ sub-modules), `tutorials/`, `advanced/`, `development/`, `blog/`.

**Custom theming** via `docs/overrides/` (Jinja2 template overrides for banner and footer) and `docs/stylesheets/extra.css` (grid cards, responsive video, table sizing).

**Assets**: Images go in `docs/assets/images/`, logo at `docs/assets/images/logo.svg`.

**Build output**: `site/` directory (gitignored).

## Key Conventions

- Each feature doc follows a standard structure: overview, entry path, parameters, step-by-step usage, tips
- Markdown uses MkDocs Material extensions (admonitions `!!!`, code blocks with line numbers, task lists, tabbed content, emoji via twemoji, Mermaid diagrams)
- Math rendering via MathJax v3 (LaTeX syntax in `$...$` or `$$...$$`)
- Plugin `git-revision-date-localized` shows page creation and modification dates
- Blog section at `docs/blog/` is used for changelog/release notes

## CI/CD

`.github/workflows/deploy.yml`: On push to `main`, builds with `mkdocs build` and deploys to GitHub Pages. Concurrency-limited to one deployment at a time.

## Migration Note

`planDocs/Docusaurus迁移实施方案.md` contains a detailed plan to migrate from MkDocs Material to Docusaurus. This is a planning document only — the active system is MkDocs.
