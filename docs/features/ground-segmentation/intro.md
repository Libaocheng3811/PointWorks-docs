---
title: CSF 地面分割
---

# CSF 地面分割

基于布料模拟滤波 (Cloth Simulation Filter, CSF) 的地面点提取算法。该算法通过在点云上方放置一块虚拟布料，布料在重力作用下下落并与地面点交互，最终布料形状即为地面近似。

## 入口路径

**菜单**: Plugins > CSF (Cloth Simulation Filter)

**源码**: `src/plugins/csfplugin.h`

**算法**: `ct::CSFFilter::apply()`（`libs/algorithm/csffilter.h`）

**第三方库**: `3rdparty/CSF/`

## 参数说明

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| Cloth Resolution | double | — | 布料网格分辨率（米），控制布料粒子的间距，值越小子地面越精细 |
| Rigidness | int (1~3) | — | 布料硬度等级：1=柔性、2=中等、3=刚性。地形复杂时用柔性，平坦时用刚性 |
| Iterations | int | — | 模拟迭代次数，值越大布料越贴合地面，但计算时间越长 |
| Time Step | float | — | 模拟时间步长，影响布料下落速度和稳定性 |
| Class Threshold | double | — | 分类阈值（米），布料最终位置与点之间的距离小于此值则该点被判定为地面点 |
| Slope Smooth | bool | — | 是否启用坡度平滑后处理，可改善陡坡区域的分割效果 |

## 操作步骤

1. 在 CloudTree 中选中待分割的点云
2. 打开 Plugins > CSF 对话框
3. 设置 **Cloth Resolution**：
   - 建议 0.5~2.0 米，点密度高时用较小值
4. 选择 **Rigidness**：
   - 地形平坦：选择刚性 (3)
   - 地形有起伏：选择中等 (2)
   - 地形复杂/山地：选择柔性 (1)
5. 设置 **Iterations**（建议 200~500）
6. 调整 **Class Threshold**（建议 0.5 米）
7. 勾选 **Slope Smooth** 以处理坡度区域
8. 点击 **Apply** 执行分割

> CSF 算法对大场景机载 LiDAR 数据效果最佳。对于地面车辆或室内扫描数据，可能需要调整刚性和分辨率参数。

## 输出

执行完成后生成两个点云：

- **Ground**: 地面点集
- **Off-Ground**: 非地面点集（建筑物、植被等）

两个点云自动添加到 CloudTree，控制台输出处理耗时。
