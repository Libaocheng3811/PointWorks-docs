---
title: 算法 API 详解
---

# 算法 API 详解

本文档涵盖 PointWorks Python API 中所有算法类函数的完整参数说明和示例。

## 变换操作

### `ct.translate(name, tx, ty, tz)`

平移点云，返回新点云。

```python
ct.translate(name: str, tx: float, ty: float, tz: float) -> ct.Cloud
```

**示例**:
```python
translated = ct.translate("terrain", 10.0, 0.0, 0.0)
translated.show("terrain_shifted")
```

### `ct.rotate(name, rx, ry, rz)`

欧拉角旋转（度），返回新点云。

```python
ct.rotate(name: str, rx: float, ry: float, rz: float) -> ct.Cloud
```

### `ct.rotate_axis(name, angle, ax, ay, az, tx=0, ty=0, tz=0)`

绕任意轴旋转（角度为度），支持同时平移。

```python
ct.rotate_axis(name: str, angle: float, ax: float, ay: float, az: float,
               tx: float = 0, ty: float = 0, tz: float = 0) -> ct.Cloud
```

**参数**:
- `angle` (float) - 旋转角度（度）
- `ax, ay, az` (float) - 旋转轴方向向量
- `tx, ty, tz` (float) - 可选，旋转前先平移到指定位置

### `ct.scale(name, sx, sy, sz, use_center=False)`

缩放点云。

```python
ct.scale(name: str, sx: float, sy: float, sz: float, use_center: bool = False) -> ct.Cloud
```

**参数**:
- `use_center` (bool) - True 时以点云中心为原点缩放

### `ct.apply_matrix(name, matrix)`

应用 4x4 变换矩阵。

```python
ct.apply_matrix(name: str, matrix: list[list[float]]) -> ct.Cloud
```

**示例**:
```python
import numpy as np
T = np.eye(4)
T[0, 3] = 10.0  # X 方向平移 10
result = ct.apply_matrix("terrain", T.tolist())
```

### `ct.crop_by_box(name, min_x, min_y, min_z, max_x, max_y, max_z, negative=False)`

轴对齐包围盒裁剪。

```python
ct.crop_by_box(name: str, min_x: float, min_y: float, min_z: float,
               max_x: float, max_y: float, max_z: float, negative: bool = False) -> ct.Cloud
```

**参数**:
- `negative` (bool) - True 时保留包围盒外的点

---

## 滤波与采样

所有滤波函数均返回新的 `ct.Cloud` 对象。`negative` 参数为 True 时反转选择（保留被过滤掉的点）。

### `ct.voxel_grid(name, lx, ly, lz, negative=False)`

体素网格降采样。

```python
ct.voxel_grid(name: str, lx: float, ly: float, lz: float, negative: bool = False) -> ct.Cloud
```

**参数**:
- `lx, ly, lz` (float) - X/Y/Z 方向的体素尺寸（米）

**示例**:
```python
sampled = ct.voxel_grid("terrain", 0.5, 0.5, 0.5)
sampled.show("terrain_voxel")
ct.printI(f"降采样后: {sampled.size()} 点")
```

### `ct.approx_voxel_grid(name, lx, ly, lz, negative=False)`

近似体素降采样，速度更快但精度略低。

```python
ct.approx_voxel_grid(name: str, lx: float, ly: float, lz: float, negative: bool = False) -> ct.Cloud
```

### `ct.statistical_outlier_removal(name, nr_k=30, stddev_mult=2.0, negative=False)`

统计离群点移除。

```python
ct.statistical_outlier_removal(name: str, nr_k: int = 30, stddev_mult: float = 2.0,
                                negative: bool = False) -> ct.Cloud
```

**参数**:
- `nr_k` (int) - K 近邻数量
- `stddev_mult` (float) - 标准差倍数阈值

### `ct.radius_outlier_removal(name, radius=1.0, min_pts=2, negative=False)`

半径离群点移除。

```python
ct.radius_outlier_removal(name: str, radius: float = 1.0, min_pts: int = 2,
                           negative: bool = False) -> ct.Cloud
```

**参数**:
- `radius` (float) - 搜索半径
- `min_pts` (int) - 半径内最少点数

### `ct.pass_through(name, field_name, limit_min, limit_max, negative=False)`

直通滤波，按字段范围筛选点。

```python
ct.pass_through(name: str, field_name: str, limit_min: float, limit_max: float,
                negative: bool = False) -> ct.Cloud
```

