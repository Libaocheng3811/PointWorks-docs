---
title: 大点云处理策略
---

# 大点云处理策略

本文详细介绍 PointWorks 处理大规模点云（千万级到亿级点）所采用的策略和技术。

## 概述

大点云处理面临三大挑战：

1. **内存压力** - 亿级点云数据可达数十 GB
2. **渲染性能** - 实时渲染亿级点需要高效的 GPU 策略
3. **计算效率** - 算法处理时间随点数增长

PointWorks 采用以下核心策略应对这些挑战：

```
流式 I/O -> 八叉树分区 -> LOD 生成 -> 视锥剔除 -> SSE 动态渲染
```

## 流式 I/O

### 问题

传统方式需要将整个文件读入内存后再处理。对于 10GB 的 LAS 文件，这意味着：

- 需要至少 10GB 可用内存
- 加载期间 UI 完全无响应
- 无法中途取消

### 解决方案

PointWorks 的 `FileIO` 模块采用流式加载策略：

```cpp
// 以 LAS 文件为例
bool FileIO::loadLAS(const QString& filename, Cloud::Ptr& cloud) {
    // 1. 读取 Header 获取包围盒信息
    LASreader* reader = lasreadopener.open(filename);

    // 2. 初始化八叉树结构
    cloud->initOctree(globalBox);

    // 3. 流式读取，每批 50 万点
    CloudBatch batch;
    batch.reserve(BATCH_SIZE);  // 500,000

    while (reader->read_point()) {
        batch.points.push_back(pt);
        if (batch.points.size() >= BATCH_SIZE) {
            batch.flushTo(cloud);       // 写入八叉树
            emit progress(percent);     // 更新进度条
        }
    }

    // 4. 生成 LOD 数据
    cloud->generateLOD();
}
```

### 优势

- **低峰值内存** - 任何时刻只需 `BATCH_SIZE` 大小的缓冲区
- **可取消** - 每批之间检查取消标志
- **实时反馈** - 进度条显示加载百分比
- **渐进可见** - 数据加载过程中即可开始渲染

## 八叉树空间索引

### 结构

```
OctreeNode
  m_children[8]         // 8 个子节点
  m_block               // 叶子节点的点云数据（CloudBlock）
  m_lod_points          // LOD 数据（蓄水池采样）
  m_box                 // 包围盒
  m_depth               // 深度
  m_total_points_in_node // 点数统计
```

### 自适应配置

PointWorks 根据点云总量自动选择模式：

```cpp
void Cloud::calculateAdaptiveConfig(size_t total_points) {
    if (total_points < 10'000'000) {
        // 直通模式：禁用八叉树
        config.use_octree = false;
    } else {
        // 八叉树模式：自动计算参数
        config.use_octree = true;
        config.maxPointsPerBlock = 60'000;
    }
}
```

### CloudBlock 数据结构

```cpp
class CloudBlock {
    std::vector<PointXYZ> m_points;                // 坐标（必需，AOS 格式）
    std::unique_ptr<std::vector<RGB>> m_colors;    // 颜色（可选）
    std::unique_ptr<std::vector<CompressedNormal>> m_normals; // 压缩法线
    QMap<QString, std::vector<float>> m_scalar_fields;        // 标量场
    Box m_box;                                      // 包围盒
    std::shared_ptr<void> m_vtk_polydata;           // VTK 缓存
    bool m_is_dirty = true;                         // 脏标记
};
```

:::info[AOS 格式]
`CloudBlock` 使用 AOS（Array of Structures）格式存储：`std::vector<PointXYZ>` 而非分离的 `x[]`, `y[]`, `z[]` 数组。这提供了更好的缓存局部性。

:::
### 压缩法线

法线使用位域压缩，节省 50% 内存：

```cpp
struct CompressedNormal {
    int nx : 11;  // [-1, 1] 映射到 [0, 2047]
    int ny : 11;  // 同上
    int nz : 10;  // 同上
};  // 总计 32 bit = 4 bytes（原始 float[3] = 12 bytes）
```

## LOD（Level of Detail）

### 生成策略

LOD 数据通过 **蓄水池采样（Reservoir Sampling）** 在流式加载时实时生成：

