---
title: 点云分割
---

# 点云分割

点云分割是 PointWorks 的核心功能模块之一，提供多种分割算法将点云按空间、形状、颜色等特征划分为有意义的子集。所有分割工具位于菜单栏 **Segmentation** 下，算法实现位于 `libs/algorithm/segmentation.h`，对话框位于 `src/tool/segmentation/`。

## 功能概览

| 工具 | 菜单路径 | 说明 |
|------|----------|------|
| 形状检测 | Segmentation > Shape Detection | 基于 RANSAC 的平面、球体、圆柱、圆锥拟合 |
| 形态学滤波 | Segmentation > Morphological Filter | 渐进形态学地面/非地面分割 |
| 区域生长 | Segmentation > Region Growing | 基于平滑度、曲率、颜色的区域生长分割 |
| 聚类分割 | Segmentation > Clustering | 欧式聚类、DBSCAN、K-Means 聚类 |
| 超体素 | Segmentation > Supervoxel | 基于体素结构、法线和颜色的超体素分割 |

## 通用工作流

1. 在点云树 (CloudTree) 中选中目标点云
2. 从菜单栏打开对应的分割对话框
3. 调整参数并预览（如果支持）
4. 点击 **Apply** 执行分割
5. 分割结果以新点云的形式添加到点云树中

> 所有分割算法均在后台线程执行，不会阻塞主界面。执行过程中可通过进度条或 **Cancel** 按钮取消操作。

## 相关文档

- [形状检测](shape-detection)
- [形态学滤波](morphological)
- [区域生长分割](region-growing)
- [聚类分割](clustering)
- [超体素分割](supervoxel)