**参数**:
- `field_name` (str) - 字段名："x"、"y" 或 "z"
- `limit_min` (float) - 最小值
- `limit_max` (float) - 最大值

**示例**:
```python
# 保留 Z 值在 0~100 之间的点
cropped = ct.pass_through("terrain", "z", 0.0, 100.0)
```

### `ct.grid_minimum(name, resolution=1.0, negative=False)`

网格最小值滤波，将每个网格内最低点保留。

```python
ct.grid_minimum(name: str, resolution: float = 1.0, negative: bool = False) -> ct.Cloud
```

### `ct.local_maximum(name, radius=1.0, negative=False)`

局部最大值移除。

```python
ct.local_maximum(name: str, radius: float = 1.0, negative: bool = False) -> ct.Cloud
```

### `ct.shadow_points(name, threshold=0.1, negative=False)`

阴影点移除。

```python
ct.shadow_points(name: str, threshold: float = 0.1, negative: bool = False) -> ct.Cloud
```

### `ct.down_sampling(name, radius=1.0, negative=False)`

半径降采样。

```python
ct.down_sampling(name: str, radius: float = 1.0, negative: bool = False) -> ct.Cloud
```

### `ct.uniform_sampling(name, radius=1.0, negative=False)`

均匀降采样。

```python
ct.uniform_sampling(name: str, radius: float = 1.0, negative: bool = False) -> ct.Cloud
```

### `ct.random_sampling(name, sample=1000, seed=42, negative=False)`

随机降采样。

```python
ct.random_sampling(name: str, sample: int = 1000, seed: int = 42, negative: bool = False) -> ct.Cloud
```

**参数**:
- `sample` (int) - 保留的目标点数
- `seed` (int) - 随机种子

### `ct.resampling(name, radius=1.0, polynomial_order=2, negative=False)`

MLS (Moving Least Squares) 重采样。

```python
ct.resampling(name: str, radius: float = 1.0, polynomial_order: int = 2,
              negative: bool = False) -> ct.Cloud
```

### `ct.normal_space_sampling(name, sample=1000, seed=42, bin=10, negative=False)`

法空间采样。

```python
ct.normal_space_sampling(name: str, sample: int = 1000, seed: int = 42,
                          bin: int = 10, negative: bool = False) -> ct.Cloud
```

**前置条件**: 点云须包含法线。

### `ct.sampling_surface_normal(name, sample=10000, seed=42, ratio=0.5, negative=False)`

基于法线的表面采样。

```python
ct.sampling_surface_normal(name: str, sample: int = 10000, seed: int = 42,
                            ratio: float = 0.5, negative: bool = False) -> ct.Cloud
```

**前置条件**: 点云须包含法线。

---

## 法线估计

### `ct.estimate_normals(name, k_search=30, radius_search=0.0, vpx=0, vpy=0, vpz=0, reverse=False)`

估计点云法线。

```python
ct.estimate_normals(name: str, k_search: int = 30, radius_search: float = 0.0,
                    vpx: float = 0, vpy: float = 0, vpz: float = 0,
                    reverse: bool = False) -> ct.Cloud
```

**参数**:
- `k_search` (int) - K 近邻搜索数量（k_search 和 radius_search 至少设置一个）
- `radius_search` (float) - 搜索半径（0 表示不使用）
- `vpx, vpy, vpz` (float) - 视点位置，法线朝向视点
- `reverse` (bool) - 是否反转法线方向

**返回值**: 包含法线的新 `ct.Cloud`

**示例**:
```python
with_normals = ct.estimate_normals("terrain", k_search=30)
with_normals.show("terrain_normals")
```

---

## 特征描述子

### 局部描述子

所有局部描述子返回 `dict`：`{"descriptor": ndarray, "time_ms": float}`。

#### `ct.fpfh(name, k=30, radius=0.05, surface=False)`

快速点特征直方图。

```python
ct.fpfh(name: str, k: int = 30, radius: float = 0.05, surface: bool = False) -> dict
```

**前置条件**: 需要法线。`surface=True` 时需要表面变体参数。

#### `ct.pfh(name, k=30, radius=0.05, surface=False)`

点特征直方图。

```python
ct.pfh(name: str, k: int = 30, radius: float = 0.05, surface: bool = False) -> dict
```

#### `ct.shot(name, radius=0.05, surface=False)`

SHOT 描述子。

```python
ct.shot(name: str, radius: float = 0.05, surface: bool = False) -> dict
```

