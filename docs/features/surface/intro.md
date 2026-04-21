---
title: 曲面重建
---

# 曲面重建

曲面重建是将离散点云转换为连续三角网格模型的过程。PointWorks 提供多种重建算法，适用于不同类型的点云数据和应用场景。相关工具位于菜单栏 **Mesh** 下。

## 功能概览

| 工具 | 菜单路径 | 说明 |
|------|----------|------|
| 曲面重建 | Mesh > Reconstruct Surface | 多种算法的曲面重建（Poisson / Greedy / Marching Cubes / Grid Projection） |
| 凸包计算 | Mesh > Compute Hull | 计算点云的凸包或凹包 |
| 边界提取 | Mesh > Extract Boundary | 提取点云的边界点或边界线 |

## 算法选择指南

| 算法 | 适用场景 | 是否需要法线 | 输出特点 |
|------|----------|--------------|----------|
| Poisson | 均匀采样的封闭曲面 | 需要 | 水密封闭网格 |
| Greedy Triangulation | 有序/均匀点云 | 建议 | 局部三角化 |
| Marching Cubes (RBF) | 体素化数据 | 不需要 | 规则网格等值面 |
| Marching Cubes (Hoppe) | 有法线的数据 | 需要 | 切平面等值面 |
| Grid Projection | 通用场景 | 不需要 | 网格投影面 |

> Poisson 和 Greedy Triangulation 算法要求点云包含法线信息。若点云无法线，对话框将显示警告提示，请先通过 Edit > Normals 进行法线估计。

## 相关文档

- [曲面重建](reconstruction)
- [凸包计算](convex-hull)
- [边界提取](boundary)
