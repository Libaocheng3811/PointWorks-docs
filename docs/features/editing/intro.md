---
title: 编辑工具
---

# 编辑工具

PointWorks 提供丰富的点云和网格编辑工具，用于修改点云的外观、几何属性和坐标信息。编辑工具位于菜单栏 **Edit** 下。

## 功能概览

| 工具 | 菜单路径 | 说明 |
|------|----------|------|
| 颜色设置 | Edit > Colors | 设置点云/网格的显示颜色和标量场着色 |
| 坐标变换 | Edit > Transformation | 平移、旋转和仿射变换 |
| 法线编辑 | Edit > Normals | 法线估计、翻转和更新 |
| 尺度缩放 | Edit > Scale | 沿 XYZ 轴独立缩放 |
| 包围盒 | Edit > Bounding Box | 查看和显示包围盒信息 |
| 坐标系 | Edit > Coordinate | 坐标系操作 |

## 工作方式

编辑工具通常以浮动面板的形式打开，跟随 3D 视图位置。操作流程：

1. 在 CloudTree 中选中目标点云或网格
2. 打开对应的编辑工具
3. 调整参数
4. 使用 **Preview** 预览效果（如果支持）
5. 点击 **Apply** 应用更改

> 编辑操作中，**Apply** 直接修改当前点云，**Add** 则创建修改后的副本并添加到 CloudTree。使用 Add 可保留原始数据。

## 相关文档

- [颜色设置](colors)
- [坐标变换](transformation)
- [法线编辑](normals)
- [尺度缩放](scale)
- [包围盒信息](bounding-box)
