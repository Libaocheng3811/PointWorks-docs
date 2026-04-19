# 安装指南

## 系统要求

| 项目 | 最低要求 | 推荐配置 |
|------|----------|----------|
| 操作系统 | Windows 10 64-bit | Windows 10/11 64-bit |
| 内存 | 8 GB | 16 GB 及以上 |
| 显卡 | OpenGL 3.2 支持 | 独立显卡 |
| 硬盘 | 500 MB 可用空间 | SSD |

## 下载安装

### 方式一：直接下载

前往 [GitHub Releases](https://github.com/TestDemoCommunity/CloudTool2/releases) 页面下载最新版本的安装包。

### 方式二：从源码编译

!!! info "前提条件"
    - Visual Studio 2019 或更高版本（需包含 C++17 支持）
    - CMake 3.16+
    - Qt 5.15
    - VTK 8.2
    - PCL 1.12

**编译步骤**：

```bash
# 克隆仓库
git clone https://github.com/TestDemoCommunity/CloudTool2.git
cd CloudTool2

# 创建构建目录
mkdir build && cd build

# CMake 配置
cmake ..

# 编译（Release 模式）
cmake --build . --config Release
```

编译完成后，可执行文件位于 `build/bin/Release/pointworks.exe`。

## 首次运行

1. 双击运行 `pointworks.exe`
2. 主界面包含菜单栏、工具栏、文件树、属性栏和三维视图
3. 通过 `文件 > 打开` 或拖拽方式加载点云文件

!!! tip "提示"
    首次打开大文件时，PointWorks 会自动构建八叉树索引，后续打开同一文件将直接使用缓存。
