---
title: 类 API：ct.Cloud 与 ct.Mesh
---

# 类 API：ct.Cloud 与 ct.Mesh

本文档详细介绍 `ct.Cloud` 和 `ct.Mesh` 两个类的完整方法。

## ct.Cloud

`ct.Cloud` 是点云数据的核心类。通过 `ct.get_cloud()`、`ct.add_cloud()` 或算法返回值获取实例。

```python
cloud = ct.get_cloud("my_cloud")
```

---

### 属性查询

#### `cloud.size()`

获取点云总点数。

```python
cloud.size() -> int
```

#### `cloud.name()`

获取点云名称。

```python
cloud.name() -> str
```

#### `cloud.set_name(name)`

设置点云名称。

```python
cloud.set_name(name: str) -> None
```

#### `cloud.filepath()`

获取点云来源文件路径。

```python
cloud.filepath() -> str
```

#### `cloud.resolution()`

获取点云分辨率（平均最近邻距离）。

```python
cloud.resolution() -> float
```

#### `cloud.volume()`

获取点云包围盒体积。

```python
cloud.volume() -> float
```

#### `cloud.bounding_box()`

获取点云包围盒信息。

```python
cloud.bounding_box() -> dict
```

**返回值**: `{"cx", "cy", "cz", "width", "height", "depth"}`

#### `cloud.center()`

获取点云中心坐标。

```python
cloud.center() -> list[float]
```

**返回值**: `[x, y, z]`

#### `cloud.has_colors()`

检查是否包含颜色信息。

```python
cloud.has_colors() -> bool
```

#### `cloud.has_normals()`

检查是否包含法线信息。

```python
cloud.has_normals() -> bool
```

#### `cloud.num_blocks()`

获取 Block 数量（大点云使用八叉树分区后产生多个 Block）。

```python
cloud.num_blocks() -> int
```

#### `cloud.block_size(idx)`

获取指定 Block 的点数。

```python
cloud.block_size(idx: int) -> int
```

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

#### `cloud.get_colors()`

获取全部点的 RGB 颜色。

```python
cloud.get_colors() -> numpy.ndarray
```

**返回值**: `numpy.ndarray`，shape `(N, 3)`，dtype `uint8`

**前提**: `cloud.has_colors()` 返回 `True`

---

### 按 Block 零拷贝访问

推荐用于大点云，避免全量拷贝。

#### `cloud.block_to_numpy(block_index)`

零拷贝获取指定 Block 的 XYZ 坐标。

```python
cloud.block_to_numpy(block_index: int) -> numpy.ndarray
```

**返回值**: `numpy.ndarray`，shape `(M, 3)`，dtype `float32`

:::info[零拷贝说明]
返回的是内部数据视图，修改返回值会直接影响点云数据。配合 `block_set_*` 和 `block_mark_dirty` 使用。

:::

#### `cloud.block_get_colors(block_index)`

零拷贝获取指定 Block 的 RGB 颜色。

```python
cloud.block_get_colors(block_index: int) -> numpy.ndarray
```

**前提**: `cloud.has_colors()` 返回 `True`

#### `cloud.block_set_colors(block_index, colors)`

设置指定 Block 的 RGB 颜色（拷贝写入）。

```python
cloud.block_set_colors(block_index: int, colors: numpy.ndarray) -> None
```

**参数**:
- `colors` (ndarray) - shape `(M, 3)`，dtype `uint8`

#### `cloud.block_set_numpy(block_index, xyz)`

设置指定 Block 的 XYZ 坐标（拷贝写入）。

```python
cloud.block_set_numpy(block_index: int, xyz: numpy.ndarray) -> None
```

**参数**:
- `xyz` (ndarray) - shape `(M, 3)`，dtype `float32`

#### `cloud.block_mark_dirty(block_index)`

标记 Block 为脏，需要重算包围盒和刷新渲染。

```python
cloud.block_mark_dirty(block_index: int) -> None
```

---

### 标量场

#### `cloud.add_scalar_field(name, data)`

添加命名标量场。

```python
cloud.add_scalar_field(name: str, data: numpy.ndarray) -> None
```

**参数**:
- `data` (ndarray) - shape `(N,)`，dtype `float32`

#### `cloud.get_scalar_field(name)`

获取标量场数据。

```python
cloud.get_scalar_field(name: str) -> numpy.ndarray
```

