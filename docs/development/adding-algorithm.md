# 添加新算法

本文介绍如何为 PointWorks 添加新的点云处理算法。

## 概述

PointWorks 的算法模块位于 `libs/algorithm/` 目录，编译为 `ct_algorithm` 静态库。添加新算法需要：

1. 在算法层实现算法逻辑
2. 在工具层创建 UI 对话框
3. 在主窗口注册菜单入口

## 添加步骤

### 第一步：在 libs/algorithm/ 中实现算法

#### 1.1 选择或创建模块文件

根据算法类型选择对应的文件：

| 算法类型 | 目标文件 |
|----------|----------|
| 滤波 | `libs/algorithm/filters.h/cpp` |
| 特征提取 | `libs/algorithm/features.h/cpp` |
| 关键点检测 | `libs/algorithm/keypoints.h/cpp` |
| 配准 | `libs/algorithm/registration.h/cpp` |
| 分割 | `libs/algorithm/segmentation.h/cpp` |
| 法线 | `libs/algorithm/normals.h/cpp` |
| 曲面 | `libs/algorithm/surface.h/cpp` |
| 新类型 | 创建新文件 `libs/algorithm/myalgo.h/cpp` |

#### 1.2 添加算法函数

在头文件中声明：

```cpp
// libs/algorithm/filters.h
namespace ct {
namespace algorithm {

/**
 * @brief 我的新滤波器
 * @param input  输入点云
 * @param param1 参数1
 * @param param2 参数2
 * @return 滤波后的点云
 */
Cloud::Ptr myNewFilter(
    const Cloud::Ptr& input,
    float param1,
    int param2
);

} // namespace algorithm
} // namespace ct
```

在实现文件中实现：

```cpp
// libs/algorithm/filters.cpp
#include "filters.h"
#include <pcl/filters/my_filter.h>  // 如果使用 PCL

namespace ct {
namespace algorithm {

Cloud::Ptr myNewFilter(
    const Cloud::Ptr& input,
    float param1,
    int param2
) {
    // 1. 转换为 PCL 点云
    auto pcl_cloud = input->toPCL_XYZRGB();  // 按需选择点类型

    // 2. 执行 PCL 算法
    pcl::MyFilter<pcl::PointXYZRGB> filter;
    filter.setInputCloud(pcl_cloud);
    filter.setParameter1(param1);
    filter.setParameter2(param2);

    pcl::PointCloud<pcl::PointXYZRGB>::Ptr result(new pcl::PointCloud<pcl::PointXYZRGB>);
    filter.filter(*result);

    // 3. 转换回 Cloud
    auto output = Cloud::create();
    output->fromPCL_XYZRGB(result);

    return output;
}

} // namespace algorithm
} // namespace ct
```

#### 1.3 注册源文件

如果创建了新文件，需在 `libs/algorithm/CMakeLists.txt` 中注册：

```cmake
target_sources(ct_algorithm PRIVATE
    filters.h filters.cpp
    features.h features.cpp
    # ...
    myalgo.h myalgo.cpp    # 添加新文件
)
```

!!! info "CMake 注意"
    ct_algorithm 的 CMakeLists.txt 可能使用 `file(GLOB ...)` 自动收集源文件。如果不是，需手动添加。

### 第二步：创建 UI 工具对话框

#### 2.1 创建工具文件

在 `src/tool/` 下创建对应文件：

```
src/tool/
  my_filter.h       # 对话框头文件
  my_filter.cpp     # 对话框实现
  my_filter.ui      # Qt Designer UI 文件（可选）
```

#### 2.2 实现对话框

```cpp
// src/tool/my_filter.h
#pragma once

#include <customdialog.h>

class MyFilterTool : public ct::CustomDialog {
    Q_OBJECT

public:
    MyFilterTool(QWidget* parent, const QString& name,
                 ct::CloudView* cloudview, ct::CloudTree* cloudtree,
                 ct::Console* console);

private:
    void init() override;

private slots:
    void onApply();
    void onFinished();

private:
    QDoubleSpinBox* m_param1_spin = nullptr;
    QSpinBox* m_param2_spin = nullptr;
    QPushButton* m_apply_btn = nullptr;

    QThread m_thread;
    ct::Cloud::Ptr m_input_cloud;
    ct::Cloud::Ptr m_result_cloud;
};
```

