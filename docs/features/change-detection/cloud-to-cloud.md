# 云对云距离

计算两个点云之间的逐点距离，支持三种距离计算方法。距离结果以标量场的形式存储在点云中，可通过色度条进行可视化。

## 入口路径

**菜单**: Distance > Cloud to Cloud

**源码**: `src/tool/distance/cloud_cloud_dist_dialog.h`

**算法**: `ct::DistanceCalculator::calculateC2C()`

## 距离计算方法

### 最近邻距离 (Nearest Neighbor)

对源点云中的每个点，在目标点云中找到距离最近的点，两点之间的欧氏距离即为该点的距离值。

| 参数 | 控件 | 说明 |
|------|------|------|
| Source Cloud | ComboBox | 选择源点云 |
| Target Cloud | ComboBox | 选择目标点云 |

### K 近邻平均距离 (KNN Mean)

对源点云中的每个点，找到目标点云中最近的 K 个邻居，取这 K 个距离的平均值。

| 参数 | 控件 | 说明 |
|------|------|------|
| K | SpinBox | 近邻数量（默认 6） |

### 半径内平均距离 (Radius Mean)

对源点云中的每个点，统计目标点云中位于搜索半径内的所有点，取平均距离。

| 参数 | 控件 | 说明 |
|------|------|------|
| Radius | DoubleSpinBox | 搜索半径（米） |

### 通用参数

| 参数 | 控件 | 说明 |
|------|------|------|
| Limit Distance | CheckBox | 是否启用最大距离限制 |
| Max Distance | DoubleSpinBox | 超过此距离的点标记为 NaN |
| Color Map | CheckBox | 是否用色度条着色显示距离 |
| Field Name | LineEdit | 标量场名称（自定义存储名称） |

## 操作步骤

1. 打开 Distance > Cloud to Cloud 对话框
2. 从下拉框选择 **Source Cloud**（待计算的点云）
3. 从下拉框选择 **Target Cloud**（参考点云）
4. 选择距离计算方法（Nearest / KNN / Radius）
5. 根据方法设置对应参数
6. 可选：勾选 **Limit Distance** 并设置最大距离
7. 勾选 **Color Map** 以色度条方式显示结果
8. 点击 **Compute** 开始计算

> **方法选择建议**: 一般变化检测使用 **Nearest Neighbor** 即可。KNN Mean 适合对距离值做平滑处理，Radius Mean 适合评估局部密度差异。

## 输出

距离计算结果以标量场的形式存储在源点云中，每个点对应一个距离值。若勾选 Color Map，点云将按距离值用 Jet 色带着色显示。