**返回值**: shape `(N,)`，dtype `float32`

#### `cloud.get_scalar_field_names()`

获取所有标量场名称。

```python
cloud.get_scalar_field_names() -> list[str]
```

#### `cloud.has_scalar_field(name)`

检查标量场是否存在。

```python
cloud.has_scalar_field(name: str) -> bool
```

#### `cloud.remove_scalar_field(name)`

删除指定标量场。

```python
cloud.remove_scalar_field(name: str) -> bool
```

**返回值**: 是否成功删除

#### `cloud.clear_scalar_fields()`

删除所有标量场。

```python
cloud.clear_scalar_fields() -> None
```

#### `cloud.update_color_by_field(field_name)`

按标量场值对点云着色。

```python
cloud.update_color_by_field(field_name: str) -> None
```

**示例**:
```python
# 计算高度标量场
import numpy as np
xyz = cloud.to_numpy()
heights = xyz[:, 2]
cloud.add_scalar_field("elevation", heights.astype(np.float32))
cloud.update_color_by_field("elevation")
```

---

### 便捷变换方法

所有便捷变换方法返回新的 `ct.Cloud`。

#### `cloud.translate(tx, ty, tz)`

```python
cloud.translate(tx: float, ty: float, tz: float) -> ct.Cloud
```

#### `cloud.rotate(rx, ry, rz)`

欧拉角旋转（度）。

```python
cloud.rotate(rx: float, ry: float, rz: float) -> ct.Cloud
```

#### `cloud.rotate_axis(angle, ax, ay, az)`

绕轴旋转（度）。

```python
cloud.rotate_axis(angle: float, ax: float, ay: float, az: float) -> ct.Cloud
```

#### `cloud.scale(sx, sy, sz)`

```python
cloud.scale(sx: float, sy: float, sz: float) -> ct.Cloud
```

#### `cloud.apply_matrix(matrix)`

应用 4x4 变换矩阵。

```python
cloud.apply_matrix(matrix: list[list[float]]) -> ct.Cloud
```

**示例**:
```python
translated = cloud.translate(10.0, 0.0, 0.0)
translated.show("shifted")
```

---

### 便捷滤波方法

#### `cloud.voxel_down_sample(lx, ly, lz)`

体素降采样。

```python
cloud.voxel_down_sample(lx: float, ly: float, lz: float) -> ct.Cloud
```

#### `cloud.remove_outliers(nr_k=30, stddev_mult=2.0)`

统计离群点移除。

```python
cloud.remove_outliers(nr_k: int = 30, stddev_mult: float = 2.0) -> ct.Cloud
```

#### `cloud.crop_by_box(min_x, min_y, min_z, max_x, max_y, max_z)`

包围盒裁剪。

```python
cloud.crop_by_box(min_x: float, min_y: float, min_z: float,
                  max_x: float, max_y: float, max_z: float) -> ct.Cloud
```

**示例**:
```python
bbox = cloud.bounding_box()
cropped = cloud.crop_by_box(
    bbox["cx"] - 50, bbox["cy"] - 50, bbox["cz"] - 50,
    bbox["cx"] + 50, bbox["cy"] + 50, bbox["cz"] + 50
)
cropped.show("cropped_region")
```

---

### 便捷法线方法

#### `cloud.estimate_normals(k_search=30, radius_search=0.0)`

估计法线。

```python
cloud.estimate_normals(k_search: int = 30, radius_search: float = 0.0) -> ct.Cloud
```

---

### 便捷特征方法

#### `cloud.fpfh(k=30, radius=0.05)`

计算 FPFH 描述子。

```python
cloud.fpfh(k: int = 30, radius: float = 0.05) -> dict
```

**返回值**: `{"descriptor": ndarray, "time_ms": float}`

#### `cloud.shot(radius=0.05)`

计算 SHOT 描述子。

```python
cloud.shot(radius: float = 0.05) -> dict
```

#### `cloud.boundary_estimation(k=30, radius=0.05, angle=30.0)`

边界点检测。

```python
cloud.boundary_estimation(k: int = 30, radius: float = 0.05, angle: float = 30.0) -> ct.Cloud
```

---

### 便捷曲面重建方法

#### `cloud.convex_hull(compute_area_volume=False)`

凸包重建。

```python
cloud.convex_hull(compute_area_volume: bool = False) -> ct.Mesh
```

