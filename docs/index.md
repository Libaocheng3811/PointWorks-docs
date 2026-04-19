---
title: PointWorks - 专业三维点云处理软件
---

# PointWorks

专业三维点云处理软件，基于 Qt5 / VTK / PCL 构建。

提供点云可视化、滤波、分割、配准、变化检测、曲面重建等功能。

[:octicons-rocket-24: 快速开始](getting-started/index.md){ .md-button .md-button--primary }
[:octicons-mark-github-24: GitHub](https://github.com/TestDemoCommunity/CloudTool2){ .md-button }

---

## 核心特性

<div class="grid cards" markdown>

-   :material-eye:{ .lg .middle } **可视化**

    ---

    基于 VTK 的三维渲染引擎，八叉树 + LOD 自适应渲染，支持亿级点云流畅显示。

-   :material-filter:{ .lg .middle } **滤波处理**

    ---

    直通滤波、体素降采样、统计/半径离群点移除、条件滤波、网格最小值、局部最大值等。

-   :material-axis-arrow:{ .lg .middle } **配准**

    ---

    中心对齐、全局配准（IA-RANSAC）、精配准（ICP）、点对配准，满足多场景配准需求。

-   :material-scissors-cutting:{ .lg .middle } **分割**

    ---

    形状检测、形态学滤波、区域生长、欧式聚类、超体素等多种分割算法。

-   :material-compare:{ .lg .middle } **变化检测**

    ---

    云对云距离、云对网格距离计算，支持色度条与标量场可视化。

-   :material-cube-outline:{ .lg .middle } **曲面重建**

    ---

    曲面重建、凸包计算、边界提取，将点云转换为网格模型。

-   :material-terrain:{ .lg .middle } **地面分割**

    ---

    基于 CSF（布料模拟滤波）的地面点提取，支持植被分割。

-   :material-language-python:{ .lg .middle } **Python 脚本**

    ---

    内嵌 Python 3.9 解释器，通过 pybind11 暴露 API，支持自定义批处理脚本。

</div>

## 支持的格式

| 输入格式 | 输出格式 |
|----------|----------|
| LAS / LAZ | LAS / LAZ |
| PLY | PLY |
| PCD | PCD |
| E57 | — |
| TXT / XYZ | TXT / XYZ |
| OBJ | OBJ |
| STL | STL |
| VTK | VTK |

## 功能亮点

!!! info "八叉树 + LOD 渲染"
    采用自适应八叉树结构管理点云数据，结合 LOD（Level of Detail）渲染策略，在保持视觉质量的同时实现亿级点云的流畅交互。

!!! info "流式 I/O"
    支持大文件流式读取（50 万点/批），实时显示加载进度，突破内存限制处理超大规模点云。

!!! info "Python 脚本扩展"
    内嵌 Python 解释器 + 专用编辑器，可通过 Python API 调用点云处理功能，实现自动化批处理工作流。
