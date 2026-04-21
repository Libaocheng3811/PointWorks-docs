---
title: 形态学滤波
---

# 形态学滤波

基于渐进形态学滤波算法将点云分割为地面点和非地面点。该算法通过逐渐增大的滤波窗口，结合坡度阈值，逐步剔除建筑物、植被等非地面点。适用于机载 LiDAR 点云的地面提取。

## 入口路径

**菜单**: Segmentation > Morphological Filter

**源码**: `src/tool/segmentation/morphological_filter_dialog.h`

**算法**: `ct::Segmentation::MorphologicalFilter()`

## 参数说明

| 参数 | 控件 | 默认值 | 说明 |
|------|------|--------|------|
| Max Window Size | SpinBox | — | 最大滤波窗口大小（像素），窗口从初始大小逐步增大到此值 |
| Slope | DoubleSpinBox | — | 坡度值，用于计算高度阈值，值越大保留的地面越多 |
| Max Distance | DoubleSpinBox | — | 被视为地面回波的最大高度差（米） |
| Initial Distance | DoubleSpinBox | — | 被视为地面回波的初始高度差（米） |
| Cell Size | DoubleSpinBox | — | 网格单元大小（米），影响滤波的空间分辨率 |
| Base | DoubleSpinBox | — | 渐进窗口大小的基数，控制窗口增长速率 |
| Negative | CheckBox | — | 反转结果：勾选时提取非地面点，不勾选时提取地面点 |

## 操作步骤

1. 选中点云后打开 Morphological Filter 对话框
2. 设置 **Cell Size** 以确定网格分辨率（通常为点间距的 2~5 倍）
3. 设置 **Max Window Size**（取决于最大建筑物尺寸）
4. 调整 **Slope** 参数（地形平坦时设小，山地时设大）
5. 设置 **Max Distance** 为地面最大高程差
6. 点击 **Preview** 预览分割效果（临时显示）
7. 确认效果后点击 **Apply** 正式执行
8. 点击 **Reset** 撤销预览结果

> 该工具支持 **Preview 预览**功能。预览结果以临时点云的形式添加到 CloudTree（前缀 `mf_preview_`），关闭对话框时自动清理。

## 输出

执行后将生成两个点云：

- **地面点云**: 满足形态学滤波条件的低洼点
- **非地面点云**: 被剔除的建筑物、植被等

> **参数调优建议**: Cell Size 过大会导致细节丢失，过小则滤波效果减弱。建议先使用 Preview 功能观察效果后再 Apply。