#### `ct.shot_color(name, radius=0.05, surface=False)`

SHOT Color 描述子。

```python
ct.shot_color(name: str, radius: float = 0.05, surface: bool = False) -> dict
```

**前置条件**: 需要法线和颜色。

#### `ct.rsd(name, nr_subdiv=5, plane_radius=0.1)`

RSD (Radius Surface Descriptor)。

```python
ct.rsd(name: str, nr_subdiv: int = 5, plane_radius: float = 0.1) -> dict
```

#### `ct.grsd(name)`

GRSD (Global RSD) 描述子。

```python
ct.grsd(name: str) -> dict
```

#### `ct.shape_context_3d(name, min_radius=0.005, radius=0.05)`

3D 形状上下文。

```python
ct.shape_context_3d(name: str, min_radius: float = 0.005, radius: float = 0.05) -> dict
```

#### `ct.unique_shape_context(name, lrf_radius=0.015, radius=0.025, loc_radius=0.075)`

唯一形状上下文。

```python
ct.unique_shape_context(name: str, lrf_radius: float = 0.015,
                         radius: float = 0.025, loc_radius: float = 0.075) -> dict
```

### 全局描述子

#### `ct.vfh(name, dir_x=0, dir_y=0, dir_z=0, surface=False)`

视点特征直方图。

```python
ct.vfh(name: str, dir_x: float = 0, dir_y: float = 0, dir_z: float = 0,
       surface: bool = False) -> dict
```

#### `ct.esf(name)`

ESF (Ensemble of Shape Functions)。

```python
ct.esf(name: str) -> dict
```

#### `ct.cvhf(name, dir_x=0, dir_y=0, dir_z=0, radius_normals=0.05, d1=0.02, d2=0.04, d3=0.06, min_points=50, normalize=True)`

聚类视点特征直方图。

```python
ct.cvhf(name: str, dir_x: float = 0, dir_y: float = 0, dir_z: float = 0,
        radius_normals: float = 0.05, d1: float = 0.02, d2: float = 0.04,
        d3: float = 0.06, min_points: int = 50, normalize: bool = True) -> dict
```

#### `ct.gasd(name, dir_x=0, dir_y=0, dir_z=0, shgs=5, shs=3, interp=0)`

GASD 描述子。

```python
ct.gasd(name: str, dir_x: float = 0, dir_y: float = 0, dir_z: float = 0,
        shgs: int = 5, shs: int = 3, interp: int = 0) -> dict
```

#### `ct.gasd_color(name, dir_x=0, dir_y=0, dir_z=0, shgs=5, shs=3, interp=0, chgs=5, chs=3, cinterp=0)`

GASD Color 描述子。

```python
ct.gasd_color(name: str, dir_x: float = 0, dir_y: float = 0, dir_z: float = 0,
              shgs: int = 5, shs: int = 3, interp: int = 0,
              chgs: int = 5, chs: int = 3, cinterp: int = 0) -> dict
```

#### `ct.crh(name, dir_x=0, dir_y=0, dir_z=0)`

相机旋转直方图。

```python
ct.crh(name: str, dir_x: float = 0, dir_y: float = 0, dir_z: float = 0) -> dict
```

### 边界估计

#### `ct.boundary_estimation(name, k=30, radius=0.05, angle=30.0)`

边界点检测。

```python
ct.boundary_estimation(name: str, k: int = 30, radius: float = 0.05, angle: float = 30.0) -> ct.Cloud
```

**前置条件**: 需要法线。

### 包围盒

#### `ct.bounding_box_aabb(name)`

轴对齐包围盒。

```python
ct.bounding_box_aabb(name: str) -> dict
```

**返回值**: `{"center_x", "center_y", "center_z", "width", "height", "depth"}`

#### `ct.bounding_box_obb(name)`

有向包围盒。

```python
ct.bounding_box_obb(name: str) -> dict
```

**返回值**: `{"center_x", "center_y", "center_z", "width", "height", "depth"}`

### 局部参考帧

所有返回 `dict`：`{"lrf": ndarray(N,3,3) or None, "time_ms": float}`。

#### `ct.shot_lrf(name, radius=0.05)`

SHOT 局部参考帧。

```python
ct.shot_lrf(name: str, radius: float = 0.05) -> dict
```

#### `ct.board_lrf(name, radius=0.03, find_holes=True, margin_thresh=0.001, size=0, prob_thresh=0.001, steep_thresh=0.5)`

BOARD 局部参考帧。