#### `cloud.concave_hull(alpha=0.1)`

凹包重建。

```python
cloud.concave_hull(alpha: float = 0.1) -> ct.Mesh
```

#### `cloud.poisson(depth=8, min_depth=5, point_weight=4.0, scale=1.1, solver_divide=8, iso_divide=8, samples_per_node=1.5, confidence=False, output_polygons=False, manifold=False)`

泊松曲面重建。

```python
cloud.poisson(...) -> ct.Mesh
```

**前置条件**: 需要法线。

---

### 便捷关键点方法

#### `cloud.iss_keypoints(resolution=0.1, gamma_21=0.975, gamma_32=0.975, min_neighbors=5, angle=0.52, k=10, radius=0.1)`

ISS 关键点检测。

```python
cloud.iss_keypoints(...) -> ct.Cloud
```

---

### 场景操作

#### `cloud.show(name="")`

将点云添加到场景树和 3D 视口。可选择重命名。

```python
cloud.show(name: str = "") -> None
```

**示例**:
```python
result = ct.voxel_grid("terrain", 0.5, 0.5, 0.5)
result.show("terrain_downsampled")  # 添加到场景并命名为 "terrain_downsampled"
```

#### `cloud.refresh()`

刷新渲染，将所有修改更新到 VTK 渲染管线。

```python
cloud.refresh() -> None
```

#### `cloud.clone()`

深拷贝点云。

```python
cloud.clone() -> ct.Cloud
```

---

## ct.Mesh

`ct.Mesh` 是三角网格数据类。通过曲面重建函数的返回值获取实例。

### `mesh.vertices()`

获取网格顶点坐标。

```python
mesh.vertices() -> numpy.ndarray
```

**返回值**: shape `(N, 3)`，dtype `float32`

### `mesh.faces()`

获取网格面索引。

```python
mesh.faces() -> numpy.ndarray
```

**返回值**: shape `(M, 3)`，dtype `int32`

### `mesh.num_vertices()`

获取顶点数。

```python
mesh.num_vertices() -> int
```

### `mesh.num_faces()`

获取面数。

```python
mesh.num_faces() -> int
```

### `mesh.show(id)`

在 3D 视口中显示网格。

```python
mesh.show(id: str) -> None
```

**示例**:
```python
# 重建并显示
with_normals = ct.estimate_normals("terrain", k_search=30)
mesh = ct.poisson("terrain", depth=9)
ct.show_mesh(mesh, "terrain_mesh")

# 或使用 Mesh 方法
mesh = ct.poisson("terrain", depth=9)
mesh.show("terrain_mesh")

# 获取网格数据
vertices = mesh.vertices()
faces = mesh.faces()
ct.printI(f"顶点: {mesh.num_vertices()}, 面: {mesh.num_faces()}")

# 导出为 OBJ（通过 numpy）
import numpy as np
np.savez("mesh_data.npz", vertices=vertices, faces=faces)
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

### 完整处理流水线

```python
import ct
import numpy as np

# 加载
ct.load_cloud("D:/data/scan.las")
cloud = ct.get_cloud("scan")

ct.printI(f"原始点数: {cloud.size()}")

# 降采样
sampled = cloud.voxel_down_sample(0.5, 0.5, 0.5)
sampled.show("sampled")

# 地面分割
ct.csf_filter("sampled", cloth_resolution=1.0, rigidness=2, iterations=300)
ground = ct.get_cloud("ground")
off_ground = ct.get_cloud("off_ground")

if ground:
    ct.printI(f"地面点: {ground.size()}")

    # 地面高度着色
    xyz = ground.to_numpy()
    heights = xyz[:, 2]
    ground.add_scalar_field("elevation", heights.astype(np.float32))
    ground.update_color_by_field("elevation")

# 保存
if ground:
    ct.save_cloud("ground", "D:/output/ground.laz")
```

### 链式操作

```python
import ct

cloud = ct.get_cloud("raw_scan")

# 链式处理：裁剪 -> 降采样 -> 移除离群点
result = (cloud
    .crop_by_box(0, 0, 0, 100, 100, 50)
    .voxel_down_sample(0.3, 0.3, 0.3)
    .remove_outliers(nr_k=30, stddev_mult=2.0))

result.show("cleaned")
ct.printI(f"处理后: {result.size()} 点")
```
