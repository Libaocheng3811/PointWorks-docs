---
title: Python API 参考
---

# Python API 参考

本文列出 PointWorks 嵌入式 Python `ct` 模块的完整 API。

```python
import ct
```

`ct` 是 PointWorks 通过 pybind11 注册的嵌入式模块。完整的算法 API 覆盖滤波、配准、分割、特征提取、曲面重建、距离计算等全部功能。

## 快速入门

```python
import ct

# 加载点云文件
ct.load_cloud("D:/data/terrain.las")

# 获取点云对象
cloud = ct.get_cloud("terrain")
if cloud is not None:
    ct.printI(f"点数: {cloud.size()}, 有颜色: {cloud.has_colors()}")

    # 体素降采样
    sampled = ct.voxel_grid("terrain", 0.5, 0.5, 0.5)
    sampled.show("terrain_sampled")

    # 保存结果
    ct.save_cloud("terrain_sampled", "D:/output/sampled.las")
```

## API 设计

PointWorks Python API 采用两层设计：

| 层级 | 说明 | 适用场景 |
|------|------|----------|
| **模块级函数** `ct.xxx()` | 完整参数控制，指定点云名称操作 | 精细控制、批量脚本 |
| **Cloud 便捷方法** `cloud.xxx()` | 自动使用当前云，提供默认参数 | 快速交互、链式调用 |

```python
# 两种方式等价：
result1 = ct.voxel_grid("my_cloud", 0.5, 0.5, 0.5)   # 模块级
cloud = ct.get_cloud("my_cloud")
result2 = cloud.voxel_down_sample(0.5, 0.5, 0.5)      # 便捷方法
```

## 脚本模式

默认情况下，算法结果会自动添加到场景树。使用脚本模式可让结果仅保留在内存中：

```python
ct.set_script_mode(True)  # 启用脚本模式

result = ct.voxel_grid("big_cloud", 1.0, 1.0, 1.0)
# result 存在于内存中，不显示在场景树

result.show("downsampled")  # 手动添加到场景

ct.clear_script_data()  # 清理未挂载的脚本数据
ct.set_script_mode(False)
```

## 模块函数索引

### 基础操作

