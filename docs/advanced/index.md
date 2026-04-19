# 进阶主题

本部分面向有一定 PointWorks 使用经验的用户，深入介绍高级功能和优化策略。

## 主题列表

### 大点云处理

| 主题 | 说明 |
|------|------|
| [大点云处理策略](large-pointcloud.md) | 流式 I/O、八叉树、LOD 渲染、视锥剔除 |
| [全局坐标偏移](global-shift.md) | 解决大坐标（UTM）精度丢失问题 |

### Python 脚本

| 主题 | 说明 |
|------|------|
| [Python 脚本概述](python-scripting/index.md) | 嵌入式 Python 架构概览 |
| [Python 控制台](python-scripting/console.md) | 交互式 Python 控制台使用 |
| [Python 编辑器](python-scripting/editor.md) | 脚本编辑器使用 |
| [Python API 参考](python-scripting/api-reference.md) | 完整 API 函数签名 |

### 插件开发

| 主题 | 说明 |
|------|------|
| [插件开发指南](plugin-development/index.md) | 如何开发自定义插件 |

## 核心架构概念

理解以下概念有助于更好地使用高级功能：

### 八叉树空间索引

PointWorks 使用八叉树对点云进行空间分区：

- 叶子节点（`CloudBlock`）最多存储 6 万个点
- 点数 < 1000 万时使用直通模式（不分区）
- 点数 >= 1000 万时自动启用八叉树模式

### LOD（Level of Detail）

大规模点云采用多级细节渲染：

- **交互态** - 降低渲染质量，保持流畅交互
- **静止态** - 提高渲染质量，显示精细细节
- **SSE 策略** - 根据屏幕投影大小动态选择 LOD 级别

### 渲染管线

```
CloudBlock 数据 -> OctreeRenderer -> 视锥剔除 -> SSE 遍历 -> Actor 池复用 -> VTK 渲染
```

## 下一步

根据你的需求选择相应主题深入学习。
