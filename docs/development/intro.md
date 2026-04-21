---
title: 开发指南
---

# 开发指南

本部分面向 PointWorks 的开发者，介绍如何编译构建、理解项目架构以及扩展功能。

## 指南列表

| 页面 | 说明 |
|------|------|
| [编译构建](build) | 依赖安装、CMake 配置、编译选项、输出目录 |
| [项目架构](architecture) | libs/ + src/ 两层架构、各模块职责、依赖关系 |
| [添加新算法](adding-algorithm) | 如何在 libs/algorithm 中添加新的点云处理算法 |
| [添加新文件格式](adding-file-format) | 如何支持新的点云或模型文件格式 |
| [扩展 Python API](extending-python) | 如何通过 pybind11 暴露新的 Python 接口 |
| [常见问题](faq) | 编译错误、运行时问题等常见问题及解决方案 |

## 快速开始

### 环境要求

| 依赖 | 版本要求 |
|------|----------|
| CMake | 3.28+ |
| 编译器 | MSVC 2019+ (C++17) |
| Qt | 5.15.2 |
| VTK | 9.1.0 |
| PCL | 1.12.1 |
| Python | 3.9 (EXACT) |
| pybind11 | 随 3rdparty 引入 |

### 编译

```bash
cmake -B build -S . -DCMAKE_BUILD_TYPE=Release
cmake --build build --config Release
```

### 输出

- `build/bin/pointworks.exe` - 可执行文件
- `build/bin/*.dll` - 动态库（ct_core, ct_viz, ct_io）

## 开发规范

### Git 提交规范

```
<type>(<scope>): <description>
```

**类型**: `feat` | `fix` | `docs` | `style` | `refactor` | `perf` | `test` | `chore`

**示例**:
```
feat(ui): 添加导出按钮
fix(core): 修复空指针崩溃
refactor(render): 优化八叉树渲染性能
```

### 核心约束

- **分层原则**: `libs/` 层严禁依赖 `src/` 层
- **线程安全**: 耗时算法严禁在主线程执行
- **智能指针**: 所有 PCL 对象使用 `Ptr` 类型，禁止裸指针
- **Python 线程安全**: Python 代码只在 `PythonWorker` 中持有 GIL 执行
