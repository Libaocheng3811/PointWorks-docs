---
title: 地面滤波实战
---

# 地面滤波实战

本教程介绍如何使用 PointWorks 的 CSF（布料模拟滤波）插件从原始点云中提取地面点。

## 概述

地面滤波是 LiDAR 点云处理的基础步骤，广泛用于：

- 数字高程模型（DEM）生成
- 地形分析
- 建筑物提取
- 植被高度计算

PointWorks 内置 **CSF（Cloth Simulation Filter）** 算法，该算法通过模拟一块虚拟布料从上方落下到点云表面，布料的最终形状即为地面。

:::info[CSF 算法原理]
CSF 由 Zhang 等人（2016）提出，核心思想是将地形表面视为一块"布料"，通过物理模拟（重力、碰撞、刚度）让布料贴合最低点，从而区分地面点和非地面点。

:::
## 数据准备

### 推荐数据特征

- 包含地面的机载或地面激光扫描点云
- 点云密度相对均匀
- LAS/LAZ 格式最佳（保留分类信息）

### 加载数据

1. **File > Open** 加载原始点云
2. 如果出现全局偏移对话框，确认偏移设置
3. 等待加载完成，在 3D 视图中查看数据

## 使用 CSF 地面滤波插件

### 1. 打开 CSF 插件

通过菜单 **Plugins > CSF Ground Filter** 打开 CSF 地面滤波工具浮窗。

### 2. 选择输入点云

在点云树中选中要处理的点云节点。CSF 插件会自动使用当前选中的点云作为输入。

### 3. 配置参数

CSF 插件提供以下可调参数：

| 参数 | 默认值 | 说明 |
|------|--------|------|
| **cloth_resolution** | 1.0 | 布料网格分辨率。值越小，布料越精细，但计算量越大 |
| **time_step** | 0.65 | 模拟时间步长。影响布料下落速度和精度 |
| **iterations** | 500 | 最大迭代次数。地形复杂时需增加 |
| **class_threshold** | 0.5 | 地面分类阈值（米）。点距布料面低于此值被分类为地面 |
| **rigidness** | 2 | 布料硬度等级：1=松软、2=适中、3=坚硬 |
| **bSloopSmooth** | true | 坡度后处理平滑 |

### 4. 参数调优建议

:::tip[平坦地形]
对于平坦地形（如平原、广场）：
- `cloth_resolution`: 1.0 ~ 2.0
- `rigidness`: 1 或 2
- `class_threshold`: 0.3 ~ 0.5

:::
:::tip[复杂地形]
对于复杂地形（如山区、陡坡）：
- `cloth_resolution`: 0.5 ~ 1.0
- `rigidness`: 2 或 3
- `iterations`: 500 ~ 1000
- `class_threshold`: 0.5 ~ 1.0

:::
:::warning[rigidness 选择]
- `rigidness = 1`（松软）：适合平坦地形，布料能更好地贴合地面细节
- `rigidness = 2`（适中）：通用选择，适合大多数场景
- `rigidness = 3`（坚硬）：适合陡峭地形，防止布料穿过山坡

:::
### 5. 执行滤波

1. 点击 **Apply** 按钮
2. 进度对话框显示处理进度，处理时间取决于点云大小和参数
3. 处理期间可以点击 **Cancel** 取消操作

### 6. 查看结果

处理完成后，点云树中会出现两个新的点云节点：

- **Ground** - 提取的地面点
- **Non-Ground** - 非地面点（建筑物、植被、车辆等）

两个点云使用不同颜色显示，方便对比。

## 后续处理

### 地面点平滑

如果地面点仍有噪声，可以对其进行平滑处理：

1. 选中地面点点云
2. **Tools > Filters** 打开滤波器
3. 选择 **StatisticalOutlierRemoval** 去除残余噪声
4. 或选择 **VoxelGrid** 进行轻微降采样

### 生成 DEM

将提取的地面点导出后，可在 GIS 软件（如 QGIS、ArcGIS）中生成 DEM：

1. 右键点击地面点点云节点
2. 选择 **Save As**
3. 选择 LAS 格式导出
4. 在 GIS 软件中导入并生成栅格 DEM

## 使用 Python 脚本批量地面滤波

如果需要处理多份点云，可以使用 Python 脚本自动化：

```python
import ct
import os

# 待处理目录
input_dir = "D:/lidar_data/raw"
output_dir = "D:/lidar_data/ground"

for filename in os.listdir(input_dir):
    if not filename.endswith(".las"):
        continue

    filepath = os.path.join(input_dir, filename)
    ct.printI(f"Processing: {filename}")

    # 加载点云（通过 UI 信号触发）
    # ... 在当前版本中需通过菜单操作加载

    # 获取点云
    cloud = ct.get_cloud(filename)
    if cloud is None:
        ct.printE(f"Failed to load: {filename}")
        continue

    ct.printI(f"Points: {cloud.size()}")
    # 后续调用 CSF 算法处理...

ct.printI("Batch processing complete!")
```

:::info[Python 自动化]
完整的 Python 自动化工作流请参考 [Python 自动化实战](python-automation)。

:::
## 常见问题

### 地面点提取不完整？

- 减小 `cloth_resolution`（如从 2.0 降到 0.5）
- 减小 `class_threshold`（如从 0.5 降到 0.3）
- 增加 `iterations`（如从 500 增到 1000）

### 地面点包含太多非地面点？

- 增大 `class_threshold`
- 增加 `rigidness`（使布料更坚硬）
- 启用 `bSloopSmooth` 坡度平滑

### 处理速度太慢？

- 增大 `cloth_resolution`
- 先用 VoxelGrid 降采样再处理
- 减小点云范围，分块处理

## 下一步

- [植被分割](../advanced/plugin-development/intro) - 从非地面点中提取植被
- [变化检测实战](change-detect-tutorial) - 对比不同时期的地面变化