```python
ct.board_lrf(name: str, radius: float = 0.03, find_holes: bool = True,
             margin_thresh: float = 0.001, size: int = 0,
             prob_thresh: float = 0.001, steep_thresh: float = 0.5) -> dict
```

#### `ct.flare_lrf(name, radius=0.03, margin_thresh=0.02, min_neighbors_normal=5, min_neighbors_tangent=5)`

FLARE 局部参考帧。

```python
ct.flare_lrf(name: str, radius: float = 0.03, margin_thresh: float = 0.02,
             min_neighbors_normal: int = 5, min_neighbors_tangent: int = 5) -> dict
```

---

## 关键点检测

所有关键点函数返回新的 `ct.Cloud`（仅包含关键点）。

### `ct.iss_keypoints(name, resolution=0.1, gamma_21=0.975, gamma_32=0.975, min_neighbors=5, angle=0.52, k=10, radius=0.1)`

ISS (Intrinsic Shape Signatures) 关键点。

```python
ct.iss_keypoints(name: str, resolution: float = 0.1, gamma_21: float = 0.975,
                 gamma_32: float = 0.975, min_neighbors: int = 5,
                 angle: float = 0.52, k: int = 10, radius: float = 0.1) -> ct.Cloud
```

### `ct.harris_keypoints(name, response_method=0, threshold=0.001, non_maxima=True, do_refine=False, k=10, radius=0.01)`

Harris 3D 关键点。

```python
ct.harris_keypoints(name: str, response_method: int = 0, threshold: float = 0.001,
                    non_maxima: bool = True, do_refine: bool = False,
                    k: int = 10, radius: float = 0.01) -> ct.Cloud
```

**参数**:
- `response_method` (int) - 响应方法：0=HARRIS, 1=NOBLE, 2=LOWE, 3=TOMASI, 4=CURVATURE

### `ct.sift_keypoints(name, min_scale=0.01, nr_octaves=6, nr_scales_per_octave=3, min_contrast=0.01, k=10, radius=0.05)`

SIFT 3D 关键点。

```python
ct.sift_keypoints(name: str, min_scale: float = 0.01, nr_octaves: int = 6,
                  nr_scales_per_octave: int = 3, min_contrast: float = 0.01,
                  k: int = 10, radius: float = 0.05) -> ct.Cloud
```

### `ct.trajkovic_keypoints(name, compute_method=0, window_size=3, first_threshold=0.15, second_threshold=0.05, k=10, radius=0.01)`

Trajkovic 3D 关键点。

```python
ct.trajkovic_keypoints(name: str, compute_method: int = 0, window_size: int = 3,
                       first_threshold: float = 0.15, second_threshold: float = 0.05,
                       k: int = 10, radius: float = 0.01) -> ct.Cloud
```

---

## 点云配准

所有配准函数返回 `dict`：
```python
{
    "aligned": ct.Cloud,       # 配准后的点云
    "score": float,            # 配准评分（RMSE）
    "matrix": list[list[float]],  # 4x4 变换矩阵
    "time_ms": float           # 耗时（毫秒）
}
```

失败时返回 `None`。

### `ct.icp(source, target, max_iterations=50, correspondence_distance=1.0, use_reciprocal=False)`

标准 ICP 配准。

```python
ct.icp(source: str, target: str, max_iterations: int = 50,
       correspondence_distance: float = 1.0, use_reciprocal: bool = False) -> dict | None
```

**示例**:
```python
result = ct.icp("scan_01", "scan_02", max_iterations=100, correspondence_distance=0.5)
if result:
    ct.printI(f"ICP RMSE: {result['score']:.6f}")
    result['aligned'].show("aligned")
    ct.printI(f"变换矩阵: {result['matrix']}")
```

### `ct.icp_with_normals(source, target, max_iterations=50, correspondence_distance=1.0, use_reciprocal=False, use_symmetric=False, enforce_same_direction=False)`

点对面 ICP（使用法线）。

```python
ct.icp_with_normals(source: str, target: str, max_iterations: int = 50,
                    correspondence_distance: float = 1.0, use_reciprocal: bool = False,
                    use_symmetric: bool = False, enforce_same_direction: bool = False) -> dict | None
```

**前置条件**: 两个点云都需要法线。

### `ct.icp_nonlinear(source, target, max_iterations=50, correspondence_distance=1.0, use_reciprocal=False)`

非线性 ICP。