| 函数 | 说明 | 详见 |
|------|------|------|
| `printI` / `printW` / `printE` | 日志输出 | [日志函数](#日志函数) |
| `load_cloud` / `save_cloud` | 文件读写 | [点云管理](#点云管理) |
| `get_cloud` / `add_cloud` / `get_all_cloud_names` | 获取与创建 | [点云管理](#点云管理) |
| `clone_cloud` / `merge_clouds` | 克隆与合并 | [点云管理](#点云管理) |
| `remove_cloud` / `remove_all_clouds` | 删除 | [点云管理](#点云管理) |

### 视图与外观

| 函数 | 说明 |
|------|------|
| `refresh_view` / `reset_camera` | 视图刷新与重置 |
| `zoom_to_bounds` / `zoom_to_selected` | 缩放到边界 |
| `set_top_view` / `set_front_view` 等 | 标准视图 |
| `set_point_size` / `set_opacity` / `set_cloud_color` | 外观设置 |
| `set_color_by_axis` / `reset_cloud_color` | 着色 |
| `set_background_color` / `show_id` / `show_axes` | 场景设置 |

### 算法函数

| 分类 | 函数 | 详见 |
|------|------|------|
| **变换** | `translate`, `rotate`, `rotate_axis`, `scale`, `apply_matrix`, `crop_by_box` | [变换操作](api-algorithms#变换操作) |
| **滤波** | `voxel_grid`, `statistical_outlier_removal`, `pass_through` 等 14 个 | [滤波与采样](api-algorithms#滤波与采样) |
| **法线** | `estimate_normals` | [法线估计](api-algorithms#法线估计) |
| **特征** | `fpfh`, `shot`, `vfh`, `esf` 等 19 个 | [特征描述子](api-algorithms#特征描述子) |
| **关键点** | `iss_keypoints`, `harris_keypoints`, `sift_keypoints`, `trajkovic_keypoints` | [关键点检测](api-algorithms#关键点检测) |
| **配准** | `icp`, `icp_with_normals`, `gicp`, `ndt`, `fpcs`, `kfpcs` | [点云配准](api-algorithms#点云配准) |
| **分割** | `sac_segmentation`, `euclidean_cluster`, `region_growing` 等 17 个 | [点云分割](api-algorithms#点云分割) |
| **曲面** | `poisson`, `greedy_triangulation`, `convex_hull` 等 7 个 | [曲面重建与网格](api-algorithms#曲面重建与网格) |
| **地面/植被** | `csf_filter`, `veg_filter` | [地面与植被分割](api-algorithms#地面与植被分割) |
| **距离** | `cloud_cloud_distance`, `closest_point_set` | [距离计算](api-algorithms#距离计算) |

---

## 日志函数

### `ct.printI(message)`

输出信息级别日志（绿色）。

```python
ct.printI(message: str) -> None
```

### `ct.printW(message)`

输出警告级别日志（黄色）。

```python
ct.printW(message: str) -> None
```

### `ct.printE(message)`

输出错误级别日志（红色）。

```python
ct.printE(message: str) -> None
```

---

## 点云管理

### `ct.load_cloud(filepath)`

异步加载点云文件。支持 LAS、LAZ、E57、PLY、PCD、TXT、OBJ、STL、VTK 等格式。

```python
ct.load_cloud(filepath: str) -> None
```

**示例**:
```python
ct.load_cloud("D:/data/scan001.las")
ct.load_cloud("D:/data/terrain.ply")
```

### `ct.save_cloud(name, filepath, binary=True)`

异步保存点云到文件。保存格式由文件扩展名决定。

```python
ct.save_cloud(name: str, filepath: str, binary: bool = True) -> None
```

**参数**:
- `name` (str) - 点云名称
- `filepath` (str) - 保存路径（扩展名决定格式）
- `binary` (bool) - 是否使用二进制格式（默认 True）

**示例**:
```python
ct.save_cloud("terrain", "D:/output/terrain.laz", binary=True)
ct.save_cloud("result", "D:/output/result.ply", binary=False)
```

### `ct.get_cloud(name)`

按名称获取已加载的点云对象。

```python
ct.get_cloud(name: str) -> ct.Cloud | None
```

**线程安全**: 自动执行 hold + mark in-use 保护

**示例**:
```python
cloud = ct.get_cloud("terrain")
if cloud is not None:
    ct.printI(f"找到点云，共 {cloud.size()} 点")
```

### `ct.add_cloud(name, xyz, colors=None)`

从 NumPy 数组创建新点云并添加到场景。

```python
ct.add_cloud(name: str, xyz: ndarray, colors: ndarray | None = None) -> ct.Cloud
```

**参数**:
- `name` (str) - 点云名称
- `xyz` (ndarray) - 坐标数组，shape `(N, 3)`，float32/float64
- `colors` (ndarray | None) - 颜色数组，shape `(N, 3)`，uint8

**返回值**: 新创建的 `ct.Cloud` 对象

**示例**:
```python
import numpy as np
xyz = np.random.rand(10000, 3).astype(np.float32)
cloud = ct.add_cloud("random_points", xyz)
```

### `ct.insert_cloud(cloud)`

将 `ct.Cloud` 对象插入到 UI 场景树和视口中。

```python
ct.insert_cloud(cloud: ct.Cloud) -> None
```

### `ct.update_cloud(name, xyz, colors=None)`

就地替换点云数据。

```python
ct.update_cloud(name: str, xyz: ndarray, colors: ndarray | None = None) -> None
```

### `ct.clone_cloud(name)`

深拷贝点云。

```python
ct.clone_cloud(name: str) -> ct.Cloud
```

**示例**:
```python
backup = ct.clone_cloud("terrain")
```

### `ct.merge_clouds(names)`

合并多个点云。

```python
ct.merge_clouds(names: list[str]) -> ct.Cloud
```

**参数**:
- `names` (list[str]) - 要合并的点云名称列表（至少 2 个）

**返回值**: 合并后的新 `ct.Cloud`

**示例**:
```python
merged = ct.merge_clouds(["scan_01", "scan_02", "scan_03"])
merged.show("merged_scan")
```

### `ct.get_all_cloud_names()`

获取所有已注册点云的名称列表。

```python
ct.get_all_cloud_names() -> list[str]
```

### `ct.select_cloud(name)`

在场景树中选中指定点云。

```python
ct.select_cloud(name: str) -> None
```

### `ct.remove_cloud(name)`

按名称删除点云。

```python
ct.remove_cloud(name: str) -> None
```

### `ct.remove_all_clouds()`

删除所有点云。

```python
ct.remove_all_clouds() -> None
```

### `ct.remove_selected_clouds()`

删除当前选中的点云。

```python
ct.remove_selected_clouds() -> None
```

### `ct.clear_all()`

清除所有 Python 生成的数据（包括点云和网格）。

```python
ct.clear_all() -> None
```

### `ct.clear_script_data()`

清除脚本模式下未显式挂载到场景的数据。

```python
ct.clear_script_data() -> None
```

### `ct.add_to_scene(cloud, name="")`

将 `ct.Cloud` 添加到场景树和视口。

```python
ct.add_to_scene(cloud: ct.Cloud, name: str = "") -> None
```

---

## 视图控制

### `ct.refresh_view()`

刷新 3D 视口。

```python
ct.refresh_view() -> None
```

### `ct.reset_camera()`

重置相机到默认位置。

```python
ct.reset_camera() -> None
```

### `ct.zoom_to_bounds()`

缩放视口以显示所有可见点云。

```python
ct.zoom_to_bounds() -> None
```

### `ct.zoom_to_selected()`

缩放视口以显示选中的点云。

```python
ct.zoom_to_selected() -> None
```

### `ct.set_auto_render(enable)`

启用/禁用自动渲染。禁用后在批量操作时可提升性能。

```python
ct.set_auto_render(enable: bool) -> None
```

**示例**:
```python
ct.set_auto_render(False)
# 批量操作...
ct.set_auto_render(True)
ct.refresh_view()
```

### 标准视图

```python
ct.set_top_view() -> None      # 俯视图 (XY 平面)
ct.set_front_view() -> None    # 前视图 (XZ 平面)
ct.set_back_view() -> None     # 后视图
ct.set_left_view() -> None     # 左视图 (YZ 平面)
ct.set_right_view() -> None    # 右视图
ct.set_bottom_view() -> None   # 底视图
```

---

## 外观设置

### 点云外观

```python
ct.set_point_size(id: str, size: float) -> None
ct.set_opacity(id: str, value: float) -> None      # value: 0.0 ~ 1.0
ct.set_cloud_color(id: str, r: float, g: float, b: float) -> None  # r/g/b: 0.0 ~ 1.0
ct.set_color_by_axis(id: str, axis: str) -> None   # axis: "X" / "Y" / "Z"
ct.reset_cloud_color(id: str) -> None
ct.set_cloud_visibility(id: str, visible: bool) -> None
```

**示例**:
```python
ct.set_point_size("terrain", 3.0)
ct.set_opacity("terrain", 0.7)
ct.set_cloud_color("terrain", 1.0, 0.0, 0.0)  # 红色
ct.set_color_by_axis("terrain", "Z")            # 按高度着色
```

### 场景设置

```python
ct.set_background_color(r: float, g: float, b: float) -> None  # 0.0 ~ 1.0
ct.reset_background_color() -> None
ct.show_id(show: bool) -> None
ct.show_axes(show: bool) -> None
ct.show_fps(show: bool) -> None
ct.show_info(text: str) -> None
ct.clear_info() -> None
```

---

## 叠加形状

### 基础形状

```python
ct.add_cube(cx: float, cy: float, cz: float, size: float, id: str = "cube") -> None
ct.add_3d_label(text: str, x: float, y: float, z: float, id: str = "label") -> None
ct.add_arrow(x1: float, y1: float, z1: float, x2: float, y2: float, z2: float,
             r: float = 1.0, g: float = 1.0, b: float = 1.0, id: str = "arrow") -> None
ct.add_polygon(cloud_id: str, r: float = 1.0, g: float = 1.0, b: float = 1.0,
               id: str = "polygon") -> None
```

### 形状管理

```python
ct.remove_shape(id: str) -> None
ct.remove_all_shapes() -> None
```

### 形状属性

```python
ct.set_shape_color(id: str, r: float = 1.0, g: float = 1.0, b: float = 1.0) -> None
ct.set_shape_size(id: str, size: float) -> None
ct.set_shape_opacity(id: str, value: float) -> None
ct.set_shape_line_width(id: str, value: float) -> None
ct.set_shape_font_size(id: str, value: float) -> None
ct.set_shape_representation(id: str, type: int) -> None  # 0=点, 1=线框, 2=面
```

### 视图辅助

```python
ct.zoom_to_bounds_xyz(min_x: float, min_y: float, min_z: float,
                       max_x: float, max_y: float, max_z: float) -> None
ct.invalidate_cloud_render(id: str) -> None
ct.set_interactor_enable(enable: bool) -> None
```

---

## 进度管理

```python
ct.show_progress(title: str) -> None    # 显示进度条
ct.set_progress(percent: int) -> None   # 更新进度 (0-100)
ct.close_progress() -> None             # 关闭进度条
ct.set_script_mode(enabled: bool) -> None  # 启用/禁用脚本模式
```

**示例**:
```python
ct.show_progress("批量处理中")
for i, name in enumerate(cloud_names):
    ct.set_progress(int((i + 1) / len(cloud_names) * 100))
    ct.voxel_grid(name, 0.5, 0.5, 0.5)
ct.close_progress()
```

---

## 算法 API 详解

算法类函数的详细文档（含全部参数说明和示例）请参阅：

- [算法 API：变换、滤波、法线](api-algorithms)
- [算法 API：特征、关键点、配准、分割](api-algorithms)
- [算法 API：曲面、地面/植被、距离](api-algorithms)

## 类 API 详解

`ct.Cloud` 和 `ct.Mesh` 类的完整方法文档请参阅：

- [类：ct.Cloud](api-classes)
- [类：ct.Mesh](api-classes)

---

## 线程安全说明

| 操作 | 线程安全 | 说明 |
|------|---------|------|
| `ct.get_cloud()` | 是 | 自动 hold + mark in-use |
| `cloud.block_to_numpy()` | 是 | 通过 capsule 持有引用 |
| `cloud.block_set_*()` | 是 | 脚本独占执行，无并发 |
| `cloud.refresh()` | 是 | 通过信号触发主线程渲染 |
| `ct.load_cloud()` / `ct.save_cloud()` | 是 | 异步执行 |
| 算法函数 (`ct.voxel_grid()` 等) | 是 | 在后台线程执行 |

:::danger[不可变约束]
- 脚本执行期间，被引用的点云不会被 UI 删除
- 脚本完成后，所有 hold 和 in-use 标记自动释放
- 同一时刻只允许一个脚本执行
- Python 代码不直接操作 UI，通过信号桥接

:::

## 相关主题

- [Python 控制台](console) - 交互式使用
- [Python 编辑器](editor) - 脚本编辑器
- [算法 API 详解](api-algorithms) - 滤波、配准、分割等完整文档
- [类 API 详解](api-classes) - ct.Cloud 和 ct.Mesh
- [扩展 Python API](../../development/extending-python) - 如何添加新绑定
