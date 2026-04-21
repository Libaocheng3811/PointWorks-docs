---
title: 云对网格距离
---

# 云对网格距离

计算点云到三角网格模型之间的逐点距离。支持有符号距离计算，可以判断点位于网格表面的内侧或外侧。

## 入口路径

**菜单**: Distance > Cloud to Mesh

**源码**: `src/tool/distance/cloud_mesh_dist_dialog.h`

**算法**: `ct::DistanceCalculator::calculateC2M()`

## 参数说明

| 参数 | 控件 | 说明 |
|------|------|------|
| Source Cloud | ComboBox | 选择源点云（待计算距离的点云） |
| Target Mesh | ComboBox | 选择目标网格模型 |
| Signed Distance | CheckBox | 是否计算有符号距离：正值=外侧，负值=内侧 |
| Flip Normals | RadioButton | 翻转网格法线方向（当有符号距离正负号不对时使用） |
| Limit Distance | CheckBox | 是否启用最大距离限制 |
| Max Distance | DoubleSpinBox | 超过此距离的点标记为 NaN |
| Color Map | CheckBox | 是否用色度条着色显示距离 |
| Field Name | LineEdit | 标量场名称 |

### 有符号距离说明

当启用 **Signed Distance** 时：

- **正值**: 点位于网格表面外侧（法线方向）
- **负值**: 点位于网格表面内侧（法线反方向）

若正负号与预期相反，选择 **Flip Normals** 翻转法线方向。

## 操作步骤

1. 确保点云和网格模型已加载并处于同一坐标系
2. 打开 Distance > Cloud to Mesh 对话框
3. 选择 **Source Cloud**（点云）
4. 选择 **Target Mesh**（网格模型）
5. 根据需要勾选 **Signed Distance**
6. 可选：设置距离限制和色度映射
7. 点击 **Compute** 开始计算

> 点云到网格的距离计算基于最近三角形面片搜索，计算复杂度高于点对点距离。对于大规模网格，计算时间可能较长。

## 输出

距离结果以标量场存储在源点云中。若启用有符号距离，正负值分别代表外侧和内侧，适合用于质量检测、偏差分析等场景。