```python
ct.icp_nonlinear(source: str, target: str, max_iterations: int = 50,
                 correspondence_distance: float = 1.0, use_reciprocal: bool = False) -> dict | None
```

### `ct.gicp(source, target, max_iterations=200, k=30, translation_tolerance=1e-6, rotation_tolerance=1e-6, use_reciprocal=False)`

广义 ICP。

```python
ct.gicp(source: str, target: str, max_iterations: int = 200, k: int = 30,
        translation_tolerance: float = 1e-6, rotation_tolerance: float = 1e-6,
        use_reciprocal: bool = False) -> dict | None
```

### `ct.ndt(source, target, resolution=1.0, step_size=0.1, outlier_ratio=0.05)`

正态分布变换配准。适合大尺度点云粗配准。

```python
ct.ndt(source: str, target: str, resolution: float = 1.0,
       step_size: float = 0.1, outlier_ratio: float = 0.05) -> dict | None
```

**示例**:
```python
# 粗配准
coarse = ct.ndt("source", "target", resolution=2.0)
if coarse:
    ct.printI(f"NDT score: {coarse['score']:.6f}")

    # 精配准
    fine = ct.icp("source", "target", max_iterations=100)
```

### `ct.fpcs(source, target, delta=1.0, approx_overlap=0.1, score_threshold=0.6, nr_samples=3000, max_norm_diff=0.1, max_runtime=60)`

FPCS (Fast Point Feature Histograms-based) 初始配准。

```python
ct.fpcs(source: str, target: str, delta: float = 1.0, approx_overlap: float = 0.1,
        score_threshold: float = 0.6, nr_samples: int = 3000,
        max_norm_diff: float = 0.1, max_runtime: int = 60) -> dict | None
```

### `ct.kfpcs(source, target, delta=1.0, approx_overlap=0.1, score_threshold=0.6, nr_samples=3000, max_norm_diff=0.1, max_runtime=60, upper_trl_boundary=2.0, lower_trl_boundary=0.05, lambda=0.5)`

KFPCS (Keypoint FPCS) 初始配准。

```python
ct.kfpcs(source: str, target: str, delta: float = 1.0, approx_overlap: float = 0.1,
         score_threshold: float = 0.6, nr_samples: int = 3000,
         max_norm_diff: float = 0.1, max_runtime: int = 60,
         upper_trl_boundary: float = 2.0, lower_trl_boundary: float = 0.05,
         lambda: float = 0.5) -> dict | None
```

---

## 点云分割

### SAC 模型分割

返回 `dict`：`{"clouds": list[ct.Cloud], "time_ms": float, "coefficients": dict}`

#### `ct.sac_segmentation(name, negative=False, model=0, method=0, threshold=1.0, max_iterations=50, probability=0.99, optimize=True, min_radius=0.0, max_radius=0.0)`

从点云中分割几何模型（平面、圆柱等）。

```python
ct.sac_segmentation(name: str, negative: bool = False, model: int = 0,
                    method: int = 0, threshold: float = 1.0,
                    max_iterations: int = 50, probability: float = 0.99,
                    optimize: bool = True, min_radius: float = 0.0,
                    max_radius: float = 0.0) -> dict
```

**参数**:
- `model` (int) - 模型类型：0=SACMODEL_PLANE, 1=SACMODEL_LINE, 2=SACMODEL_CIRCLE2D, 3=SACMODEL_CIRCLE3D, 4=SACMODEL_SPHERE, 5=SACMODEL_CYLINDER, 6=SACMODEL_CONE, 7=SACMODEL_TORUS, 8=SACMODEL_PARALLEL_LINE
- `method` (int) - 采样方法：0=SAC_RANSAC, 1=SAC_LMEDS, 2=SAC_MSAC, 3=SAC_RANSAC, 4=SAC_RRANSAC

**示例**:
```python
result = ct.sac_segmentation("building", model=0, threshold=0.5)
if result["clouds"]:
    result["clouds"][0].show("plane")
    ct.printI(f"模型系数: {result['coefficients']}")
```

#### `ct.sac_segmentation_from_normals(name, negative=False, model=0, method=0, threshold=1.0, max_iterations=50, probability=0.99, optimize=True, min_radius=0.0, max_radius=0.0, distance_weight=0.1, d=0.0)`

使用法线的 SAC 分割。