```cpp
// src/tool/my_filter.cpp
#include "my_filter.h"
#include <filters.h>          // 算法头文件
#include <cloudtree.h>
#include <console.h>
#include <QtConcurrent>

MyFilterTool::MyFilterTool(QWidget* parent, const QString& name,
                           ct::CloudView* cloudview, ct::CloudTree* cloudtree,
                           ct::Console* console)
    : ct::CustomDialog(parent, name, cloudview, cloudtree, console)
{
    init();
}

void MyFilterTool::init() {
    m_param1_spin = new QDoubleSpinBox(this);
    m_param1_spin->setRange(0.0, 100.0);
    m_param1_spin->setValue(1.0);

    m_param2_spin = new QSpinBox(this);
    m_param2_spin->setRange(1, 1000);
    m_param2_spin->setValue(50);

    m_apply_btn = new QPushButton("Apply", this);

    auto layout = new QVBoxLayout(this);
    layout->addWidget(new QLabel("Parameter 1:"));
    layout->addWidget(m_param1_spin);
    layout->addWidget(new QLabel("Parameter 2:"));
    layout->addWidget(m_param2_spin);
    layout->addStretch();
    layout->addWidget(m_apply_btn);

    connect(m_apply_btn, &QPushButton::clicked, this, &MyFilterTool::onApply);
}

void MyFilterTool::onApply() {
    m_input_cloud = m_cloudtree->getCurrentCloud();
    if (!m_input_cloud) {
        m_console->printWarning("请先选择一个点云");
        return;
    }

    float p1 = static_cast<float>(m_param1_spin->value());
    int p2 = m_param2_spin->value();

    // 在后台线程中执行算法
    auto future = QtConcurrent::run([this, p1, p2]() {
        return ct::algorithm::myNewFilter(m_input_cloud, p1, p2);
    });

    auto* watcher = new QFutureWatcher<ct::Cloud::Ptr>();
    connect(watcher, &QFutureWatcher<ct::Cloud::Ptr>::finished, [this, watcher]() {
        m_result_cloud = watcher->result();
        if (m_result_cloud) {
            m_cloudtree->addCloud(m_result_cloud, "filtered");
            m_cloudview->refresh();
            m_console->printInfo("滤波完成");
        }
        watcher->deleteLater();
    });
    watcher->setFuture(future);
}
```

### 第三步：注册菜单入口

在 `MainWindow` 中添加菜单项：

```cpp
// src/app/mainwindow.cpp
#include "tool/my_filter.h"

void MainWindow::initMenuBar() {
    auto* toolsMenu = menuBar()->findChild<QMenu*>("Tools");

    toolsMenu->addAction("My Filter", [this]() {
        createDialog<MyFilterTool>(this, "My Filter",
                                   m_cloudview, m_cloudtree, m_console);
    });
}
```

### 第四步：注册源文件

在 `src/CMakeLists.txt` 中添加：

```cmake
target_sources(pointworks PRIVATE
    tool/my_filter.h
    tool/my_filter.cpp
    # ...
)
```

### 第五步：编译测试

```bash
cmake --build build --config Release
```

## PCL 开发规范

!!! danger "核心约束"
    1. **智能指针**: 严禁裸指针。所有 PCL 对象必须使用其自带的 `Ptr` 类型
    2. **内存释放**: 算法执行完毕后，确保临时点云变量的指针被正确重置或随作用域销毁
    3. **PCL 转换限制**: 完整的 `toPCL()`/`fromPCL()` 在大点云下可能导致内存问题，需选择性使用

### 智能指针使用示例

```cpp
// 正确
pcl::PointCloud<pcl::PointXYZRGB>::Ptr cloud(new pcl::PointCloud<pcl::PointXYZRGB>);
auto tree = pcl::search::KdTree<pcl::PointXYZRGB>::Ptr(new pcl::search::KdTree<pcl::PointXYZRGB>);

// 错误 - 禁止裸指针
// pcl::PointCloud<pcl::PointXYZRGB>* cloud = new pcl::PointCloud<pcl::PointXYZRGB>;
```

### 线程安全

```cpp
// 正确 - 后台线程执行
auto future = QtConcurrent::run([cloud, params]() {
    return ct::algorithm::myNewFilter(cloud, params);
});

// 错误 - 主线程执行耗时算法
// auto result = ct::algorithm::myNewFilter(cloud, params);  // 禁止!
```

## 添加滤波器的快速路径

对于简单的滤波器，可以复用现有的 `src/tool/filters.h` UI：

1. 在 `libs/algorithm/filters.h` 中添加滤波器枚举值
2. 在 `filters.cpp` 的 `apply()` 方法中实现逻辑
3. 在 `src/tool/filters.h` 的 UI 中添加对应的参数配置面板

## 相关主题

- [项目架构](architecture.md) - 理解整体模块划分
- [插件开发](../advanced/plugin-development/index.md) - 插件式算法扩展
- [扩展 Python API](extending-python.md) - 将算法暴露给 Python
