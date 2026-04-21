---
title: 项目架构说明
---

# 项目架构说明

本文详细介绍 PointWorks 的项目架构设计，包括模块划分、依赖关系和核心设计模式。

## 概述

PointWorks 采用 **libs/ + src/ 两层架构**，严格遵循分层依赖原则：`libs/` 层为可复用组件库，`src/` 层为应用层业务逻辑。

## 两层架构

```
+---------------------------------------------+
| 应用层 (src/)                                |
| pointworks 可执行文件                         |
| app/, tool/, edit/, options/, plugins/, python/|
| 业务逻辑与 UI 结合                            |
+---------------------+------------------------+
                      | depends on
+---------------------v------------------------+
| 库层 (libs/)                                 |
| ct_core, ct_viz, ct_io, ct_algorithm,       |
| ct_ui_base, ct_ui_dialog, ct_python         |
| 可复用组件与算法                               |
+----------------------------------------------+
```

## 依赖关系

```
pointworks (executable)
    | depends on
ct_ui_base (STATIC) <-> ct_ui_dialog (STATIC)
    |                    | depends on
    | depends on         ct_core (SHARED)
    |
ct_viz (SHARED) -> ct_io (SHARED) -> ct_core (SHARED)
    |                    |
ct_python (OBJECT)   ct_algorithm (STATIC) -> CSF_Lib
    |                    |
    v                    v
pybind11::embed      PCL, VTK, OpenMP
```

**外部依赖**: Qt5, VTK, PCL, OpenMP, pybind11, Python3, LASlib, E57Format, CSF

:::danger[分层原则]
- **`libs/` 严禁依赖 `src/`** -- 核心库完全独立于界面逻辑
- **`libs/` 内部单向依赖** -- 按依赖方向引用
- **`src/` 可依赖 `libs/` 的所有模块**

:::
## 库模块详解

### ct_core (libs/core/) -- SHARED

核心数据结构与基础设施。

| 文件 | 职责 |
|------|------|
| `cloud.h/cpp` | 点云数据结构（AOS 格式，八叉树管理） |
| `cloudtype.h` | 点类型定义（PointXYZ, RGB, CompressedNormal） |
| `octree.h` | 八叉树空间索引 + LOD 生成 |
| `common.h/cpp` | 通用工具函数 |
| `exports.h` | DLL 导出宏 |
| `field_types.h` | 标量场类型定义 |

### ct_viz (libs/viz/) -- SHARED

基于 VTK 的可视化系统。

| 文件 | 职责 |
|------|------|
| `cloudview.h/cpp` | 三维可视化控件（交互、拾取、相机） |
| `octreerenderer.h/cpp` | 高性能八叉树渲染器（SSE 遍历、Actor 池） |
| `console.h/cpp` | 日志输出控件 |

### ct_io (libs/io/) -- SHARED

文件 I/O 系统，按数据类型拆分为多个编译单元。

| 文件 | 职责 |
|------|------|
| `fileio.h/cpp` | FileIO 调度器 + 公共逻辑 |
| `fileio_pointcloud.cpp` | 点云格式读写（LAS, PLY, PCD, TXT, E57） |
| `fileio_mesh.cpp` | 模型格式读写（OBJ, STL, VTK, IFS） |
| `textured_mesh.h` | 纹理网格数据结构 |
| `projectfile.h/cpp` | 项目文件保存/加载 |

:::info[自动源文件收集]
ct_io 的 CMakeLists.txt 使用 `file(GLOB *.cpp)`，新增 .cpp 文件无需手动注册。

:::
### ct_algorithm (libs/algorithm/) -- STATIC

点云处理算法模块。

| 文件 | 算法 |
|------|------|
| `filters.h/cpp` | 滤波（PassThrough, VoxelGrid, SOR, ROR 等） |
| `features.h/cpp` | 特征描述符（PFH, FPFH, SHOT, ESF 等） |
| `keypoints.h/cpp` | 关键点检测（ISS, Harris3D, SIFT3D） |
| `registration.h/cpp` | 配准（ICP, IA-RANSAC, SCPR, NDT 等） |
| `csffilter.h/cpp` | CSF 地面分割 |
| `vegfilter.h/cpp` | 植被分割（4 种指数 + Otsu） |
| `distancecalculator.h/cpp` | 距离计算 / 变化检测 |
| `normals.h/cpp` | 法线估计 |
| `segmentation.h/cpp` | 点云分割（区域生长、欧式聚类等） |
| `surface.h/cpp` | 曲面重建 |
| `utils.h` | 算法工具函数 |

### ct_ui_base (libs/ui/base/) -- STATIC

基础 UI 控件。

