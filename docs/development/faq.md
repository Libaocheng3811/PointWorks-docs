# 常见问题

## 编译问题

### CMake 找不到 Qt5

**错误信息**：`Could not find a package configuration file provided by "Qt5"`

**解决方案**：

```bash
cmake -DQt5_DIR="C:/Qt/5.15.2/msvc2019_64/lib/cmake/Qt5" ..
```

### CMake 找不到 PCL

**解决方案**：

```bash
cmake -DPCL_DIR="C:/Program Files/PCL 1.12.1/cmake" ..
```

### 链接错误 LNK2001 / LNK2019

**原因**：依赖库的编译配置不一致。

**解决方案**：

1. 确保所有库使用相同的 Build Type（Release）
2. 确保运行时库一致（/MD 而非 /MDd）
3. 确保平台工具集一致（v142）

### 编译报错 C2039 "xxx": 不是 "yyy" 的成员

**原因**：PCL/VTK 版本不匹配。

**解决方案**：确认使用的 PCL 版本为 1.12+，VTK 版本为 8.2。

## 运行时问题

### 启动后立即崩溃

**可能原因**：

1. Qt 平台插件缺失 — 确保平台目录存在
2. VTK/PCL DLL 未找到 — 检查 PATH 环境变量

### 点云加载后显示为一片黑

**原因**：点云没有颜色信息，且默认渲染模式为 RGB。

**解决方案**：在显示设置中切换为高度着色或其他颜色模式。

### 大文件加载失败（内存不足）

**解决方案**：

1. 使用 LAS/LAZ 格式（支持流式加载）
2. 先用其他工具裁剪感兴趣区域
3. 增加系统虚拟内存

### Python 控制台无法启动

**可能原因**：

1. Python 3.9 未安装 — 安装 Python 3.9 到系统
2. pybind11 编译时 Python 路径不正确

**解决方案**：重新编译时指定正确的 Python 路径：

```bash
cmake -DPYTHON_EXECUTABLE="F:/Program Files/Python39/python.exe" ..
```
