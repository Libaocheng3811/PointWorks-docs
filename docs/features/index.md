# 功能总览

PointWorks 提供了一套完整的点云数据处理功能，涵盖从数据导入到分析可视化的全流程。以下按模块列出所有核心功能及其简要说明。

## 功能模块

### [数据管理](data-management/index.md)

负责点云和网格文件的导入、导出与项目管理。

| 功能 | 说明 |
|------|------|
| [文件格式支持](data-management/file-formats.md) | 支持 LAS/LAZ、PLY、PCD、E57、TXT、OBJ、STL、VTK 等格式 |
| [导入导出](data-management/import-export.md) | 点云与网格的加载、保存、批量操作 |
| [项目文件](data-management/project-files.md) | 工作区状态保存、多点云管理、最近项目列表 |

### [可视化](visualization/index.md)

基于 VTK 的高性能三维点云渲染引擎。

| 功能 | 说明 |
|------|------|
| [三维视图操作](visualization/view-controls.md) | 旋转、平移、缩放、聚焦、视点切换 |
| [颜色显示模式](visualization/color-modes.md) | RGB 原色、标量场、分类着色、高度渲染等 |
| [显示设置](visualization/display-settings.md) | 点大小、背景色、包围盒颜色等全局设置 |

### [滤波](filtering/index.md)

点云噪声去除与降采样处理。

| 功能 | 说明 |
|------|------|
| 体素降采样 | 按体素网格均匀降采样 |
| 统计离群点移除 | 基于邻域统计的噪声滤除 |
| 半径离群点移除 | 基于邻域半径的噪声滤除 |
| 直通滤波 | 按坐标轴范围裁剪 |

### [地面分割](ground-segmentation/index.md)

基于 CSF（布料模拟）算法的地面点自动提取。

### [植被分割](vegetation/index.md)

基于多种植被指数（ExG、ExR、NGRDI、CIVE）与 Otsu 自动阈值的植被点分割。

### [点云配准](registration/index.md)

多站点云的粗配准与精配准对齐。

### [点云分割](segmentation/index.md)

区域生长、欧式聚类、形态学滤波等分割功能。

### [变化检测](change-detection/index.md)

基于多期点云距离计算的变化区域提取与可视化。

### [曲面重建](surface/index.md)

点云到网格的曲面重建与边界提取。

### [距离计算](distance/index.md)

点到点云、点到网格等多种距离计算方式。

### [深度图](range-image/index.md)

由点云生成深度图，支持边界提取与法线估计。

### [测量](measure/index.md)

点云距离、角度等几何测量工具。

### [编辑](editing/index.md)

颜色设置、坐标变换、法线编辑、包围盒操作等编辑功能。

!!! tip "快速上手"
    如果你是第一次使用 PointWorks，建议先阅读 [数据管理](data-management/index.md) 了解如何导入数据，再通过 [可视化](visualization/index.md) 熟悉视图操作。

## 性能特性

PointWorks 针对大规模点云做了深度优化：

- **八叉树空间索引**：自适应分块，单块最大 6 万点
- **流式 I/O**：批量加载（每批 50 万点），内存峰值可控
- **动态 LOD**：交互时降低精度，静止时恢复精细渲染
- **视锥剔除**：仅渲染当前视野内的数据
- **全局坐标偏移**：自动处理 UTM 大坐标的 GPU 精度问题

## 相关主题

- [快速入门](../getting-started/index.md) -- 安装与基本操作
- [开发指南](../development/index.md) -- 架构设计与扩展开发
