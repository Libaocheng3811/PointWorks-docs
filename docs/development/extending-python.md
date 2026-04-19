# 扩展 Python API

本文介绍如何通过 pybind11 为 PointWorks 添加新的 Python 绑定。

## 概述

PointWorks 的 Python 绑定代码位于 `libs/python/python_bindings.cpp`，通过 `PYBIND11_EMBEDDED_MODULE` 宏注册 `ct` 模块。

## 绑定架构

```
Python 脚本
    |
    v
ct 模块 (pybind11 embedded module)
    |
    v
libs/ 核心 C++ 接口 (Cloud, Algorithm 等)
```

## 核心文件

| 文件 | 职责 |
|------|------|
| `libs/python/python_bindings.cpp` | pybind11 绑定定义（`ct` 模块） |
| `libs/python/python_manager.h/cpp` | 解释器初始化、模块注册 |
| `libs/python/python_worker.h/cpp` | 脚本执行引擎（GIL 管理） |
| `libs/python/python_bridge.h/cpp` | 信号桥接、云注册表 |

## 添加步骤

### 第一步：编写绑定代码

在 `libs/python/python_bindings.cpp` 的 `PYBIND11_EMBEDDED_MODULE` 块中添加新函数或类。

!!! warning "头文件顺序"
    必须在包含 pybind11 头文件之前 `#undef slots`，解决 Qt `slots` 宏与 Python `object.h` 的冲突：

```cpp
// libs/python/python_bindings.cpp

#undef slots  // 必须在 pybind11 头文件之前!
#include <pybind11/embed.h>
#include <pybind11/numpy.h>
#include <pybind11/stl.h>

namespace py = pybind11;

PYBIND11_EMBEDDED_MODULE(ct, m) {
    m.doc() = "PointWorks Python API";

    // ---- 已有绑定 ----

    // 日志函数
    m.def("printI", [](const std::string& msg) { /* ... */ });
    m.def("printW", [](const std::string& msg) { /* ... */ });
    m.def("printE", [](const std::string& msg) { /* ... */ });

    // 点云获取
    m.def("get_cloud", [](const std::string& name) -> py::object {
        // 通过 PythonBridge 获取
        // ...
    });

    // Cloud 类绑定
    py::class_<CloudProxy>(m, "Cloud")
        .def("size", &CloudProxy::size)
        .def("has_colors", &CloudProxy::hasColors)
        .def("to_numpy", &CloudProxy::toNumpy)
        .def("block_to_numpy", &CloudProxy::blockToNumpy)
        .def("block_set_colors", &CloudProxy::blockSetColors)
        .def("block_mark_dirty", &CloudProxy::blockMarkDirty)
        .def("refresh", &CloudProxy::refresh)
        // ... 添加新方法
        ;

    // ---- 新增绑定 ----

    // 添加新函数
    m.def("my_function", [](const std::string& name, float param) {
        // 通过 Bridge 获取 Cloud 并调用算法
        auto cloud = getCloudFromBridge(name);
        if (!cloud) {
            throw std::runtime_error("Cloud not found: " + name);
        }
        auto result = ct::algorithm::myFunction(cloud, param);
        return result;
    },
    py::arg("name"),
    py::arg("param"),
    "My function description");
}
```

### 第二步：NumPy 零拷贝绑定

使用 `py::capsule` 管理 Cloud 数据的生命周期，实现零拷贝 NumPy 访问：

```cpp
// 零拷贝返回 NumPy 数组
m.def("block_to_numpy", [](CloudProxy& self, int block_idx) {
    auto cloud = self.getCloud();
    auto block = cloud->getBlock(block_idx);
    auto& points = block->points();

    // 创建 capsule 持有 Cloud::Ptr，防止被销毁
    auto capsule = py::capsule(new Cloud::Ptr(cloud), [](void* p) {
        delete static_cast<Cloud::Ptr*>(p);
    });

    // 零拷贝创建 NumPy 数组
    return py::array_t<float>(
        {static_cast<ssize_t>(points.size()), 3},  // shape
        {sizeof(float) * 3, sizeof(float)},          // strides
        reinterpret_cast<float*>(points.data()),     // data pointer
        capsule                                      // parent
    );
});
```

