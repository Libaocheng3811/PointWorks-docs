---
title: Python API 参考
---

# Python API 参考

本文列出 PointWorks 嵌入式 Python `ct` 模块的完整 API。

## 模块: `ct`

`ct` 是 PointWorks 通过 pybind11 注册的嵌入式模块，提供点云访问和日志功能。

```python
import ct
```

---

## 日志函数

### `ct.printI(message)`

输出信息级别日志。

```python
ct.printI(message: str) -> None
```

**参数**:
- `message` (str) - 日志消息

**示例**:
```python
ct.printI("开始处理点云")
ct.printI(f"点数: {cloud.size()}")
```

---

### `ct.printW(message)`

输出警告级别日志。

```python
ct.printW(message: str) -> None
```

**参数**:
- `message` (str) - 警告消息

**示例**:
```python
ct.printW("点云密度过低，结果可能不准确")
```

---

### `ct.printE(message)`

输出错误级别日志。

```python
ct.printE(message: str) -> None
```

**参数**:
- `message` (str) - 错误消息

**示例**:
```python
ct.printE("未找到指定点云")
```

---

## 点云访问

### `ct.get_cloud(name)`

按名称获取已加载的点云。

```python
ct.get_cloud(name: str) -> ct.Cloud | None
```

**参数**:
- `name` (str) - 点云名称（在点云树中显示的名称）

**返回值**:
- `ct.Cloud` - 成功时返回点云对象
- `None` - 未找到指定名称的点云

**线程安全**: 自动执行 hold + mark in-use 保护

**示例**:
```python
cloud = ct.get_cloud("terrain")
if cloud is not None:
    ct.printI(f"找到点云，共 {cloud.size()} 点")
else:
    ct.printE("未找到点云")
```

---

## 类: `ct.Cloud`

点云数据访问类。通过 `ct.get_cloud()` 获取实例。

---

### 属性查询

#### `cloud.size()`

获取点云总点数。

```python
cloud.size() -> int
```

**返回值**: 总点数

---

#### `cloud.has_colors()`

检查点云是否包含颜色信息。

```python
cloud.has_colors() -> bool
```

**返回值**: `True` 如果点云有 RGB 颜色数据

---

#### `cloud.has_normals()`

检查点云是否包含法线信息。

```python
cloud.has_normals() -> bool
```

**返回值**: `True` 如果点云有法线数据

---

#### `cloud.num_blocks()`

获取点云的 Block 数量。

```python
cloud.num_blocks() -> int
```

**返回值**: Block 数量（大点云使用八叉树分区后有多个 Block）

---

### 全量数据访问（拷贝）

:::warning[内存注意]
以下方法合并所有 Block 数据产生完整拷贝，大点云可能导致内存不足。

:::
#### `cloud.to_numpy()`

获取全部点的 XYZ 坐标。

```python
cloud.to_numpy() -> numpy.ndarray
```

**返回值**: `numpy.ndarray`，shape `(N, 3)`，dtype `float32`

**示例**:
```python
xyz = cloud.to_numpy()
print(xyz.shape)       # (5000000, 3)
print(xyz.dtype)       # float32
print(xyz.mean(axis=0))  # [x_mean, y_mean, z_mean]
```

---

#### `cloud.get_colors()`

获取全部点的 RGB 颜色。

```python
cloud.get_colors() -> numpy.ndarray
```

**返回值**: `numpy.ndarray`，shape `(N, 3)`，dtype `uint8`

**前提**: `cloud.has_colors()` 返回 `True`

**示例**:
```python
colors = cloud.get_colors()
print(colors.shape)  # (5000000, 3)
print(colors.max())  # 255
```

---

### 按 Block 零拷贝访问

推荐用于大点云，避免全量拷贝。

#### `cloud.block_to_numpy(block_index)`

零拷贝获取指定 Block 的 XYZ 坐标。

```python
cloud.block_to_numpy(block_index: int) -> numpy.ndarray
```

**参数**:
- `block_index` (int) - Block 索引，范围 `[0, cloud.num_blocks())`

**返回值**: `numpy.ndarray`，shape `(M, 3)`，dtype `float32`

**注意**: 返回的是内部数据视图（零拷贝），修改返回值会直接影响点云数据。

**示例**:
```python
for i in range(cloud.num_blocks()):
    xyz = cloud.block_to_numpy(i)
    ct.printI(f"Block {i}: {xyz.shape[0]} 点")
```

---

#### `cloud.block_get_colors(block_index)`