```python
ct.sac_segmentation_from_normals(name: str, negative: bool = False, model: int = 0,
                                 method: int = 0, threshold: float = 1.0,
                                 max_iterations: int = 50, probability: float = 0.99,
                                 optimize: bool = True, min_radius: float = 0.0,
                                 max_radius: float = 0.0, distance_weight: float = 0.1,
                                 d: float = 0.0) -> dict
```

**前置条件**: 需要法线。

### 聚类

所有聚类函数返回 `list[ct.Cloud]`（每个元素为一个聚类）。

#### `ct.euclidean_cluster(name, negative=False, tolerance=1.0, min_cluster_size=1, max_cluster_size=2147483647)`

欧几里得聚类。

```python
ct.euclidean_cluster(name: str, negative: bool = False, tolerance: float = 1.0,
                     min_cluster_size: int = 1, max_cluster_size: int = MAX_INT) -> list[ct.Cloud]
```

**示例**:
```python
clusters = ct.euclidean_cluster("scene", tolerance=1.5, min_cluster_size=100)
ct.printI(f"检测到 {len(clusters)} 个聚类")
for i, c in enumerate(clusters):
    c.show(f"cluster_{i}")
```

#### `ct.dbscan_cluster(name, negative=False, eps=1.0, min_pts=2, min_cluster_size=1, max_cluster_size=2147483647, normal_weight=0.0, color_weight=0.0)`

DBSCAN 聚类。

```python
ct.dbscan_cluster(name: str, negative: bool = False, eps: float = 1.0,
                  min_pts: int = 2, min_cluster_size: int = 1,
                  max_cluster_size: int = MAX_INT, normal_weight: float = 0.0,
                  color_weight: float = 0.0) -> list[ct.Cloud]
```

#### `ct.kmeans_cluster(name, k=8, max_iterations=100, normal_weight=0.0, color_weight=0.0)`

K-Means 聚类。

```python
ct.kmeans_cluster(name: str, k: int = 8, max_iterations: int = 100,
                  normal_weight: float = 0.0, color_weight: float = 0.0) -> list[ct.Cloud]
```

### 区域生长

所有区域生长函数返回 `list[ct.Cloud]`。

#### `ct.region_growing(name, negative=False, min_cluster_size=50, max_cluster_size=2147483647, smooth_mode=True, curvature_test=False, residual_test=False, smoothness_threshold=30.0, residual_threshold=0.05, curvature_threshold=0.05, neighbours=30)`

标准区域生长。

```python
ct.region_growing(name: str, ...) -> list[ct.Cloud]
```

**前置条件**: 需要法线。

#### `ct.region_growing_from_seed(name, negative=False, seed_index=0, ...)`

从指定种子点开始的区域生长。

```python
ct.region_growing_from_seed(name: str, negative: bool = False, seed_index: int = 0, ...) -> list[ct.Cloud]
```

#### `ct.region_growing_rgb(name, negative=False, min_cluster_size=50, ..., pt_thresh=6.0, re_thresh=5.0, dis_thresh=30000.0, nghbr_number=30)`

基于 RGB 颜色的区域生长。

```python
ct.region_growing_rgb(name: str, negative: bool = False, min_cluster_size: int = 50, ...) -> list[ct.Cloud]
```

**前置条件**: 需要颜色。

### 超体素

#### `ct.supervoxel(name, voxel_resolution=0.008, seed_resolution=0.1, color_importance=0.2, spatial_importance=0.4, normal_importance=1.0, camera_transform=False)`

超体素过分割。

```python
ct.supervoxel(name: str, voxel_resolution: float = 0.008, seed_resolution: float = 0.1,
              color_importance: float = 0.2, spatial_importance: float = 0.4,
              normal_importance: float = 1.0, camera_transform: bool = False) -> list[ct.Cloud]
```

**前置条件**: 需要颜色和法线。

### 其他分割方法

#### `ct.don_segmentation(name, negative=False, mean_radius=1.0, scale1=0.5, scale2=2.0, threshold=0.5, segradius=1.5, minClusterSize=50, maxClusterSize=2147483647)`

法线差值 (DON) 分割。

```python
ct.don_segmentation(name: str, negative: bool = False, mean_radius: float = 1.0,
                    scale1: float = 0.5, scale2: float = 2.0, threshold: float = 0.5,
                    segradius: float = 1.5, minClusterSize: int = 50,
                    maxClusterSize: int = MAX_INT) -> list[ct.Cloud]
```

#### `ct.min_cut_segmentation(name, sigma=0.25, radius=0.04, weight=0.8, neighbour_number=14)`

最小割图分割。

