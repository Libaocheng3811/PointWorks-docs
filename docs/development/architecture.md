# 项目架构

PointWorks 采用 `libs/` + `src/` 两层架构，严格遵循分层依赖原则。

## 整体架构

```
┌─────────────────────────────────────┐
│           应用层 (src/)              │
│  app/     主窗口、应用入口           │
│  tool/    功能工具（对话框、交互）    │
│  plugin/  插件模块                   │
├─────────────────────────────────────┤
│         公共 UI 层 (libs/ui)         │
│  base/    CloudTree, CloudView      │
│  dialog/  通用对话框基类             │
├─────────────────────────────────────┤
│           核心库 (libs/)             │
│  cloud/   Cloud, Octree, Block      │
│  io/      FileIO, FileReader/Writer │
│  render/  VTK 渲染封装              │
│  algorithm/ 滤波、配准、分割等算法   │
│  python/  Python 嵌入与绑定         │
├─────────────────────────────────────┤
│         第三方库 (external)          │
│  Qt5 / VTK / PCL / pybind11        │
└─────────────────────────────────────┘
```

## 分层原则

1. **`libs/` 严禁依赖 `src/`**：核心库完全独立于界面逻辑
2. **`libs/` 内部单向依赖**：`ui → cloud → io/render/algorithm`
3. **`src/` 可依赖 `libs/` 的所有模块**

## 核心数据结构

### Cloud

`ct::Cloud` 是点云的核心数据结构，内部使用八叉树 + Block 分块管理：

```cpp
class Cloud {
    std::vector<Block::Ptr> blocks_;  // 数据块
    Octree::Ptr octree_;              // 空间索引
    GlobalShift shift_;               // 坐标偏移
};
```

### Block

`ct::Block` 是点云数据的最小管理单元：

```cpp
class Block {
    PointCloud::Ptr data_;     // PCL 点云数据
    BoundingBox bounds_;       // 包围盒
    LOD lod_;                  // LOD 级别
};
```

### FileIO

`ct::FileIO` 使用分发表模式管理文件读写：

```cpp
class FileIO {
    // reader/writer 注册表
    std::map<QString, Reader::Ptr> readers_;
    std::map<QString, Writer::Ptr> writers_;
};
```

## 线程模型

- **主线程**：UI 渲染和交互
- **工作线程**：耗时算法通过 `QtConcurrent::run` 异步执行
- **Python 线程**：`PythonWorker` 独立线程，持有 GIL 执行脚本
