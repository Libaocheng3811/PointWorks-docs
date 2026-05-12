---
title: Python 自动化实战
---

# Python 自动化实战

本教程介绍如何使用 PointWorks 的嵌入式 Python 环境编写脚本，实现点云处理的自动化和批量操作。

## 概述

PointWorks 通过 pybind11 嵌入了 Python 3.9 解释器，提供 `ct` 模块用于：

- 加载和保存多种格式的点云文件
- 调用全部 C++ 算法（滤波、配准、分割、特征提取、曲面重建等）
- 访问和修改点云数据（零拷贝 NumPy 数组）
- 控制视图和外观
- 批量处理多份点云

## Python 环境说明

| 特性 | 说明 |
|------|------|
| Python 版本 | 3.9（编译时绑定） |
| 模块名 | `ct`（嵌入式模块，非 pip 包） |
| 解释器生命周期 | 随 PointWorks 启动/退出 |
| NumPy | 可用（需在系统 Python 3.9 中安装） |
| 执行方式 | GUI 控制台或编辑器 |
| 线程安全 | 脚本在后台 QThread 中执行 |

:::info[系统依赖]
PointWorks 嵌入式 Python 会加载系统 Python 3.9 安装的第三方包。确保系统 Python 3.9 环境中安装了 `numpy` 等常用库。

:::

## 使用 Python 控制台

### 打开控制台

通过菜单 **Python > Console** 打开 Python 交互式控制台。

### 基本操作

```python
import ct

# 日志输出
ct.printI("这是一条信息")
ct.printW("这是一条警告")
ct.printE("这是一条错误")

# 获取当前加载的点云
cloud = ct.get_cloud("cloud_name")
if cloud is not None:
    ct.printI(f"点数: {cloud.size()}")
    ct.printI(f"有颜色: {cloud.has_colors()}")
    ct.printI(f"有法线: {cloud.has_normals()}")
```

## 使用 Python 编辑器

通过菜单 **Python > Editor** 打开 Python 脚本编辑器。编辑器支持：

- 语法高亮
- 脚本加载/保存
- 一键执行

详见 [Python 编辑器使用](../advanced/python-scripting/editor)。

---

## 实战示例

### 示例一：加载、滤波、保存

```python
import ct

# 加载点云
ct.load_cloud("D:/data/raw_scan.las")

# 体素降采样
sampled = ct.voxel_grid("raw_scan", 0.5, 0.5, 0.5)
sampled.show("sampled")

# 统计离群点移除
clean = ct.statistical_outlier_removal("sampled", nr_k=30, stddev_mult=2.0)
clean.show("clean")

# Z 轴范围裁剪（保留 0~100 米高程）
cropped = ct.pass_through("clean", "z", 0.0, 100.0)
cropped.show("cropped")

# 保存结果
ct.save_cloud("cropped", "D:/output/filtered.laz")

ct.printI("处理完成")
```

### 示例二：CSF 地面分割

```python
import ct

ct.load_cloud("D:/data/lidar_scan.las")
cloud = ct.get_cloud("lidar_scan")

ct.printI(f"原始点数: {cloud.size()}")

# 先降采样以提高处理速度
sampled = cloud.voxel_down_sample(0.3, 0.3, 0.3)
sampled.show("sampled")

# CSF 地面分割
result = ct.csf_filter("sampled",
    cloth_resolution=1.0,   # 布料分辨率（米）
    rigidness=2,            # 中等硬度
    iterations=300,         # 迭代次数
    class_threshold=0.5     # 分类阈值（米）
)

if result["ground"]:
    ground = result["ground"]
    off_ground = result["off_ground"]

    ct.printI(f"地面点: {ground.size()}")
    ct.printI(f"非地面点: {off_ground.size()}")

    # 地面点设置为灰色，非地面点保持原色
    ct.set_cloud_color("ground", 0.5, 0.5, 0.5)

    # 保存地面点
    ct.save_cloud("ground", "D:/output/ground.laz")
    ct.save_cloud("off_ground", "D:/output/off_ground.laz")
```

### 示例三：ICP 点云配准

