# 全局坐标偏移

本文详细说明 PointWorks 如何处理大坐标系（如 UTM）下的精度丢失问题。

## 问题背景

### 精度丢失原因

GPU 渲染使用 32 位单精度浮点数（float），其有效精度约为 7 位十进制数字。当坐标值很大时：

```
UTM 坐标示例：
X = 500,000.123 m  -> float 表示：500000.125（丢失 0.002m）
Y = 4,000,000.456 m -> float 表示：4000000.5（丢失 0.044m）
```

这导致以下视觉问题：

- 点云渲染时出现 **抖动**（点的位置在帧间跳变）
- 点云整体 **偏移或变形**
- 近距离观察时点呈 **网格状分布**

### 受影响的坐标系

| 坐标系 | 典型坐标范围 | 是否需要偏移 |
|--------|-------------|-------------|
| UTM Zone 50N | X: 100,000~900,000, Y: 0~9,999,000 | 是 |
| CGCS2000 | X: 100,000~900,000, Y: 0~9,999,000 | 是 |
| WGS84 地理坐标 | 经度 116~117, 纬度 39~40 | 否（值较小） |
| 局部坐标 | 0~10,000 | 否 |
| 相对坐标 | -1,000~1,000 | 否 |

## 解决方案

### 基本原理

在加载点云时减去一个偏移量，使坐标值变小。渲染和内部处理使用偏移后的小坐标。保存文件时加回偏移量。

```cpp
// 加载时
pt.x -= shift.x();
pt.y -= shift.y();
pt.z -= shift.z();

// 保存时
pt.x += shift.x();
pt.y += shift.y();
pt.z += shift.z();
```

### 偏移值计算

PointWorks 自动计算建议偏移值为点云质心坐标：

```cpp
Eigen::Vector3d calculateCentroid(Cloud::Ptr cloud) {
    double sx = 0, sy = 0, sz = 0;
    size_t count = 0;
    // 遍历所有 Block 计算质心
    for (auto& block : cloud->blocks()) {
        for (auto& pt : block->points()) {
            sx += pt.x; sy += pt.y; sz += pt.z;
            count++;
        }
    }
    return {sx/count, sy/count, sz/count};
}
```

## 使用方式

### 自动弹窗

加载使用大坐标系的点云时，PointWorks 会自动检测并弹出 **Global Shift Dialog**：

1. 对话框显示自动计算的偏移值
2. 用户可以接受建议值或手动输入
3. 勾选 **Remember** 可记忆偏移值，后续加载同一区域数据时自动应用

### 手动设置

通过菜单可以手动设置偏移：

- 输入 X、Y、Z 三个分量的偏移值
- 设置为 0 禁用偏移
- 保存设置供后续使用

### GlobalShiftDialog

`GlobalShiftDialog` 位于 `libs/ui/dialog/globalshiftdialog.h`，继承自 `CustomDialog`：

```cpp
class GlobalShiftDialog : public ct::CustomDialog {
    Q_OBJECT
public:
    // 获取用户设置的偏移值
    Eigen::Vector3d getShift() const;
    // 是否记忆偏移
    bool remember() const;
};
```

## 数据流

```
加载文件 (原始坐标)
    |
    +-- 检测坐标范围 -> 是否需要偏移？
    |     |
    |     +-- 是 -> 弹出 GlobalShiftDialog
    |             计算偏移值
    |             所有坐标减去偏移
    |             存储偏移到 Cloud::m_global_shift
    |     |
    |     +-- 否 -> 直接使用原始坐标
    |
    v
内部处理（偏移后坐标）
    |
    +-- 渲染：使用偏移后坐标（精度良好）
    +-- 算法：使用偏移后坐标
    +-- Python API：返回偏移后坐标
    |
    v
保存文件
    |
    +-- 所有坐标加回偏移 -> 恢复原始坐标系
```

## 注意事项

### 多点云对齐

加载多份点云时，确保所有点云使用相同的偏移值：

!!! warning "偏移一致性"
    如果两份点云使用不同的偏移值，它们在视图中不会对齐。建议：
    - 使用第一份点云的偏移值作为基准
    - 后续加载的点云手动设置相同偏移
    - 或勾选 **Remember** 记忆偏移

### Python API 中的偏移

通过 Python API 获取的点云坐标是偏移后的坐标：

```python
import ct

cloud = ct.get_cloud("my_cloud")
xyz = cloud.to_numpy()  # 偏移后的坐标
```

!!! info "偏移值获取"
    当前 Python API 返回的是偏移后的坐标。如需原始坐标，需通过其他方式获取偏移值后手动加回。

### 配准与偏移

配准操作在偏移后的坐标系中进行。配准变换（旋转+平移）不受偏移影响，因为：

- 旋转不受平移影响
- 配准计算的平移量是在偏移坐标系内的相对值
- 保存时加回偏移不影响配准结果

## 实现细节

### Cloud 类中的偏移存储

```cpp
class Cloud {
    Eigen::Vector3d m_global_shift;  // 全局偏移量
public:
    void setGlobalShift(const Eigen::Vector3d& shift);
    Eigen::Vector3d getGlobalShift() const;
};
```

### 文件格式处理

| 格式 | 偏移检测方式 |
|------|-------------|
| LAS/LAZ | 从 Header 中读取坐标范围，自动检测 |
| E57 | 从 Metadata 中读取坐标信息 |
| PLY/PCD | 扫描前几个点判断坐标范围 |
| TXT | 解析后判断坐标范围 |

## 相关主题

- [大点云处理策略](large-pointcloud.md) - 整体大点云处理方案
- [基础工作流](../tutorials/basic-workflow.md) - 包含偏移设置的基础教程
