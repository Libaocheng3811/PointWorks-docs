# 编译构建

## 系统要求

| 依赖 | 最低版本 | 推荐版本 |
|------|----------|----------|
| Visual Studio | 2019 (MSVC 19.28) | 2022 |
| CMake | 3.16 | 3.25+ |
| Qt | 5.15 | 5.15.2 |
| VTK | 8.2 | 8.2.0 |
| PCL | 1.12 | 1.12.1 |
| Python | 3.9 | 3.9.x |
| pybind11 | 2.11 | 最新 |

## 编译步骤

### 1. 克隆仓库

```bash
git clone https://github.com/TestDemoCommunity/CloudTool2.git
cd CloudTool2
```

### 2. CMake 配置

```bash
mkdir build && cd build
cmake ..
```

**关键 CMake 变量**：

| 变量 | 说明 | 默认值 |
|------|------|--------|
| `CMAKE_BUILD_TYPE` | 构建类型 | `Release` |
| `Qt5_DIR` | Qt5 安装路径 | 自动检测 |
| `VTK_DIR` | VTK 安装路径 | 自动检测 |
| `PCL_DIR` | PCL 安装路径 | 自动检测 |
| `PYTHON_EXECUTABLE` | Python 路径 | 自动检测 |

### 3. 编译

```bash
cmake --build . --config Release
```

使用多线程加速：

```bash
cmake --build . --config Release -- /m:8
```

### 4. 运行

```bash
./bin/Release/pointworks.exe
```

## 常见编译问题

### 找不到 Qt5

```
Could not find a package configuration file provided by "Qt5"
```

**解决**：设置 `Qt5_DIR` 指向 Qt 安装目录下的 `lib/cmake/Qt5`：

```bash
cmake -DQt5_DIR="C:/Qt/5.15.2/msvc2019_64/lib/cmake/Qt5" ..
```

### 找不到 PCL

**解决**：设置 `PCL_DIR`：

```bash
cmake -DPCL_DIR="C:/Program Files/PCL 1.12.1/cmake" ..
```

### 链接错误 LNK2001

**解决**：确保所有依赖库使用相同的编译配置（Debug/Release）和运行时库（MD/MDd）。
