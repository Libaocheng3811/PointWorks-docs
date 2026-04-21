---
title: 常见问题
---

# 常见问题

本文收集 PointWorks 开发和使用中的常见问题及解决方案。

## 编译问题

### CMake 找不到 Qt5

**错误信息**:
```
Could not find a package configuration file provided by "Qt5"
```

**解决方案**:

设置 `CMAKE_PREFIX_PATH` 或 `Qt5_DIR` 指向 Qt 安装目录：

```bash
cmake -DCMAKE_PREFIX_PATH="C:/Qt/5.15.2/msvc2019_64" ..

# 或直接指定 Qt5_DIR
cmake -DQt5_DIR="C:/Qt/5.15.2/msvc2019_64/lib/cmake/Qt5" ..
```

### CMake 找不到 PCL

**错误信息**:
```
Could not find a package configuration file provided by "PCL"
```

**解决方案**:

```bash
cmake -DPCL_DIR="C:/Program Files/PCL 1.12.1/cmake" ..
```

确保 PCL 1.12.1 已正确安装，且环境变量 `PCL_ROOT` 已设置。

### CMake 找不到 VTK

**解决方案**:

```bash
cmake -DVTK_DIR="C:/VTK/9.1.0/lib/cmake/vtk-9.1" ..
```

### 链接错误 LNK2001 / LNK2019

**原因**: 依赖库的编译配置不一致。

**解决方案**:

1. 确保所有库使用相同的 Build Type（Release 或 Debug）
2. 确保运行时库一致（`/MD` 用于 Release，`/MDd` 用于 Debug）
3. 确保平台工具集一致（v142 = VS2019，v143 = VS2022）
4. 检查是否有混用 Debug/Release 库的情况

### 编译报错 C2039 "xxx": 不是 "yyy" 的成员

**原因**: PCL/VTK 版本不匹配。

**解决方案**: 确认使用的版本：
- PCL: 1.12.1
- VTK: 9.1.0
- Qt: 5.15.2

不同版本的 API 可能有差异，需使用指定版本。

### `#undef slots` 编译错误

**原因**: pybind11 头文件中的 Python `object.h` 定义了 `slots` 保留字，与 Qt 的 `slots` 宏冲突。

**解决方案**: 在 `libs/python/python_bindings.cpp` 中确保 `#undef slots` 在 pybind11 头文件之前：

```cpp
#undef slots  // 必须在 pybind11 头文件之前!
#include <pybind11/embed.h>
#include <pybind11/numpy.h>
```

### 找不到 pybind11

**原因**: git submodule 未初始化。

**解决方案**:

```bash
git submodule update --init --recursive
```

## 运行时问题

### 启动后立即崩溃

**可能原因**:

1. **Qt 平台插件缺失** - 确保 `platforms/qwindows.dll` 在可执行文件目录或 Qt 路径下
2. **VTK/PCL DLL 未找到** - 检查 PATH 环境变量是否包含 VTK 和 PCL 的 bin 目录
3. **Python DLL 未找到** - 确保 Python 3.9 的 `python39.dll` 在 PATH 中

**解决方案**:

```bash
# 检查 DLL 依赖
# 使用 Dependencies (lucasg/Dependencies) 工具检查 pointworks.exe 的依赖
```

### 点云加载后显示为一片黑

**原因**: 点云没有颜色信息，且默认渲染模式为 RGB 颜色。

**解决方案**:

1. 使用 **Edit > Color** 切换渲染模式（按高度着色等）
2. 或检查点云文件是否确实包含颜色数据

### 大文件加载失败（内存不足）

**解决方案**:

1. 使用 LAS/LAZ 格式（支持流式加载，内存峰值可控）
2. 先用外部工具裁剪到感兴趣区域
3. 增加系统虚拟内存
4. 调整八叉树 `maxPointsPerBlock` 参数

### UTM 坐标渲染时抖动

**原因**: 大坐标值超出 GPU float 精度范围。

**解决方案**:

使用全局坐标偏移功能：

1. 加载时在 Global Shift Dialog 中确认偏移值
2. 或通过选项菜单手动设置偏移
3. 确保所有点云使用相同的偏移值

详见 [全局坐标偏移](../advanced/global-shift)。

### Python 控制台无法启动

**可能原因**:

1. Python 3.9 未安装到 `MY_NATIVE_PYTHON_DIR` 指定的路径
2. pybind11 编译时 Python 路径不正确
3. `python39.dll` 不在 PATH 中

**解决方案**:

1. 确认 Python 3.9 已正确安装
2. 重新编译时指定正确的 Python 路径：

```bash
cmake -DMY_NATIVE_PYTHON_DIR="C:/Path/To/Python39" ..
```

3. 确保 `python39.dll` 在系统 PATH 中

### Python import numpy 报错

**原因**: 系统 Python 3.9 环境中未安装 NumPy。

**解决方案**:

```bash
# 使用系统 Python 3.9 安装 NumPy
"C:/Path/To/Python39/python.exe" -m pip install numpy
```

### 渲染性能差 / 交互卡顿

**解决方案**:

1. 系统已内置 LOD 动态调整，交互时自动降低渲染质量
2. 使用 VoxelGrid 降采样减少点数
3. 关闭法线显示（法线渲染消耗大量 GPU 资源）
4. 调整点大小（减小点大小可提升渲染性能）
5. 检查显卡驱动是否最新

## 开发问题

### 如何调试 DLL 加载问题

使用 Dependencies 工具检查 DLL 依赖链：

```bash
# 下载 Dependencies 工具
# https://github.com/lucasg/Dependencies
# 打开 pointworks.exe 查看缺失的 DLL
```

### 如何查看 VTK 调试输出

在代码中设置 VTK 调试级别：

```cpp
vtkObject::GlobalWarningDisplayOn();  // 开启 VTK 警告
```

### 如何添加新的菜单项

在 `MainWindow::initMenuBar()` 中添加：

```cpp
auto* menu = menuBar()->addMenu("My Menu");
menu->addAction("My Action", [this]() {
    // 处理逻辑
});
```

### 项目重命名说明

项目已从 CloudTool2 重命名为 **PointWorks**：

- 可执行文件为 `pointworks.exe`
- 库前缀为 `ct_`（保留历史命名）
- 旧目录结构已重组为 `libs/` + `src/` 两层架构

## 相关主题

- [编译构建](build) - 详细编译步骤
- [项目架构](architecture) - 理解模块关系
- [大点云处理](../advanced/large-pointcloud) - 性能优化
- [全局坐标偏移](../advanced/global-shift) - 坐标精度问题
