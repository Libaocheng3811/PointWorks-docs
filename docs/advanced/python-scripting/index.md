# Python 脚本

本部分介绍 PointWorks 嵌入式 Python 环境的使用方法。

## 概述

PointWorks 通过 pybind11 嵌入了 Python 3.9 解释器，提供脚本化点云处理能力。用户可以：

- 在 GUI 中使用交互式 Python 控制台
- 使用 Python 编辑器编写和执行脚本
- 通过 `ct` 模块访问点云数据（零拷贝 NumPy 访问）
- 自动化批量处理任务

## 架构

```
+----------------------------------+
| Python UI                        |
| +--------------+ +-------------+ |
| | Console      | | Editor      | |
| +------+-------+ +------+------++ |
|        |                |        |
|        +-------+--------+        |
|                v                  |
| +------------------------------+ |
| | PythonBridge (信号桥接)       | |
| | - 线程安全云注册表            | |
| | - hold/release 机制           | |
| +---------------+--------------+ |
+-----------------+----------------+
                  |
+-----------------v----------------+
| Python Engine                    |
| +------------------------------+ |
| | PythonWorker (QThread)       | |
| | - GIL 管理                    | |
| | - 脚本执行                    | |
| | - 异步取消                    | |
| +---------------+--------------+ |
|                 v                 |
| +------------------------------+ |
| | PythonManager (单例)          | |
| | - 解释器生命周期              | |
| | - stdio 重定向                | |
| +---------------+--------------+ |
|                 v                 |
| +------------------------------+ |
| | pybind11 Module: ct          | |
| | - Cloud 访问                  | |
| | - NumPy 零拷贝               | |
| | - 日志函数                    | |
| +------------------------------+ |
+----------------------------------+
```

## 三要素

| 组件 | 文件 | 职责 |
|------|------|------|
| **PythonManager** | `libs/python/python_manager.h` | 单例，管理解释器初始化/销毁、stdio 重定向、DLL 搜索路径 |
| **PythonWorker** | `libs/python/python_worker.h` | QThread，GIL 管理的脚本执行，支持异步取消 |
| **PythonBridge** | `libs/python/python_bridge.h` | 信号桥接 + 线程安全云注册表，Python 侧只发信号 |

## 解释器生命周期

```cpp
// src/app/main.cpp
int main() {
    QApplication app;
    ct::PythonManager::instance().initialize();  // Py_Initialize + 注册模块
    MainWindow w;
    w.show();
    int ret = app.exec();
    ct::PythonManager::instance().finalize();     // 清理（不调用 Py_Finalize）
    return ret;
}
```

!!! warning "关键约束"
    不调用 `Py_Finalize()`，避免 pybind11 全局析构顺序问题。

## 主题列表

| 主题 | 说明 |
|------|------|
| [Python 控制台](console.md) | 交互式 Python 控制台使用 |
| [Python 编辑器](editor.md) | 脚本编辑器使用 |
| [Python API 参考](api-reference.md) | 完整的 `ct` 模块 API 文档 |

## 快速入门

```python
import ct

# 日志输出
ct.printI("Hello from PointWorks Python!")

# 获取点云
cloud = ct.get_cloud("my_cloud")
if cloud is not None:
    ct.printI(f"点数: {cloud.size()}")

    # 按 Block 遍历
    for i in range(cloud.num_blocks()):
        xyz = cloud.block_to_numpy(i)
        ct.printI(f"Block {i}: {xyz.shape}")

    # 刷新渲染
    cloud.refresh()
```

## 线程安全规则

!!! danger "核心约束"
    1. **GIL**: Python 代码只在 `PythonWorker::run()` 中持有 GIL 执行
    2. **UI 操作**: Python 侧所有 UI 操作通过 `PythonBridge` 发射信号，由 Qt 主线程处理
    3. **Capsule 生命周期**: 零拷贝 NumPy view 通过 `py::capsule` 持有 `Cloud::Ptr`，防止点云被提前销毁

### In-use 保护机制

```cpp
// Python 获取云时自动标记
bridge->holdCloud(cloud);            // 持有 shared_ptr 引用
bridge->markCloudInUse(cloud->id()); // 标记 UI 侧禁止删除

// Python 脚本执行完成后自动释放
bridge->releaseAllHeld();            // 释放引用
bridge->releaseAllInUse();           // 取消删除保护
```

## 相关教程

- [Python 自动化实战](../../tutorials/python-automation.md) - 实战脚本示例
- [扩展 Python API](../../development/extending-python.md) - 如何添加新的 Python 绑定
