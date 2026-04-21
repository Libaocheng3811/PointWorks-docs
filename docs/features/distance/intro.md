---
title: 距离计算
---

# 距离计算

PointWorks 提供多种距离计算工具，用于量化点云之间、点云与网格之间、点云与几何基元之间的空间偏差。距离计算是变化检测、质量检验和配准评估的基础操作。

## 功能概览

| 工具 | 菜单路径 | 说明 |
|------|----------|------|
| 云对云距离 | Distance > Cloud to Cloud | 两个点云之间的逐点距离 |
| 云对网格距离 | Distance > Cloud to Mesh | 点云到三角网格的距离 |
| 云对基元距离 | Distance > Cloud to Primitive | 点云到几何基元（平面/球/圆柱/圆锥）的距离 |
| 最近点集 | Distance > Closest Point Set | 提取目标点云中距离源点云最近的点集 |

## 距离计算方法

### 云对云 (C2C)

| 方法 | 说明 |
|------|------|
| Nearest Neighbor | 最近邻距离，每个点到目标点云最近点的距离 |
| KNN Mean | K 近邻平均距离，对距离值做平滑 |
| Radius Mean | 半径内平均距离，评估局部密度差异 |

### 云对网格 (C2M)

| 方法 | 说明 |
|------|------|
| Signed Distance | 有符号距离，正=外侧，负=内侧 |
| Unsigned Distance | 无符号距离，绝对值 |

### 云对基元 (C2P)

| 基元类型 | 说明 |
|----------|------|
| Plane | 到平面 ax + by + cz + d = 0 的距离 |
| Sphere | 到球面的距离 |
| Cylinder | 到圆柱面的距离 |
| Cone | 到圆锥面的距离 |

## 通用参数

| 参数 | 说明 |
|------|------|
| Max Distance | 最大搜索距离限制，超出标记为 NaN |
| Search Method | 搜索方法：Octree 或 KDTree |
| Color Map | 是否使用色度条着色 |
| Field Name | 标量场存储名称 |

## 输出

距离计算结果以标量场 (Scalar Field) 形式存储在源点云中。每个点对应一个浮点距离值。可通过色度条 (Scalar Bar) 进行可视化。