零拷贝获取指定 Block 的 RGB 颜色。

```python
cloud.block_get_colors(block_index: int) -> numpy.ndarray
```

**参数**:
- `block_index` (int) - Block 索引

**返回值**: `numpy.ndarray`，shape `(M, 3)`，dtype `uint8`

**前提**: `cloud.has_colors()` 返回 `True`

---

#### `cloud.block_set_colors(block_index, colors)`

设置指定 Block 的 RGB 颜色（拷贝写入）。

```python
cloud.block_set_colors(block_index: int, colors: numpy.ndarray) -> None
```

**参数**:
- `block_index` (int) - Block 索引
- `colors` (numpy.ndarray) - 颜色数组，shape `(M, 3)`，dtype `uint8`

**示例**:
```python
import numpy as np

for i in range(cloud.num_blocks()):
    n = cloud.block_to_numpy(i).shape[0]
    red = np.full((n, 3), [255, 0, 0], dtype=np.uint8)
    cloud.block_set_colors(i, red)
```

---

#### `cloud.block_set_numpy(block_index, xyz)`

设置指定 Block 的 XYZ 坐标（拷贝写入）。

```python
cloud.block_set_numpy(block_index: int, xyz: numpy.ndarray) -> None
```

**参数**:
- `block_index` (int) - Block 索引
- `xyz` (numpy.ndarray) - 坐标数组，shape `(M, 3)`，dtype `float32`

---

#### `cloud.block_mark_dirty(block_index)`

标记指定 Block 为脏（需要重算包围盒和刷新渲染）。

```python
cloud.block_mark_dirty(block_index: int) -> None
```

**参数**:
- `block_index` (int) - Block 索引

---

#### `cloud.refresh()`

刷新点云渲染，将所有修改更新到 VTK 渲染管线。

```python
cloud.refresh() -> None
```

**示例**:
```python
# 修改数据后刷新
for i in range(cloud.num_blocks()):
    cloud.block_set_colors(i, new_colors)
    cloud.block_mark_dirty(i)

cloud.refresh()  # 触发 VTK 重绘
```

---

## 完整使用示例

### 按高度着色

```python
import ct
import numpy as np

cloud = ct.get_cloud("terrain")
if cloud is None:
    ct.printE("未找到点云")
else:
    # 第一遍：找全局 Z 范围
    z_min, z_max = float('inf'), float('-inf')
    for i in range(cloud.num_blocks()):
        xyz = cloud.block_to_numpy(i)
        z_min = min(z_min, xyz[:, 2].min())
        z_max = max(z_max, xyz[:, 2].max())

    # 第二遍：着色
    for i in range(cloud.num_blocks()):
        xyz = cloud.block_to_numpy(i)
        t = (xyz[:, 2] - z_min) / (z_max - z_min + 1e-8)

        colors = np.zeros((len(t), 3), dtype=np.uint8)
        colors[:, 0] = (t * 255).astype(np.uint8)        # R
        colors[:, 2] = ((1 - t) * 255).astype(np.uint8)   # B

        cloud.block_set_colors(i, colors)
        cloud.block_mark_dirty(i)

    cloud.refresh()
    ct.printI("着色完成")
```

### 统计信息

```python
import ct
import numpy as np

cloud = ct.get_cloud("my_cloud")
if cloud is not None:
    ct.printI(f"总点数: {cloud.size()}")
    ct.printI(f"Block数: {cloud.num_blocks()}")
    ct.printI(f"颜色: {'有' if cloud.has_colors() else '无'}")
    ct.printI(f"法线: {'有' if cloud.has_normals() else '无'}")
```

### 自定义距离过滤

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

## 线程安全说明

| 操作 | 线程安全 | 说明 |
|------|---------|------|
| `ct.get_cloud()` | 是 | 自动 hold + mark in-use |
| `cloud.block_to_numpy()` | 是 | 通过 capsule 持有引用 |
| `cloud.block_set_*()` | 是 | 脚本独占执行，无并发 |
| `cloud.refresh()` | 是 | 通过信号触发主线程渲染 |

:::danger[不可变约束]
- 脚本执行期间，被引用的点云不会被 UI 删除
- 脚本完成后，所有 hold 和 in-use 标记自动释放
- 同一时刻只允许一个脚本执行

:::
## 相关主题

- [Python 控制台](console) - 交互式使用
- [Python 编辑器](editor) - 脚本编辑器
- [扩展 Python API](../../development/extending-python) - 如何添加新绑定
