---
title: 曲面重建
---

# 曲面重建

提供四种曲面重建算法将点云转换为三角网格模型。支持预览和正式计算两种模式，预览模式可快速查看重建效果。

## 入口路径

**菜单**: Mesh > Reconstruct Surface

**源码**: `src/tool/mesh/reconstruct_surface_dialog.h`

**算法**: `ct::Surface::Poisson()` / `GreedyProjectionTriangulation()` / `MarchingCubesRBF()` / `GridProjection()`

## 算法参数

通过 **Algorithm** 下拉框切换重建算法，参数面板随之变化。

### Poisson 重建

基于泊松方程的隐式曲面重建，生成水密封闭网格。

| 参数 | 控件 | 说明 |
|------|------|------|
| Depth | SpinBox | 八叉树最大深度（默认 8），值越大数据越精细，计算量指数增长 |
| Min Depth | SpinBox | 最小深度 |
| Point Weight | DoubleSpinBox | 点的权重参数 |
| Scale | DoubleSpinBox | 重建立方体直径与采样边界立方体直径之比 |
| Solver Divide | SpinBox | 块 Gauss-Seidel 求解器深度 |
| Iso Divide | SpinBox | 块等值面提取器深度 |
| Samples per Node | DoubleSpinBox | 八叉树叶节点内最小采样点数 |
| Confidence | CheckBox | 置信度标志 |
| Manifold | CheckBox | 歧管标志 |

### Greedy 三角剖分

基于局部 2D 投影的贪心三角化算法，适合有法线的均匀点云。

| 参数 | 控件 | 说明 |
|------|------|------|
| Search Radius | DoubleSpinBox | 最近邻搜索半径 |
| Mu | DoubleSpinBox | 最近邻距离乘数，用于确定搜索范围 |
| Max Neighbors | SpinBox | 最大近邻数量 |
| Min Angle | DoubleSpinBox | 三角形最小角度（度） |
| Max Angle | DoubleSpinBox | 三角形最大角度（度） |
| EPS Angle | DoubleSpinBox | 法线偏差阈值，超过此值不进行三角化 |
| Consistent | CheckBox | 输入法线方向是否一致 |

### Marching Cubes (RBF)

基于径向基函数 (RBF) 的有符号距离函数等值面提取。

| 参数 | 控件 | 说明 |
|------|------|------|
| Iso Level | DoubleSpinBox | 等值面级别 |
| Grid Resolution | SpinBox | 网格分辨率 |
| Percentage | DoubleSpinBox | 边界框扩展比例 |
| Epsilon | DoubleSpinBox | 离面点位移值 |

### Grid Projection

基于网格投影的曲面重建。

| 参数 | 控件 | 说明 |
|------|------|------|
| Resolution | DoubleSpinBox | 网格单元大小 |
| Padding Size | SpinBox | 填充区域大小 |
| K | SpinBox | K 近邻数量 |

### 通用参数

| 参数 | 控件 | 说明 |
|------|------|------|
| Extract Boundary | CheckBox | 是否同时提取网格边界 |
| Downsample Rate (Preview) | DoubleSpinBox | 预览时的下采样率，加速预览 |

## 操作步骤

1. 选中点云后打开 Reconstruct Surface 对话框
2. 从 **Algorithm** 选择重建算法
3. 设置对应参数
4. 点击 **Preview** 快速预览效果（使用下采样加速）
5. 满意后点击 **Apply** 以完整数据执行重建
6. 可点击 **Cancel** 取消正在执行的任务
7. 点击 **Close** 关闭对话框并清理预览数据

> Poisson 重建是最常用的算法，**Depth** 是最关键的参数。Depth=8 适合大多数场景，Depth=10 或更高适合精细重建，但计算时间和内存消耗会大幅增加。

> 对话框顶部会显示法线警告：若所选算法需要法线但点云无法线数据，将提示用户先进行法线估计。
