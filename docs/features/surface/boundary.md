# 边界提取

从点云中检测并提取边界点。边界点是指位于点云边缘或表面不连续处的点，通过分析每个点的邻域几何特征（如法线角度变化）来识别。

## 入口路径

**菜单**: Mesh > Extract Boundary

**源码**: `src/tool/mesh/extract_boundary_dialog.h`

**算法**: `libs/algorithm/features.h`

## 参数说明

| 参数 | 控件 | 说明 |
|------|------|------|
| K (Neighbors) | SpinBox | KNN 搜索的邻居数量，用于估计局部法线和判断边界 |
| Search Radius | DoubleSpinBox | 半径搜索范围（米），作为 KNN 的替代方案 |
| Angle Threshold | DoubleSpinBox | 角度阈值（度），法线角度变化超过此值的点被判定为边界点 |
| Output Polyline | RadioButton | 以折线方式输出边界 |
| Output Selection | RadioButton | 以选中点集方式输出边界 |

## 操作步骤

1. 选中点云后打开 Extract Boundary 对话框
2. 选择搜索策略：
   - 设置 **K** 使用 K 近邻搜索
   - 或设置 **Search Radius** 使用半径搜索
3. 设置 **Angle Threshold**：
   - 较小的值（如 10~30 度）可检测细微的边界
   - 较大的值（如 60~90 度）只检测显著的断裂
4. 选择输出模式：
   - **Polyline**: 生成有序的边界折线
   - **Selection**: 输出边界点云
5. 点击 **Extract** 执行提取

> 边界提取的质量依赖于法线估计的精度。建议在提取前先确认点云具有可靠的法线数据。

## 输出

根据输出模式，生成边界折线或边界点云，添加到 CloudTree 中。
