# 超体素分割

基于体素结构、法线和颜色值的超体素分割算法。将点云过分割为一组紧凑的超体素区域，每个超体素内的点具有相似的特征。超体素分割常作为其他处理（如对象识别、区域合并）的前处理步骤。

## 入口路径

**菜单**: Segmentation > Supervoxel

**源码**: `src/tool/segmentation/supervoxel_dialog.h`

**算法**: `ct::Segmentation::SupervoxelClustering()`

## 参数说明

| 参数 | 控件 | 默认值 | 说明 |
|------|------|--------|------|
| Voxel Resolution | DoubleSpinBox | — | 八叉树体素分辨率（米），控制体素化粒度 |
| Seed Resolution | DoubleSpinBox | — | 种子体素分辨率（米），决定超体素的大小/数量 |
| Color Importance | DoubleSpinBox | — | 颜色对超体素分割的重要性权重 |
| Spatial Importance | DoubleSpinBox | — | 空间距离对超体素分割的重要性权重 |
| Normal Importance | DoubleSpinBox | — | 法线对超体素分割的重要性权重 |
| Camera Transform | CheckBox | — | 是否使用单相机变换（适合固定视角扫描数据） |
| Split | CheckBox | — | 是否将每个超体素拆分为独立点云 |

## 操作步骤

1. 选中点云后打开 Supervoxel 对话框
2. 设置 **Voxel Resolution**：通常为点间距的 1~2 倍，控制体素化精度
3. 设置 **Seed Resolution**：通常为 Voxel Resolution 的 5~20 倍，值越大赛体素越少
4. 调整三个重要性权重：
   - 颜色权重高时，颜色相似的点倾向聚在同一超体素
   - 空间权重高时，空间邻近的点倾向聚在同一超体素
   - 法线权重高时，法线方向一致的点倾向聚在同一超体素
5. 若数据来自固定视角扫描，可勾选 **Camera Transform**
6. 点击 **Apply** 执行分割

> **Seed Resolution** 是最关键的参数。较大的值产生较少的超体素（粗粒度），较小的值产生更多的超体素（细粒度）。建议先用较大值快速预览，再逐步减小到满意的效果。

> 超体素分割要求点云包含法线信息。若点云无法线，请先通过 Edit > Normals 进行法线估计。

## 输出

执行后，点云被分割为多个超体素区域。若勾选 **Split**，每个超体素将作为独立点云添加到 CloudTree，并以随机颜色着色以便区分。
