---
title: 编译构建
---

# 编译构建

本文详细介绍 PointWorks 的编译构建流程，包括依赖安装、CMake 配置和编译选项。

## 系统要求

| 依赖 | 版本 | 说明 |
|------|------|------|
| Visual Studio | 2019+ (MSVC 19.28+) | C++17 编译器 |
| CMake | 3.28+ | 构建系统 |
| Qt | 5.15.2 | GUI 框架 |
| VTK | 9.1.0 | 可视化库 |
| PCL | 1.12.1 | 点云库（含 Boost, Eigen, FLANN） |
| Python | 3.9 (EXACT) | 嵌入式解释器 |
| pybind11 | 2.11+ | Python C++ 绑定（git submodule） |
| OpenMP | - | 并行计算（MSVC 内置） |

:::warning[Python 版本]
Python 版本必须精确为 3.9.x，pybind11 要求编译时和运行时 Python 版本完全匹配。

:::
## 编译步骤

### 1. 克隆仓库

```bash
git clone https://github.com/TestDemoCommunity/CloudTool2.git
cd CloudTool2

# 初始化子模块（pybind11）
git submodule update --init --recursive
```

### 2. CMake 配置

```bash
cmake -B build -S . -DCMAKE_BUILD_TYPE=Release
```

**关键 CMake 变量**：

| 变量 | 说明 | 示例 |
|------|------|------|
| `CMAKE_BUILD_TYPE` | 构建类型 | `Release` 或 `Debug` |
| `CMAKE_PREFIX_PATH` | 库搜索路径前缀 | `D:/Qt5.15/5.15.2/msvc2019_64` |
| `MY_NATIVE_PYTHON_DIR` | Python 3.9 安装路径 | `F:/Program Files/Python39` |
| `Python3_ROOT_DIR` | Python 搜索路径 | 同上 |
| `WITH_OPENMP` | 启用 OpenMP 并行 | `TRUE`（默认） |

### 3. 手动指定依赖路径

如果 CMake 无法自动检测到依赖库，手动指定：

```bash
cmake -B build -S . \
    -DCMAKE_PREFIX_PATH="D:/Qt5.15/5.15.2/msvc2019_64;C:/VTK/9.1.0;C:/PCL/1.12.1" \
    -DMY_NATIVE_PYTHON_DIR="F:/Program Files/Python39" \
    -DPython3_ROOT_DIR="F:/Program Files/Python39"
```

### 4. 编译

```bash
cmake --build build --config Release
```

使用多线程加速（MSVC `/MP` 已在 CMake 中默认启用，根据 CPU 核心数自动设置）：

```bash
cmake --build build --config Release -- /m:8
```

### 5. 输出目录

```
build/
  bin/         # pointworks.exe + DLL 文件
    Release/   # Release 版本
    Debug/     # Debug 版本（库文件名带 d 后缀）
  lib/         # 静态库 (.lib)
```

## 编译器标志 (MSVC)

PointWorks 使用以下编译器标志：

| 标志 | 说明 |
|------|------|
| `/MP` | 多处理器编译（自动并行编译） |
| `/fp:precise` | 精确浮点运算 |
| `/bigobj` | 支持大对象文件（Section 数量） |
| `/wd4996` | 禁用 CRT 安全警告 |
| `/source-charset:utf-8` | 源文件 UTF-8 编码 |
| `/std:c++17` | C++17 标准 |

## 库类型与编译配置

| 库 | 类型 | Debug 后缀 | 说明 |
|----|------|-----------|------|
| ct_core | SHARED | `ct_cored.dll` | 核心数据结构 |
| ct_viz | SHARED | `ct_vizd.dll` | 可视化 |
| ct_io | SHARED | `ct_iod.dll` | 文件 I/O |
| ct_algorithm | STATIC | `ct_algorithmd.lib` | 算法模块 |
| ct_ui_base | STATIC | `ct_ui_based.lib` | UI 基础控件 |
| ct_ui_dialog | STATIC | `ct_ui_dialogd.lib` | 通用对话框 |
| ct_python | OBJECT | - | 直接链接到 exe |
| pointworks | EXECUTABLE | `pointworks.exe` | 主程序 |

:::info[Debug 后缀]
Debug 版本的库自动添加 `d` 后缀（如 `ct_cored.dll`），以便与 Release 版本共存于同一目录。

:::
## 预处理器定义

| 宏 | 值 | 说明 |
|----|----|------|
| `ROOT_PATH` | 项目根目录 | 源码路径 |
| `DATA_PATH` | `data/` | 测试数据路径 |
| `PYTHON_HOME` | Python 安装目录 | 嵌入式解释器路径 |
| `CT_LIBRARY` | - | 标记库导出（Windows DLL） |
| `CT_BUILDING_CT_IO` | - | ct_io 内部使用 |

## 第三方库配置

### LAStools (LAS/LAZ 支持)

```cmake
# 3rdparty/LAStools 随项目引入
set(LASZIP_BUILD_STATIC ON CACHE BOOL "Build static laszip" FORCE)
set(LASLIB_BUILD_STATIC ON CACHE BOOL "Build static laslib" FORCE)
add_subdirectory(3rdparty/LAStools)
target_link_libraries(ct_core PRIVATE LASlib)
```

### E57Format

```cmake
# 通过 CMake 自动查找
target_link_libraries(ct_io PRIVATE E57Format)
```

### CSF (布料模拟地面滤波)

```cmake
# 3rdparty/CSF/CMakeLists.txt
add_library(CSF_Lib STATIC ...)
target_link_libraries(CSF_Lib PRIVATE OpenMP::OpenMP_CXX)
target_link_libraries(ct_algorithm PRIVATE CSF_Lib)
```

### pybind11

```cmake
# 通过 git submodule 引入
add_subdirectory(3rdparty/pybind11)
# ct_python 通过 pybind11::embed 链接
```

## 常见编译问题

### 找不到 Qt5

```
Could not find a package configuration file provided by "Qt5"
```

**解决**：设置 `CMAKE_PREFIX_PATH` 指向 Qt 安装目录：

```bash
cmake -DCMAKE_PREFIX_PATH="D:/Qt5.15/5.15.2/msvc2019_64" ..
```

### 找不到 PCL

**解决**：设置 `PCL_DIR`：

```bash
cmake -DPCL_DIR="C:/Program Files/PCL 1.12.1/cmake" ..
```

### 链接错误 LNK2001 / LNK2019

**原因**：依赖库编译配置不一致。

**解决**：
1. 确保所有库使用相同的 Build Type（Release 或 Debug）
2. 确保运行时库一致（`/MD` 而非 `/MDd`，或反过来）
3. 确保平台工具集一致（v142 或 v143）

### `#undef slots` 编译错误

**原因**：pybind11 头文件中的 `object.h` 与 Qt 的 `slots` 宏冲突。

**解决**：在 `libs/python/python_bindings.cpp` 中，确保 `#undef slots` 在 pybind11 头文件之前：

```cpp
#undef slots  // 必须在 pybind11 头文件之前
#include <pybind11/embed.h>
```

### Python 初始化失败

**原因**：`MY_NATIVE_PYTHON_DIR` 路径不正确。

**解决**：在 CMake 配置中指定正确的 Python 3.9 路径：

```bash
cmake -DMY_NATIVE_PYTHON_DIR="C:/Users/me/AppData/Local/Programs/Python/Python39" ..
```

## 相关主题

- [项目架构](architecture) - 理解项目结构
- [常见问题](faq) - 更多编译和运行时问题