```python
import ct

# 加载两个时期的扫描数据
ct.load_cloud("D:/data/before.las")
ct.load_cloud("D:/data/after.las")

# 粗配准 (NDT)
coarse = ct.ndt("before", "after",
    resolution=2.0,        # 体素分辨率
    step_size=0.1,         # 步长
    outlier_ratio=0.05     # 离群点比例
)

if coarse:
    ct.printI(f"粗配准 RMSE: {coarse['score']:.6f}")
    coarse["aligned"].show("coarse_aligned")

    # 精配准 (ICP)
    fine = ct.icp("before", "after",
        max_iterations=100,
        correspondence_distance=0.5
    )

    if fine:
        ct.printI(f"精配准 RMSE: {fine['score']:.6f}")
        fine["aligned"].show("fine_aligned")

        # 保存配准结果
        ct.save_cloud("fine_aligned", "D:/output/aligned.las")
```

### 示例四：C2C 距离计算（变化检测）

```python
import ct
import numpy as np

ct.load_cloud("D:/data/before.las")
ct.load_cloud("D:/data/after.las")

# 计算云对云距离
result = ct.cloud_cloud_distance("before", "after",
    method=0,         # 0=最近邻, 1=KNN均值, 2=半径均值
    k_knn=6,
    radius=0.5
)

if result["distances"] is not None:
    dists = result["distances"]

    ct.printI(f"平均距离: {np.mean(dists):.4f} m")
    ct.printI(f"标准差: {np.std(dists):.4f} m")
    ct.printI(f"最大距离: {np.max(dists):.4f} m")
    ct.printI(f"RMS 距离: {np.sqrt(np.mean(dists**2)):.4f} m")

    # 将距离结果作为标量场着色
    cloud = ct.get_cloud("before")
    cloud.add_scalar_field("distance", dists.astype(np.float32))
    cloud.update_color_by_field("distance")
```

### 示例五：链式处理流水线

```python
import ct

ct.load_cloud("D:/data/raw_scan.las")

cloud = ct.get_cloud("raw_scan")
ct.printI(f"原始: {cloud.size()} 点")

# 链式操作：裁剪 -> 降采样 -> 移除离群点 -> 法线估计
result = (cloud
    .crop_by_box(0, 0, -10, 200, 200, 100)
    .voxel_down_sample(0.3, 0.3, 0.3)
    .remove_outliers(nr_k=30, stddev_mult=2.0)
    .estimate_normals(k_search=30)
)

result.show("processed")
ct.printI(f"处理后: {result.size()} 点, 有法线: {result.has_normals()}")

# 泊松曲面重建
mesh = ct.poisson("processed", depth=9)
ct.show_mesh(mesh, "surface_mesh")
```

### 示例六：按高度着色（Block 级操作）

```python
import ct
import numpy as np

cloud = ct.get_cloud("terrain")
if cloud is None:
    ct.printE("未找到点云")
else:
    # 第一遍：找到全局高度范围
    z_min = float('inf')
    z_max = float('-inf')

    for i in range(cloud.num_blocks()):
        xyz = cloud.block_to_numpy(i)
        z = xyz[:, 2]
        z_min = min(z_min, z.min())
        z_max = max(z_max, z.max())

    ct.printI(f"高度范围: {z_min:.2f} ~ {z_max:.2f}")

    # 第二遍：按高度着色（蓝到红渐变）
    for i in range(cloud.num_blocks()):
        xyz = cloud.block_to_numpy(i)
        z = xyz[:, 2]

        # 归一化到 [0, 1]
        t = (z - z_min) / (z_max - z_min + 1e-8)

        # 蓝 (低) -> 绿 (中) -> 红 (高)
        colors = np.zeros((len(t), 3), dtype=np.uint8)
        colors[:, 0] = (t * 255).astype(np.uint8)           # R
        colors[:, 1] = ((1 - 2 * np.abs(t - 0.5)) * 255).astype(np.uint8)  # G
        colors[:, 2] = ((1 - t) * 255).astype(np.uint8)     # B

        cloud.block_set_colors(i, colors)

    cloud.refresh()
    ct.printI("高度着色完成")
```

### 示例七：欧几里得聚类分割