```python
ct.min_cut_segmentation(name: str, sigma: float = 0.25, radius: float = 0.04,
                        weight: float = 0.8, neighbour_number: int = 14) -> list[ct.Cloud]
```

#### `ct.morphological_filter(name, negative=False, max_window_size=33, slope=1.0, max_distance=3.0, initial_distance=0.5, cell_size=1.0, base=2.0)`

渐进式形态学地面滤波。

```python
ct.morphological_filter(name: str, negative: bool = False, max_window_size: int = 33,
                        slope: float = 1.0, max_distance: float = 3.0,
                        initial_distance: float = 0.5, cell_size: float = 1.0,
                        base: float = 2.0) -> list[ct.Cloud]
```

#### `ct.seeded_hue_segmentation(name, negative=False, tolerance=5.0, delta_hue=10.0)`

基于色相的种子分割。

```python
ct.seeded_hue_segmentation(name: str, negative: bool = False, tolerance: float = 5.0,
                           delta_hue: float = 10.0) -> list[ct.Cloud]
```

#### `ct.segment_differences(name, target, sqr_threshold=0.001)`

分割两个已配准点云之间的差异。

```python
ct.segment_differences(name: str, target: str, sqr_threshold: float = 0.001) -> list[ct.Cloud]
```

#### `ct.extract_polygonal_prism_data(name, hull, negative=False, height_min=0.0, height_max=10.0, vpx=0.0, vpy=0.0, vpz=0.0)`

从凸包多边形棱柱内提取点。

```python
ct.extract_polygonal_prism_data(name: str, hull: str, negative: bool = False,
                                height_min: float = 0.0, height_max: float = 10.0,
                                vpx: float = 0, vpy: float = 0, vpz: float = 0) -> list[ct.Cloud]
```

**参数**:
- `hull` (str) - 凸包点云的名称

---

## 曲面重建与网格

所有重建函数返回 `ct.Mesh` 对象。

### `ct.poisson(name, depth=8, min_depth=5, point_weight=4.0, scale=1.1, solver_divide=8, iso_divide=8, samples_per_node=1.5, confidence=False, output_polygons=False, manifold=False)`

泊松曲面重建。

```python
ct.poisson(name: str, depth: int = 8, min_depth: int = 5, point_weight: float = 4.0,
           scale: float = 1.1, solver_divide: int = 8, iso_divide: int = 8,
           samples_per_node: float = 1.5, confidence: bool = False,
           output_polygons: bool = False, manifold: bool = False) -> ct.Mesh
```

**前置条件**: 需要法线。

**示例**:
```python
with_normals = ct.estimate_normals("terrain", k_search=30)
mesh = ct.poisson("terrain_normals", depth=9)
ct.show_mesh(mesh, "terrain_mesh")
```

### `ct.greedy_triangulation(name, mu=2.5, nnn=12, radius=0.025, min_angle=12.0, max_angle=150.0, ep=180.0, consistent=False, consistent_ordering=False)`

贪婪投影三角化。

```python
ct.greedy_triangulation(name: str, mu: float = 2.5, nnn: int = 12, radius: float = 0.025,
                        min_angle: float = 12.0, max_angle: float = 150.0,
                        ep: float = 180.0, consistent: bool = False,
                        consistent_ordering: bool = False) -> ct.Mesh
```

**前置条件**: 需要法线。

### `ct.marching_cubes_hoppe(name, iso_level=0.0, res_x=50, res_y=50, res_z=50, percentage=10.0, dist_ignore=0.0)`

Marching Cubes Hoppe 重建。

```python
ct.marching_cubes_hoppe(name: str, iso_level: float = 0.0, res_x: int = 50,
                        res_y: int = 50, res_z: int = 50, percentage: float = 10.0,
                        dist_ignore: float = 0.0) -> ct.Mesh
```

### `ct.marching_cubes_rbf(name, iso_level=0.0, res_x=50, res_y=50, res_z=50, percentage=10.0, epsilon=0.0)`

Marching Cubes RBF 重建。

```python
ct.marching_cubes_rbf(name: str, iso_level: float = 0.0, res_x: int = 50,
                      res_y: int = 50, res_z: int = 50, percentage: float = 10.0,
                      epsilon: float = 0.0) -> ct.Mesh
```

### `ct.grid_projection(name, resolution=0.001, padding_size=3, k=0, max_binary_search_level=10)`

网格投影重建。

