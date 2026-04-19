# 形状检测

基于 Sample Consensus (SAC) 算法从点云中检测并提取几何基元，包括平面、球体、圆柱体和圆锥体。支持使用法线信息提高拟合精度。

## 入口路径

**菜单**: Segmentation > Shape Detection

**源码**: `src/tool/segmentation/shape_detection_dialog.h`

**算法**: `ct::Segmentation::SACSegmentation()` / `SACSegmentationFromNormals()`

## 参数说明

### 目标形状

| 参数 | 说明 |
|------|------|
| Plane | 平面检测 |
| Sphere | 球体检测 |
| Cylinder | 圆柱体检测 |
| Cone | 圆锥体检测 |

### 拟合参数

| 参数 | 控件 | 默认值 | 说明 |
|------|------|--------|------|
| Distance Threshold | DoubleSpinBox | — | 到模型的距离阈值，距离小于此值的点被视为内点 |
| Probability | DoubleSpinBox | — | 至少选择一个无离群点样本的概率 |

### 高级参数

| 参数 | 控件 | 说明 |
|------|------|------|
| Use Normals | CheckBox | 是否使用法线辅助拟合 |
| Distance Weight | DoubleSpinBox | 点法线与平面法线间角度距离的权重 (0~1) |
| Distance from Origin | DoubleSpinBox | 期望平面模型到原点的距离 |
| Optimize Coefficients | CheckBox | 是否对模型系数进行优化精化 |

### 半径范围

| 参数 | 控件 | 说明 |
|------|------|------|
| Min Radius | DoubleSpinBox | 模型最小允许半径（适用于球/圆柱/圆锥） |
| Max Radius | DoubleSpinBox | 模型最大允许半径 |

### 方法与迭代

| 参数 | 控件 | 说明 |
|------|------|------|
| Method | ComboBox | SAC 采样方法（如 RANSAC、LMEDS、MSAC、RRANSAC 等） |
| Max Iterations | SpinBox | 最大迭代次数 |

### 输出选项

| 参数 | 控件 | 说明 |
|------|------|------|
| Colorize | CheckBox | 用颜色标记内点/外点 |
| Split Inlier | CheckBox | 将内点单独提取为新点云 |
| Create Mesh | CheckBox | 根据拟合结果创建网格（灰显，预留） |

## 操作步骤

1. 选中点云后打开 Shape Detection 对话框
2. 选择目标形状类型（Plane / Sphere / Cylinder / Cone）
3. 设置 Distance Threshold（距离阈值），该值直接影响内点数量
4. 根据需要调整 Method 和 Max Iterations
5. 如需使用法线辅助，勾选 Use Normals 并设置 Distance Weight
6. 对于球/圆柱/圆锥，可设置半径范围约束
7. 点击 **Apply** 执行检测

> 当勾选 **Use Normals** 时，将调用 `SACSegmentationFromNormals` 算法，此时点云必须已包含法线数据。若点云无法线，请先通过 Edit > Normals 进行法线估计。

## 输出

分割完成后，内点和外点将根据输出选项生成对应的点云并添加到 CloudTree。同时，拟合的模型系数（如平面方程 `ax+by+cz+d=0`、球心坐标与半径等）将通过控制台输出。