```python
import ct

ct.load_cloud("D:/data/scene.las")

# 先降采样
ct.voxel_grid("scene", 0.1, 0.1, 0.1)

# 欧几里得聚类
clusters = ct.euclidean_cluster("scene",
    tolerance=1.5,           # 聚类距离阈值
    min_cluster_size=100     # 最小聚类点数
)

ct.printI(f"检测到 {len(clusters)} 个聚类")
for i, c in enumerate(clusters):
    ct.printI(f"  聚类 {i}: {c.size()} 点")
    c.show(f"cluster_{i}")
```

### 示例八：自定义距离过滤

```python
import ct
import numpy as np

def filter_by_distance(cloud_name, center, max_dist):
    """过滤掉距离中心点超过 max_dist 的点"""
    cloud = ct.get_cloud(cloud_name)
    if cloud is None:
        ct.printE(f"未找到: {cloud_name}")
        return

    cx, cy, cz = center
    kept_total = 0
    removed_total = 0

    for i in range(cloud.num_blocks()):
        xyz = cloud.block_to_numpy(i)

        # 计算距离
        dist = np.sqrt(
            (xyz[:, 0] - cx)**2 +
            (xyz[:, 1] - cy)**2 +
            (xyz[:, 2] - cz)**2
        )

        # 创建掩码
        mask = dist <= max_dist
        kept = xyz[mask]
        removed_total += len(xyz) - len(kept)
        kept_total += len(kept)

        if cloud.has_colors():
            colors = cloud.block_get_colors(i)
            kept_colors = colors[mask]
            cloud.block_set_colors(i, kept_colors)

        cloud.block_set_numpy(i, kept)
        cloud.block_mark_dirty(i)

    cloud.refresh()
    ct.printI(f"保留 {kept_total} 点, 移除 {removed_total} 点")

filter_by_distance("my_cloud", (0.0, 0.0, 0.0), 100.0)
```

## API 参考速查

```python
# === 点云管理 ===
ct.load_cloud(filepath)                    # 加载文件
ct.save_cloud(name, filepath)              # 保存文件
ct.get_cloud(name)                         # 获取点云
ct.add_cloud(name, xyz, colors=None)       # 从数组创建
ct.clone_cloud(name)                       # 克隆
ct.merge_clouds(names)                     # 合并
ct.remove_cloud(name)                      # 删除

# === 算法 ===
ct.voxel_grid(name, lx, ly, lz)           # 体素降采样
ct.statistical_outlier_removal(name, ...)  # 离群点移除
ct.pass_through(name, field, min, max)     # 直通滤波
ct.estimate_normals(name, k_search=30)     # 法线估计
ct.csf_filter(name, ...)                   # 地面分割
ct.veg_filter(name, ...)                   # 植被分割
ct.icp(source, target, ...)                # ICP 配准
ct.ndt(source, target, ...)                # NDT 配准
ct.cloud_cloud_distance(ref, comp, ...)    # 距离计算
ct.poisson(name, ...)                      # 泊松重建
```

完整 API 文档参见：
- [Python API 参考](../advanced/python-scripting/api-reference) — 基础函数与索引
- [算法 API 详解](../advanced/python-scripting/api-algorithms) — 全部算法参数
- [类 API 详解](../advanced/python-scripting/api-classes) — ct.Cloud 与 ct.Mesh

## 线程安全注意事项

:::danger[GIL 约束]
Python 脚本在后台 `QThread`（`PythonWorker`）中执行。以下规则必须遵守：

:::
    1. **不要直接操作 UI** - 使用 `PythonBridge` 信号机制
    2. **脚本支持取消** - 长时间运行的脚本应检查取消标志
    3. **点云引用保护** - 获取的 `ct.Cloud` 在脚本执行期间被自动 hold，不会被 UI 删除

## 下一步

- [Python 控制台使用](../advanced/python-scripting/console) - 控制台详细说明
- [Python 编辑器使用](../advanced/python-scripting/editor) - 编辑器详细说明
- [Python API 参考](../advanced/python-scripting/api-reference) - 完整 API 文档
- [扩展 Python API](../development/extending-python) - 如何添加新的 Python 绑定
