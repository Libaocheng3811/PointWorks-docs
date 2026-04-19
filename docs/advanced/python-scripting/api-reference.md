# Python API 参考

PointWorks 通过 pybind11 将 C++ 核心功能暴露为 Python `ct` 模块。

## `ct` 模块

### 日志函数

```python
ct.printI(message: str)   # 信息日志
ct.printW(message: str)   # 警告日志
ct.printE(message: str)   # 错误日志
```

### 点云访问

```python
ct.get_cloud(name: str) -> Cloud | None  # 按名称获取点云
```

## `ct.Cloud` 类

### 属性查询

| 方法 | 返回类型 | 说明 |
|------|----------|------|
| `size()` | `int` | 总点数 |
| `has_colors()` | `bool` | 是否有颜色 |
| `has_normals()` | `bool` | 是否有法线 |
| `num_blocks()` | `int` | Block 数量 |

### 全量数据访问

```python
xyz = cloud.to_numpy()         # ndarray (N, 3), float32
colors = cloud.get_colors()    # ndarray (N, 3), uint8
normals = cloud.get_normals()  # ndarray (N, 3), float32
```

!!! warning "内存注意"
    全量访问会合并所有 Block，产生完整拷贝。大点云建议使用按 Block 访问。

### 按 Block 零拷贝访问

```python
# 读取
xyz = cloud.block_to_numpy(i)        # ndarray (M, 3), float32
colors = cloud.block_get_colors(i)   # ndarray (M, 3), uint8
normals = cloud.block_get_normals(i) # ndarray (M, 3), float32

# 写入
cloud.block_set_numpy(i, xyz)
cloud.block_set_colors(i, colors)
cloud.block_set_normals(i, normals)
cloud.block_mark_dirty(i)            # 标记为已修改

# 刷新渲染
cloud.refresh()
```

## 使用示例

```python
import ct
import numpy as np

cloud = ct.get_cloud("my_cloud")
if cloud:
    ct.printI(f"点数: {cloud.size()}")

    for i in range(cloud.num_blocks()):
        xyz = cloud.block_to_numpy(i)
        ct.printI(f"Block {i}: {xyz.shape[0]} points")
```

!!! tip "提示"
    详细的脚本编写请参考 [Python 自动化实战](../../tutorials/python-automation.md)。