```cpp
void OctreeNode::addPointForLOD(const PointXYZRGB& point) {
    if (m_lod_points.size() < capacity) {
        m_lod_points.push_back(point);
    } else {
        // 随机替换概率 = capacity / current_n
        if (rand() % current_n < capacity) {
            m_lod_points[rand() % capacity] = point;
        }
    }
}
```

### LOD 层级

每个八叉树节点在所有层级都维护 LOD 数据：

| 层级 | 数据来源 | 点数 |
|------|----------|------|
| 根节点 | 全局采样 | 数百点 |
| 中间层 | 子节点汇总 | 数千点 |
| 叶子节点 | 原始数据 | 最多 6 万点 |

## 高性能渲染

### OctreeRenderer

`OctreeRenderer` 是 PointWorks 的核心渲染引擎，基于 VTK 实现，采用 SSE 遍历策略。

### SSE（Screen Space Error）遍历

SSE 策略根据节点的屏幕投影大小决定渲染精细度：

```cpp
void OctreeRenderer::update() {
    // 1. 检查相机是否移动
    if (!camChanged && !m_force_update) return;

    // 2. 优先队列遍历（按屏幕投影大小排序）
    std::priority_queue<PriorityNode> pq;
    pq.push({root, projectSize(root->m_box)});

    while (!pq.empty()) {
        auto node = pq.top().node;
        float screenSize = projectSize(node->m_box);

        if (screenSize > m_base_threshold && node->hasChildren()) {
            // 屏幕投影大 -> 继续细分子节点
            for (auto child : node->m_children) {
                pq.push({child, projectSize(child->m_box)});
            }
        } else {
            // 屏幕投影小 -> 使用 LOD 或 Block 渲染
            bool useLOD = isMoving();  // 交互时用 LOD
            vtkActor* actor = getOrCreateActor(node, useLOD);
        }
    }
}
```

### 动态阈值

| 状态 | 阈值 | 说明 |
|------|------|------|
| **交互中** | 降低（宽松） | 使用粗糙 LOD，保持帧率 |
| **静止** | 提高（严格） | 使用精细 Block，显示细节 |

### 视锥剔除

只渲染相机视锥内的节点：

```cpp
bool isBoxInFrustum(const Box& box, const double* planes) {
    for (int i = 0; i < 6; ++i) {  // 6 个裁剪面
        // 检查包围盒 8 个顶点是否都在平面外侧
        // 如果是，则此节点不可见，跳过
    }
    return true;  // 至少部分可见
}
```

### Actor 对象池

复用 VTK Actor 对象，避免频繁创建/销毁 GPU 资源：

- 最多维护 **500 个 Actor**
- 使用对象池模式，渲染结束后回收
- 新帧需要的 Actor 从池中获取，而非重新创建

## 全局坐标偏移

大坐标值（如 UTM 坐标 x=500000）会导致 GPU 单精度浮点数精度丢失。详见 [全局坐标偏移](global-shift)。

## 性能调优建议

### 加载优化

| 场景 | 建议 |
|------|------|
| 文件过大（> 5GB） | 先使用外部工具裁剪到感兴趣区域 |
| 密度过高 | 加载后使用 VoxelGrid 降采样 |
| 多份小文件 | 合并为单份大文件更高效 |

### 渲染优化

| 场景 | 建议 |
|------|------|
| 交互卡顿 | 系统自动降低 LOD 阈值，无需手动操作 |
| 显示不完整 | 检查 Actor 池上限（默认 500）是否不足 |
| 点太密/太疏 | 调整 SSE 阈值参数 |

### 算法优化

| 场景 | 建议 |
|------|------|
| 滤波速度慢 | 对大点云先降采样再滤波 |
| 配准耗时 | 先裁剪到重叠区域 |
| 内存不足 | 减少 `maxPointsPerBlock` 或分块处理 |

:::warning[PCL 转换限制]
PointWorks 内部使用自定义 `Cloud` 数据结构。完整的 `toPCL()` / `fromPCL()` 转换在大点云下可能导致内存翻倍，需谨慎使用。算法模块已针对大点云做了优化。

:::
## 相关主题

- [全局坐标偏移](global-shift) - 大坐标精度问题详解
- [项目架构](../development/architecture) - 整体架构设计