| 文件 | 职责 |
|------|------|
| `cloudtree.h/cpp` | 点云树管理（添加/删除/保存/克隆/合并） |
| `customdialog.h` | 对话框基类（依赖注入、单例管理） |
| `customdock.h` | Dock 窗口基类 |
| `customtree.h/cpp` | 树控件基类 |
| `scenenodetype.h` | 场景节点类型定义 |

### ct_ui_dialog (libs/ui/dialog/) -- STATIC

通用对话框。

| 文件 | 职责 |
|------|------|
| `processingdialog.h` | 进度条 + 取消按钮 |
| `globalshiftdialog.h/cpp/ui` | 全局偏移设置 + 记忆 |
| `fieldmappingdialog.h` | TXT 字段映射 |
| `txtimportdialog.h` | TXT 导入配置 |
| `txtexportdialog.h` | TXT 导出配置 |

### ct_python (libs/python/) -- OBJECT

嵌入式 Python 系统。

| 文件 | 职责 |
|------|------|
| `python_manager.h/cpp` | 解释器生命周期管理（单例） |
| `python_worker.h/cpp` | QThread 脚本执行引擎（GIL + 异步取消） |
| `python_bridge.h/cpp` | 信号桥接 + 线程安全云注册表 |
| `python_bindings.cpp` | pybind11 模块 `ct` |

:::info[OBJECT 库]
ct_python 编译为 OBJECT 库，编译产物直接链接到 pointworks 可执行文件，不产生独立的 .dll/.lib。

:::
## 应用层 (src/)

### app/ -- 主程序

| 文件 | 职责 |
|------|------|
| `main.cpp` | 程序入口（初始化 Python、创建主窗口） |
| `mainwindow.h/cpp/ui` | 主窗口（菜单栏、工具栏、Dock 管理） |
| `projectmanager.h/cpp` | 项目管理器 |
| `recentprojects.h` | 最近项目列表 |

### tool/ -- 处理工具

| 子目录 | 工具 |
|--------|------|
| `cutting.h/cpp/ui` | 裁剪（包围盒、多边形） |
| `pickpoints.h/cpp/ui` | 点拾取 |
| `filters.h/cpp/ui` | 滤波器 |
| `sampling.h/cpp/ui` | 采样 |
| `rangeimage.h/cpp/ui` | 深度图 |
| `measure.h/cpp/ui` | 测量 |
| `align/` | 配准（中心对齐、全局、精细、点对） |
| `segmentation/` | 分割（形状检测、形态学、区域生长、聚类、超体素） |
| `mesh/` | 网格（凸包、边界、曲面重建） |
| `distance/` | 距离（云-云、云-网格、最近点集） |

### edit/ -- 编辑工具

颜色、包围盒、变换、法线、缩放、坐标系

### options/ -- 选项设置

采用 QListWidget 侧栏 + QStackedWidget 模块化设置页架构。

### plugins/ -- 插件

CSF 地面分割、植被分割、变化检测

### python/ -- Python UI

PythonConsole、PythonEditor

## 设计模式

| 模式 | 应用位置 |
|------|----------|
| 工厂模式 | 对话框创建 (`createDialog<T>`, `createModalDialog<T>`) |
| 观察者模式 | 信号/槽机制 |
| 策略模式 | 配准算法选择 |
| 单例模式 | 对话框管理 (`registed_dialogs`)、PythonManager |
| 模板方法 | 插件架构 (`init()` + `onApply()` + `onDone()`) |
| 依赖注入 | CustomDialog（注入 CloudView、CloudTree、Console） |
| 对象池 | OctreeRenderer（Actor 池，最多 500 个） |

## 渲染管线

```
1. 数据存储在 CloudBlock 中（AOS 格式）
2. OctreeRenderer 管理 VTK Actor 对象池
3. 视锥剔除确定可见节点
4. SSE（Screen Space Error）遍历选择 LOD 级别
5. Actor 池复用 GPU 资源（最多 500 个）
```

## 线程模型

| 线程 | 职责 | 说明 |
|------|------|------|
| UI 主线程 | 界面渲染与交互 | VTK 渲染、Qt 事件循环 |
| IO 线程 | 文件读写 | CloudTree 内置 QThread |
| 工作线程 | 耗时算法 | QThread + Worker 模式 |
| Python 线程 | 脚本执行 | PythonWorker（持有 GIL） |

:::danger[线程安全规则]
- 耗时算法严禁在 UI 主线程执行
- Python 代码只在 PythonWorker 中持有 GIL 执行
- UI 操作只通过信号/槽在主线程执行

:::
## 相关主题

- [编译构建](build) - 如何编译项目
- [添加新算法](adding-algorithm) - 扩展算法模块
- [插件开发](../advanced/plugin-development/intro) - 开发自定义插件
