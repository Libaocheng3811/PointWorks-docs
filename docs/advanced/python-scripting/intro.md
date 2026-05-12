---
title: Python 脚本
---

# Python 脚本

本部分介绍 PointWorks 嵌入式 Python 环境的使用方法。

## 概述

PointWorks 通过 pybind11 嵌入了 Python 3.9 解释器，提供完整的脚本化点云处理能力。用户可以：

- 在 GUI 中使用交互式 Python 控制台
- 使用 Python 编辑器编写和执行脚本
- 通过 `ct` 模块访问点云数据（零拷贝 NumPy 访问）
- 调用全部 C++ 算法（滤波、配准、分割、特征提取、曲面重建等）
- 自动化批量处理任务

## API 模块一览

`ct` 模块提供约 140+ 个 API，覆盖点云处理的全部功能：

| 分类 | 函数数量 | 主要功能 |
|------|---------|---------|
| 点云管理 | 14 | 加载、保存、创建、克隆、合并、删除 |
| 视图控制 | 11 | 刷新、缩放、标准视图、自动渲染 |
| 外观设置 | 12 | 点大小、透明度、颜色、背景、显示切换 |
| 叠加形状 | 13 | 立方体、标签、箭头、多边形及其属性 |
| 进度管理 | 4 | 进度条、脚本模式 |
| 变换操作 | 6 | 平移、旋转、缩放、矩阵变换、裁剪 |
| 滤波与采样 | 14 | 体素降采样、离群点移除、直通滤波、随机采样等 |
| 法线估计 | 1 | K近邻/半径搜索法线估计 |
| 特征描述子 | 19 | FPFH、SHOT、VFH、ESF、RSD 等 |
| 关键点检测 | 4 | ISS、Harris3D、SIFT3D、Trajkovic |
| 点云配准 | 7 | ICP、GICP、NDT、FPCS、KFPCS |
| 点云分割 | 17 | SAC、欧几里得/DBSCAN/K-Means 聚类、区域生长、超体素等 |
| 曲面重建 | 9 | 泊松、贪婪三角化、Marching Cubes、凸包/凹包 |
| 地面/植被分割 | 2 | CSF 布料模拟滤波、植被指数分割 |
| 距离计算 | 2 | C2C 距离、最近点集 |
| **ct.Cloud 类** | **34** | 数据访问、标量场、便捷方法 |
| **ct.Mesh 类** | **5** | 顶点、面、显示 |

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
| | - 全部 C++ 算法               | |
| | - Cloud / Mesh 数据类         | |
| | - NumPy 零拷贝               | |
| | - 日志与进度函数              | |
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

:::warning[关键约束]
不调用 `Py_Finalize()`，避免 pybind11 全局析构顺序问题。

:::

## 主题列表

| 主题 | 说明 |
|------|------|
| [Python 控制台](console) | 交互式 Python 控制台使用 |
| [Python 编辑器](editor) | 脚本编辑器使用 |
| [Python API 参考](api-reference) | `ct` 模块概览、索引、基础函数 |
| [算法 API 详解](api-algorithms) | 滤波、配准、分割等全部算法函数 |
| [类 API 详解](api-classes) | ct.Cloud 与 ct.Mesh 完整方法 |

## 快速入门

```python
import ct

# 日志输出
ct.printI("Hello from PointWorks Python!")

# 获取点云
cloud = ct.get_cloud("my_cloud")
if cloud is not None:
    ct.printI(f"点数: {cloud.size()}")

    # 使用 Cloud 便捷方法
    sampled = cloud.voxel_down_sample(0.5, 0.5, 0.5)
    sampled.show("downsampled")

    # 或使用模块级函数
    result = ct.voxel_grid("my_cloud", 0.5, 0.5, 0.5)
    result.show("voxel_result")
```

## 线程安全规则

:::danger[核心约束]
1. **GIL**: Python 代码只在 `PythonWorker::run()` 中持有 GIL 执行
2. **UI 操作**: Python 侧所有 UI 操作通过 `PythonBridge` 发射信号，由 Qt 主线程处理
3. **Capsule 生命周期**: 零拷贝 NumPy view 通过 `py::capsule` 持有 `Cloud::Ptr`，防止点云被提前销毁
4. **脚本独占**: 同一时刻只允许一个脚本执行

:::

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

- [Python 自动化实战](../../tutorials/python-automation) - 实战脚本示例
- [扩展 Python API](../../development/extending-python) - 如何添加新的 Python 绑定
