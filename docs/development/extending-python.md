# 扩展 Python API

本文介绍如何通过 pybind11 为 PointWorks 添加新的 Python 绑定。

## 绑定架构

```
Python 脚本
    ↓
ct 模块 (pybind11 绑定)
    ↓
libs/ 核心 C++ 接口
```

Python 绑定代码位于 `libs/python/` 目录下。

## 添加步骤

### 1. 编写绑定代码

在 `libs/python/` 下创建或修改绑定文件：

```cpp
// libs/python/bind_my_module.cpp
#include <pybind11/pybind11.h>
#include <pybind11/numpy.h>
#include <pybind11/stl.h>
#include <algorithm/my_module.h>

namespace py = pybind11;

void bindMyModule(py::module_& m) {
    auto sub = m.def_submodule("mymodule", "我的模块说明");

    sub.def("my_function",
        [](const ct::Cloud::Ptr& cloud, float param) {
            return ct::mymodule::myFunction(cloud, param);
        },
        py::arg("cloud"),
        py::arg("param"),
        "函数说明"
    );
}
```

### 2. 注册模块

在绑定初始化函数中注册新模块：

```cpp
// libs/python/bindings.cpp
PYBIND11_MODULE(ct, m) {
    m.doc() = "PointWorks Python API";
    bindCloud(m);
    bindFilter(m);
    bindMyModule(m);  // 添加这一行
}
```

### 3. 更新 CMakeLists

```cmake
target_sources(python_bindings PRIVATE
    bind_my_module.cpp
)
```

### 4. 在 Python 中使用

```python
import ct
result = ct.mymodule.my_function(cloud, param=1.0)
```

## 注意事项

- **不要返回裸指针**：使用智能指针或值类型
- **NumPy 互操作**：使用 `py::array_t<float>` 传递数组数据
- **GIL 管理**：耗时操作前释放 GIL，操作完成后重新获取
- **线程安全**：Python API 调用在 `PythonWorker` 线程中执行
