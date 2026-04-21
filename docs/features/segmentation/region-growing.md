---
title: 区域生长分割
---

# 区域生长分割

基于区域生长算法的点云分割，通过比较相邻点的法线角度差（平滑度）、曲率和颜色等特征，将相似点聚成同一区域。支持自动种子选择和手动种子拾取两种策略。

## 入口路径

**菜单**: Segmentation > Region Growing

**源码**: `src/tool/segmentation/region_growing_dialog.h`

**算法**: `ct::Segmentation::RegionGrowing()` / `RegionGrowingRGB()` / `RegionGrowingFromSeed()`

## 参数说明

### 搜索设置

| 参数 | 控件 | 说明 |
|------|------|------|
| Number of Neighbours | SpinBox | KNN 搜索的邻居数量，用于计算局部法线和确定相邻点 |

### 生长判据

| 参数 | 控件 | 说明 |
|------|------|------|
| Smoothness (启用/禁用) | CheckBox + Slider + DoubleSpinBox | 平滑度约束：相邻点法线夹角阈值（度），值越小区域越均匀 |
| Curvature (启用/禁用) | CheckBox + DoubleSpinBox | 曲率测试：曲率超过阈值的点不加入区域 |
| Residual (启用/禁用) | CheckBox + DoubleSpinBox | 残差测试：点到区域拟合平面的距离阈值 |

### 颜色模式参数

当启用颜色测试时，自动切换到 `RegionGrowingRGB` 算法：

| 参数 | 控件 | 说明 |
|------|------|------|
| Point Color Threshold | DoubleSpinBox | 两个相邻点之间的颜色差阈值 |
| Region Color Threshold | DoubleSpinBox | 两个区域之间的颜色差阈值（用于区域合并） |
| Distance Threshold | DoubleSpinBox | 种子点与候选点之间的距离阈值 |
| Color Neighbors | SpinBox | 查找相邻段时使用的邻居数 |

### 种子策略

| 参数 | 控件 | 说明 |
|------|------|------|
| Auto | RadioButton | 自动模式：按曲率从小到大选取种子点 |
| Manual | RadioButton | 手动模式：在 3D 视图中拾取种子点 |
| Pick Seed | Button | 手动模式下点击后在视图中拾取种子点 |

### 输出设置

| 参数 | 控件 | 说明 |
|------|------|------|
| Min Cluster Size | SpinBox | 有效区域的最小点数 |
| Max Cluster Size | SpinBox | 有效区域的最大点数 |
| Split | CheckBox | 是否将每个区域拆分为独立点云 |

## 操作步骤

### 自动模式

1. 选中点云后打开 Region Growing 对话框
2. 设置 **Number of Neighbours**（建议 20~50）
3. 启用 **Smoothness** 并设置角度阈值（典型值 3~10 度）
4. 根据需要启用 Curvature 和 Residual 约束
5. 设置 Min/Max Cluster Size 过滤过大或过小的区域
6. 点击 **Apply** 执行分割

### 手动种子模式

1. 选中 **Manual** 种子模式
2. 点击 **Pick Seed** 进入拾取状态
3. 在 3D 视图中点击目标位置选取种子点
4. 种子信息将显示在对话框中
5. 配置生长参数后点击 **Apply**

> 使用手动种子模式时，将调用 `RegionGrowingFromSeed()` 从指定种子点开始生长，适合提取特定局部区域。

> 若启用颜色测试（勾选 Color），算法将自动切换为 `RegionGrowingRGB`，同时考虑空间邻近性和颜色相似性，适合彩色点云分割。
