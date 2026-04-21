---
title: Python 自动化实战
---

# Python 自动化实战

本教程介绍如何使用 PointWorks 的嵌入式 Python 环境编写脚本，实现点云处理的自动化和批量操作。

## 概述

PointWorks 通过 pybind11 嵌入了 Python 3.9 解释器，提供 `ct` 模块用于：

- 访问已加载的点云数据
- 零拷贝读写点云坐标和颜色（NumPy 数组）
- 批量处理多份点云
- 自定义算法实现
- 输出日志到 GUI 控制台

## Python 环境说明

PointWorks 的 Python 环境是嵌入式解释器，而非系统 Python：

| 特性 | 说明 |
|------|------|
| Python 版本 | 3.9（编译时绑定） |
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

# 输出日志
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

## Python API 参考

### `ct` 模块

#### 日志函数

```python
ct.printI(message: str)   # 信息日志（绿色）
ct.printW(message: str)   # 警告日志（黄色）
ct.printE(message: str)   # 错误日志（红色）
```

#### 点云访问

```python
cloud = ct.get_cloud(name: str)  # 按名称获取点云，返回 ct.Cloud 或 None
```

### `ct.Cloud` 类

#### 属性查询

```python
cloud.size()          # int - 总点数
cloud.has_colors()    # bool - 是否有颜色
cloud.has_normals()   # bool - 是否有法线
cloud.num_blocks()    # int - Block 数量
```

#### 全量数据访问（拷贝）

```python
# 获取全部坐标
xyz = cloud.to_numpy()        # numpy.ndarray, shape (N, 3), dtype float32

# 获取全部颜色
colors = cloud.get_colors()   # numpy.ndarray, shape (N, 3), dtype uint8

# 获取全部法线
normals = cloud.get_normals() # numpy.ndarray, shape (N, 3), dtype float32
```

:::warning[内存注意]
`to_numpy()` 和 `get_colors()` 会合并所有 Block 数据，产生完整拷贝。对于大点云（> 1000 万点），可能导致内存不足。建议使用按 Block 访问方式。

:::
#### 按 Block 零拷贝访问

```python
for i in range(cloud.num_blocks()):
    # 零拷贝读取
    xyz = cloud.block_to_numpy(i)       # shape (M, 3), float32
    colors = cloud.block_get_colors(i)  # shape (M, 3), uint8

    # 处理数据...
    new_colors = process_colors(colors)

    # 拷贝写回
    cloud.block_set_colors(i, new_colors)
    cloud.block_set_numpy(i, new_xyz)
    cloud.block_mark_dirty(i)           # 重算包围盒

# 刷新渲染
cloud.refresh()
```

## 实战示例

### 示例一：批量修改点云颜色

```python
import ct
import numpy as np

cloud = ct.get_cloud("my_cloud")
if cloud is None:
    ct.printE("未找到点云")
else:
    # 按 Block 逐块修改颜色为红色
    for i in range(cloud.num_blocks()):
        xyz = cloud.block_to_numpy(i)
        n = xyz.shape[0]

        # 创建红色数组
        red = np.zeros((n, 3), dtype=np.uint8)
        red[:, 0] = 255  # R = 255

        cloud.block_set_colors(i, red)
        ct.printI(f"Block {i}: {n} points colored red")

    cloud.block_mark_dirty(0)
    cloud.refresh()
    ct.printI("颜色修改完成")
```

### 示例二：按高度着色

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

### 示例三：统计点云信息

```python
import ct
import numpy as np

def analyze_cloud(name):
    cloud = ct.get_cloud(name)
    if cloud is None:
        ct.printE(f"未找到: {name}")
        return

    ct.printI(f"=== 分析: {name} ===")
    ct.printI(f"总点数: {cloud.size()}")
    ct.printI(f"Block数: {cloud.num_blocks()}")
    ct.printI(f"有颜色: {cloud.has_colors()}")
    ct.printI(f"有法线: {cloud.has_normals()}")

    # 统计包围盒
    x_min = y_min = z_min = float('inf')
    x_max = y_max = z_max = float('-inf')

    for i in range(cloud.num_blocks()):
        xyz = cloud.block_to_numpy(i)
        x_min = min(x_min, xyz[:, 0].min())
        x_max = max(x_max, xyz[:, 0].max())
        y_min = min(y_min, xyz[:, 1].min())
        y_max = max(y_max, xyz[:, 1].max())
        z_min = min(z_min, xyz[:, 2].min())
        z_max = max(z_max, xyz[:, 2].max())

    ct.printI(f"X范围: {x_min:.3f} ~ {x_max:.3f}")
    ct.printI(f"Y范围: {y_min:.3f} ~ {y_max:.3f}")
    ct.printI(f"Z范围: {z_min:.3f} ~ {z_max:.3f}")

    dx = x_max - x_min
    dy = y_max - y_min
    dz = z_max - z_min
    ct.printI(f"尺寸: {dx:.3f} x {dy:.3f} x {dz:.3f}")

analyze_cloud("my_cloud")
```

### 示例四：自定义距离过滤

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
