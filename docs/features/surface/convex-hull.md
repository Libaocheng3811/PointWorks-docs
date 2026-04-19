# 凸包计算

计算点云的凸包 (Convex Hull) 或凹包 (Concave Hull / Alpha Shape) 几何边界。凸包是包含所有点的最小凸多面体；凹包则能更好地贴合点云的实际形状。

## 入口路径

**菜单**: Mesh > Compute Hull

**源码**: `src/tool/mesh/compute_hull_dialog.h`

**算法**: `ct::Surface::ConvexHull()` / `ConcaveHull()`

## 参数说明

| 参数 | 控件 | 说明 |
|------|------|------|
| Convex | RadioButton | 计算凸包 |
| Concave | RadioButton | 计算 Alpha 形状（凹包） |
| Alpha | DoubleSpinBox | Alpha 值，仅凹包模式可用。限制生成的壳体段大小，值越小壳体越贴合 |
| 3D | RadioButton | 三维凸包/凹包 |
| 2D | RadioButton | 二维凸包/凹包（投影到 XY 平面计算） |
| Keep Info | CheckBox | 保留点的附加信息（颜色、法线等） |

## 操作步骤

1. 选中点云后打开 Compute Hull 对话框
2. 选择 **Convex** 或 **Concave**：
   - 凸包：快速计算，适合获取整体包围形状
   - 凹包：需要设置 Alpha 值，可更好地贴合点云轮廓
3. 选择 **3D** 或 **2D**：
   - 3D: 计算完整三维壳体
   - 2D: 将点投影到 XY 平面后计算二维多边形
4. 勾选 **Keep Info** 以在结果中保留颜色和法线
5. 点击 **Compute** 执行计算

> **Alpha 值调优**: Alpha 值过大时凹包退化为凸包，过小时可能产生碎片。建议从较大值（如包围盒对角线长度的 1/10）开始，逐步减小观察效果。

## 输出

计算结果以三角网格的形式添加到 CloudTree。控制台将输出壳体的面积和体积信息（当维度为 3D 时）。