```python
ct.grid_projection(name: str, resolution: float = 0.001, padding_size: int = 3,
                  k: int = 0, max_binary_search_level: int = 10) -> ct.Mesh
```

**前置条件**: 需要法线。

### `ct.convex_hull(name, compute_area_volume=False, dimension=3)`

凸包重建。

```python
ct.convex_hull(name: str, compute_area_volume: bool = False, dimension: int = 3) -> ct.Mesh
```

### `ct.concave_hull(name, alpha=0.1, keep_information=False, dimension=3)`

Alpha Shape (凹包) 重建。

```python
ct.concave_hull(name: str, alpha: float = 0.1, keep_information: bool = False,
                dimension: int = 3) -> ct.Mesh
```

### `ct.show_mesh(mesh, id)` / `ct.remove_mesh(id)`

显示/移除网格。

```python
ct.show_mesh(mesh: ct.Mesh, id: str) -> None
ct.remove_mesh(id: str) -> None
```

---

## 地面与植被分割

### `ct.csf_filter(name, smooth=True, time_step=1.0, class_threshold=0.5, cloth_resolution=2.0, rigidness=3, iterations=500)`

CSF (Cloth Simulation Filter) 地面分割。

```python
ct.csf_filter(name: str, smooth: bool = True, time_step: float = 1.0,
              class_threshold: float = 0.5, cloth_resolution: float = 2.0,
              rigidness: int = 3, iterations: int = 500) -> dict
```

**返回值**:
```python
{
    "ground": ct.Cloud | None,     # 地面点
    "off_ground": ct.Cloud | None, # 非地面点
    "time_ms": float
}
```

**示例**:
```python
result = ct.csf_filter("lidar_scan", cloth_resolution=1.0, rigidness=2, iterations=300)
if result["ground"]:
    result["ground"].show("ground")
    result["off_ground"].show("off_ground")
    ct.printI(f"地面: {result['ground'].size()} 点, 非地面: {result['off_ground'].size()} 点")
```

### `ct.veg_filter(name, index_type=0, threshold=0.35)`

植被分割。

```python
ct.veg_filter(name: str, index_type: int = 0, threshold: float = 0.35) -> dict
```

**参数**:
- `index_type` (int) - 植被指数：0=ExG_ExR, 1=ExG, 2=NGRDI, 3=CIVE
- `threshold` (float) - 分割阈值

**返回值**:
```python
{
    "vegetation": ct.Cloud | None,      # 植被点
    "non_vegetation": ct.Cloud | None,  # 非植被点
    "time_ms": float
}
```

**前置条件**: 点云需要包含 RGB 颜色。

**示例**:
```python
result = ct.veg_filter("rgb_scan", index_type=1, threshold=0.3)
if result["vegetation"]:
    result["vegetation"].show("vegetation")
    result["non_vegetation"].show("non_vegetation")
```

---

## 距离计算

### `ct.cloud_cloud_distance(ref_name, comp_name, method=0, k_knn=6, radius=0.5)`

计算两个点云之间的距离。

```python
ct.cloud_cloud_distance(ref_name: str, comp_name: str, method: int = 0,
                        k_knn: int = 6, radius: float = 0.5) -> dict
```

**参数**:
- `ref_name` (str) - 参考点云名称
- `comp_name` (str) - 比较点云名称
- `method` (int) - 距离计算方法：
  - 0 = C2C_NEAREST（最近邻距离）
  - 1 = C2C_KNN_MEAN（K 近邻平均距离）
  - 2 = C2C_RADIUS_MEAN（半径内平均距离）
- `k_knn` (int) - KNN 的 K 值
- `radius` (float) - 半径搜索范围

**返回值**:
```python
{
    "distances": ndarray | None,  # 每个参考点的距离值
    "time_ms": float
}
```

**示例**:
```python
result = ct.cloud_cloud_distance("before", "after", method=0, k_knn=6)
if result["distances"] is not None:
    import numpy as np
    dists = result["distances"]
    ct.printI(f"平均距离: {np.mean(dists):.4f}")
    ct.printI(f"最大距离: {np.max(dists):.4f}")
    ct.printI(f"RMS 距离: {np.sqrt(np.mean(dists**2)):.4f}")
```

### `ct.closest_point_set(source_name, target_name, max_distance=1.0)`

提取目标点云中距离源点云最近的点集。

```python
ct.closest_point_set(source_name: str, target_name: str, max_distance: float = 1.0) -> ct.Cloud
```

**返回值**: 投影后的点集 `ct.Cloud`