### 第三步：添加新的信号（如需 UI 交互）

如果新功能需要触发 UI 操作，在 `PythonBridge` 中添加信号：

```cpp
// libs/python/python_bridge.h
class PythonBridge : public QObject {
    Q_OBJECT

signals:
    void cloudRefreshRequested();
    void cloudAdded(const QString& name);

    // 新增信号
    void myUIOperationRequested(const QString& param);
};
```

在 `MainWindow` 中连接信号：

```cpp
// src/app/mainwindow.cpp
connect(m_python_bridge, &PythonBridge::myUIOperationRequested,
        this, [this](const QString& param) {
    // 在主线程执行 UI 操作
    // ...
});
```

在绑定代码中发射信号：

```cpp
m.def("trigger_ui_op", [](const std::string& param) {
    auto bridge = PythonBridge::instance();
    emit bridge->myUIOperationRequested(QString::fromStdString(param));
});
```

### 第四步：编译测试

```bash
cmake --build build --config Release
```

在 Python 控制台或编辑器中测试新 API：

```python
import ct
ct.my_function("test_cloud", param=1.0)
```

## 绑定最佳实践

### 1. 不要返回裸指针

```cpp
// 错误
m.def("bad_func", []() { return new SomeObject(); });

// 正确 - 使用智能指针或值类型
m.def("good_func", []() { return std::make_shared<SomeObject>(); });
```

### 2. NumPy 互操作

```cpp
// 接收 NumPy 数组
m.def("process_array", [](py::array_t<float> input) {
    auto buf = input.request();
    float* ptr = static_cast<float*>(buf.ptr);
    size_t rows = buf.shape[0];
    // ...
});

// 返回 NumPy 数组
m.def("create_array", []() {
    auto arr = py::array_t<float>(100);
    return arr;
});
```

### 3. GIL 管理

耗时操作应释放 GIL，允许其他 Python 线程运行：

```cpp
m.def("heavy_computation", [](CloudProxy& cloud) {
    py::gil_scoped_release release;  // 释放 GIL

    // 执行耗时 C++ 计算
    auto result = expensiveAlgorithm(cloud.getCloud());

    py::gil_scoped_acquire acquire;  // 重新获取 GIL
    return result;
});
```

### 4. 异常处理

```cpp
m.def("safe_function", [](const std::string& name) {
    auto cloud = getCloudFromBridge(name);
    if (!cloud) {
        throw py::value_error("Cloud not found: " + name);
    }
    // ...
});
```

### 5. 线程安全

所有 Python API 调用都在 `PythonWorker` 线程中执行。禁止在 Python 绑定代码中直接操作 UI：

```cpp
// 错误 - 直接操作 UI
m.def("bad", []() {
    someWidget->update();  // 禁止!
});

// 正确 - 通过信号
m.def("good", []() {
    emit bridge->updateRequested();
});
```

## 编译配置

ct_python 为 OBJECT 库，编译产物直接链接到 pointworks 可执行文件：

```cmake
# libs/python/CMakeLists.txt
add_library(ct_python OBJECT ...)
target_link_libraries(ct_python
    PRIVATE Qt5::Widgets pybind11::embed Python3::Python ct_core ct_algorithm)
```

不需要单独注册 .cpp 文件，所有绑定在 `python_bindings.cpp` 中集中定义。

## 相关主题

- [Python 脚本概述](../advanced/python-scripting/index.md) - Python 架构概览
- [Python API 参考](../advanced/python-scripting/api-reference.md) - 现有 API 列表
- [添加新算法](adding-algorithm.md) - 添加算法后将其暴露给 Python
