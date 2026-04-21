---
title: 聚类分割
---

# 聚类分割

提供三种聚类算法对点云进行无监督分割，包括经典的欧式聚类、DBSCAN 密度聚类和 K-Means 划分聚类。支持基于位置、法线和颜色的多维加权聚类。

## 入口路径

**菜单**: Segmentation > Clustering

**源码**: `src/tool/segmentation/clustering_dialog.h`

**算法**: `ct::Segmentation::EuclideanClusterExtraction()` / `DBSCANClusterExtraction()` / `KMeansClusterExtraction()`

## 算法选择与参数

通过下拉框 **Algorithm** 切换聚类算法，参数面板随之变化。

### 欧式聚类 (Euclidean)

基于 L2 欧几里得距离的空间聚类，将空间上邻近的点聚为一类。

| 参数 | 控件 | 默认值 | 说明 |
|------|------|--------|------|
| Tolerance | DoubleSpinBox | — | 空间聚类容差（米），两点距离小于此值视为邻居 |
| Min Cluster Size | SpinBox | — | 有效聚类的最小点数 |
| Max Cluster Size | SpinBox | — | 有效聚类的最大点数 |

### DBSCAN

基于密度的聚类算法，能够发现任意形状的簇并标记噪声点。

| 参数 | 控件 | 默认值 | 说明 |
|------|------|--------|------|
| Eps | DoubleSpinBox | — | 邻域半径（epsilon），核心点的搜索范围 |
| Min Points | SpinBox | — | 核心点所需的最少邻居数量 |

### K-Means

基于划分的聚类算法，将点云划分为 K 个簇。

| 参数 | 控件 | 默认值 | 说明 |
|------|------|--------|------|
| K | SpinBox | — | 目标聚类数量 |
| Max Iterations | SpinBox | — | 最大迭代次数 |

### 多维权重（DBSCAN 和 K-Means 可用）

勾选 **Normal** 或 **Color** 维度后，可设置各维度的权重：

| 参数 | 控件 | 说明 |
|------|------|------|
| Position Weight | Slider + DoubleSpinBox | 位置距离的权重 |
| Normal Weight | Slider + DoubleSpinBox | 法线距离的权重（勾选 Normal 后可用） |
| Color Weight | Slider + DoubleSpinBox | 颜色距离的权重（勾选 Color 后可用） |

> 权重总和自动归一化。调节某个权重时，其他权重会按比例自动调整。

### 输出

| 参数 | 控件 | 说明 |
|------|------|------|
| Split | CheckBox | 是否将每个聚类拆分为独立点云 |

## 操作步骤

1. 选中点云后打开 Clustering 对话框
2. 从 **Algorithm** 下拉框选择聚类算法
3. 根据算法设置对应参数：
   - 欧式聚类：Tolerance 通常设为点间距的 2~3 倍
   - DBSCAN：Eps 根据点密度调整，Min Points 建议 5~10
   - K-Means：K 值为目标分割数量
4. 如需考虑法线或颜色，勾选对应维度并调整权重
5. 点击 **Apply** 执行聚类

> **聚类数量提示**: 欧式聚类和 DBSCAN 的聚类数量由算法自动确定，而 K-Means 需要预先指定 K 值。若不确定合适的 K 值，建议先用欧式聚类了解数据的空间分布。
