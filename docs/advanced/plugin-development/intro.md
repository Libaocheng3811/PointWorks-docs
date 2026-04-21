---
title: 插件开发指南
---

# 插件开发指南

本文介绍如何为 PointWorks 开发自定义插件。

## 概述

PointWorks 的插件本质上是继承自 `ct::CustomDialog` 的工具浮窗，遵循统一的 **init -> onApply -> onDone** 工作流模板。每个插件封装一个独立的点云处理功能。

## 插件架构

### 基本模板

所有插件遵循以下结构：

```cpp
class MyPlugin : public ct::CustomDialog {
    Q_OBJECT

public:
    MyPlugin(QWidget* parent, const QString& name,
             ct::CloudView* cloudview, ct::CloudTree* cloudtree,
             ct::Console* console);

private:
    void init() override;          // 初始化 UI 和信号连接

private slots:
    void onApply();                // 开始处理
    void onDone();                 // 处理完成回调

private:
    QThread m_thread;              // 工作线程
    Worker* m_worker;              // 算法工作类
    ct::Cloud::Ptr m_cloud;        // 输入点云
};
```

### 工作线程模式

耗时算法严禁在主线程执行。插件使用以下模式：

```
UI 线程                          工作线程 (QThread)
   |                                 |
   +-- onApply()                     |
   |   +-- 获取输入点云              |
   |   +-- 创建 Worker               |
   |   +-- moveToThread(worker)      |
   |   +-- start thread -------------+
   |                                 +-- Worker::run()
   |                                 |   +-- 执行算法
   |   +-- progress(int) <-----------+   +-- emit progress(n)
   |   |                             |   +-- emit done(result)
   |   +-- onDone(result) <----------+
   |   +-- 更新 UI                   |
   |   +-- 清理线程                  |
```

### 关键信号

```cpp
// 进度信号
connect(m_worker, &Worker::progress, this, [this](int percent) {
    m_processing->setProgress(percent);
});

// 完成信号
connect(m_worker, &Worker::done, this, &MyPlugin::onDone);

// 取消标志
std::atomic<bool> m_is_canceled{false};
```

## 开发步骤

### 第一步：创建插件文件

在 `src/plugins/` 目录下创建以下文件：

```
src/plugins/
  myplugin.h          # 插件头文件
  myplugin.cpp        # 插件实现
  myplugin.ui         # Qt Designer UI 文件（可选）
```

### 第二步：实现插件类

#### 头文件 `myplugin.h`

```cpp
#pragma once

#include <customdialog.h>
#include <cloud.h>

class Worker;  // 前向声明

class MyPlugin : public ct::CustomDialog {
    Q_OBJECT

public:
    MyPlugin(QWidget* parent, const QString& name,
             ct::CloudView* cloudview, ct::CloudTree* cloudtree,
             ct::Console* console);

private:
    void init() override;

private slots:
    void onApply();
    void onDone();

private:
    QThread m_thread;
    Worker* m_worker = nullptr;
    ct::Cloud::Ptr m_cloud;

    // UI 控件
    QDoubleSpinBox* m_param_spin = nullptr;
    QPushButton* m_apply_btn = nullptr;
};
```

#### 实现文件 `myplugin.cpp`

```cpp
#include "myplugin.h"
#include <cloudtree.h>
#include <console.h>
#include <processingdialog.h>

// ---- 工作类（在 QThread 中运行）----
class Worker : public QObject {
    Q_OBJECT
public:
    explicit Worker(ct::Cloud::Ptr cloud, double param,
                    QObject* parent = nullptr)
        : QObject(parent), m_cloud(cloud), m_param(param) {}

    std::atomic<bool> m_is_canceled{false};

signals:
    void progress(int percent);
    void done();

public slots:
    void run() {
        int total = m_cloud->size();
        int processed = 0;

        // 遍历所有 Block
        for (int i = 0; i < m_cloud->numBlocks(); ++i) {
            if (m_is_canceled) return;

            auto block = m_cloud->getBlock(i);
            // ... 执行算法处理 block

            processed += block->size();
            emit progress(processed * 100 / total);
        }

        emit done();
    }

private:
    ct::Cloud::Ptr m_cloud;
    double m_param;
};

// ---- 插件类实现 ----

MyPlugin::MyPlugin(QWidget* parent, const QString& name,
                   ct::CloudView* cloudview, ct::CloudTree* cloudtree,
                   ct::Console* console)
    : ct::CustomDialog(parent, name, cloudview, cloudtree, console)
{
    init();
}

void MyPlugin::init() {
    // 创建 UI 控件
    m_param_spin = new QDoubleSpinBox(this);
    m_param_spin->setRange(0.0, 100.0);
    m_param_spin->setValue(1.0);
    m_param_spin->setDecimals(2);

    m_apply_btn = new QPushButton("Apply", this);

    auto layout = new QVBoxLayout(this);
    layout->addWidget(new QLabel("Parameter:"));
    layout->addWidget(m_param_spin);
    layout->addWidget(m_apply_btn);

    // 连接信号
    connect(m_apply_btn, &QPushButton::clicked, this, &MyPlugin::onApply);
}

void MyPlugin::onApply() {
    // 获取输入点云
    m_cloud = m_cloudtree->getCurrentCloud();
    if (!m_cloud) {
        m_console->printWarning("请先选择一个点云");
        return;
    }

    // 创建 Worker
    m_worker = new Worker(m_cloud, m_param_spin->value());
    m_worker->moveToThread(&m_thread);

    // 连接信号
    connect(&m_thread, &QThread::started, m_worker, &Worker::run);
    connect(m_worker, &Worker::done, this, &MyPlugin::onDone);
    connect(m_worker, &Worker::progress, this, [this](int p) {
        if (m_processing) m_processing->setProgress(p);
    });

    // 启动进度对话框
    m_processing = new ct::ProcessingDialog(this);
    m_processing->setCancelButtonEnabled(true);
    connect(m_processing, &ct::ProcessingDialog::canceled,
            [this]() { if (m_worker) m_worker->m_is_canceled = true; });

    m_thread.start();
    m_processing->exec();
}

void MyPlugin::onDone() {
    m_thread.quit();
    m_thread.wait();
    m_worker->deleteLater();
    m_worker = nullptr;

    if (m_processing) {
        m_processing->accept();
        m_processing = nullptr;
    }

    // 刷新视图
    m_cloudview->refresh();

    m_console->printInfo("处理完成");
}

#include "myplugin.moc"
```

### 第三步：注册插件

1. 在 `src/CMakeLists.txt` 中添加源文件：

```cmake
# 在 pointworks 可执行文件源文件列表中添加
plugins/myplugin.h
plugins/myplugin.cpp
```

2. 在 `MainWindow` 中注册插件并添加菜单入口：

```cpp
// mainwindow.cpp
#include "plugins/myplugin.h"

void MainWindow::initMenuBar() {
    // ...
    auto* pluginsMenu = menuBar()->addMenu("Plugins");
    pluginsMenu->addAction("My Plugin", [this]() {
        createDialog<MyPlugin>(this, "My Plugin",
                              m_cloudview, m_cloudtree, m_console);
    });
}
```

### 第四步：编译测试

```bash
cmake --build build --config Release
```

## 依赖注入

`CustomDialog` 基类通过构造函数注入核心组件：

```cpp
class CustomDialog {
protected:
    ct::CloudView* m_cloudview;    // 3D 视图
    ct::CloudTree* m_cloudtree;    // 点云树
    ct::Console* m_console;        // 控制台
};
```

插件通过这些指针访问核心功能，无需直接依赖全局状态。使用 `createDialog<T>()` 工厂函数自动注入：

```cpp
// 创建工具浮窗（无边框、跟随视图）
createDialog<MyPlugin>(parent, "My Plugin",
                       cloudview, cloudtree, console, true, false);

// 创建模态对话框（阻塞、居中）
createModalDialog<MyPlugin>(parent, "My Plugin",
                            cloudview, cloudtree, console);
```

## 现有插件参考

| 插件 | 文件 | 功能 | 学习价值 |
|------|------|------|----------|
| CSFPlugin | `src/plugins/csfplugin.h/cpp/ui` | 地面分割 | 基础模板 |
| VegPlugin | `src/plugins/vegplugin.h/cpp/ui` | 植被分割 | 多参数 UI + Otsu 自动阈值 |
| ChangeDetectPlugin | `src/plugins/changedetectplugin.h/cpp/ui` | 变化检测 | 多方法选择 + Jet 色带渲染 |

:::tip[学习建议]
先阅读 CSFPlugin 的源码，它是最简单的插件示例，包含了完整的 Worker 线程模式和进度反馈。

:::
## UI 设计

### 使用 Qt Designer

创建 `.ui` 文件可以使用 Qt Designer 可视化设计界面布局。现有插件均提供了 `.ui` 文件作为参考。

### 手动创建 UI

简单插件可以手动创建控件：

```cpp
void MyPlugin::init() {
    auto layout = new QVBoxLayout(this);

    // 参数控件
    auto param_label = new QLabel("Threshold:");
    m_param_spin = new QDoubleSpinBox(this);
    m_param_spin->setRange(0.0, 100.0);

    // 按钮
    m_apply_btn = new QPushButton("Apply", this);

    layout->addWidget(param_label);
    layout->addWidget(m_param_spin);
    layout->addStretch();
    layout->addWidget(m_apply_btn);

    setLayout(layout);
}
```

## 最佳实践

1. **算法与 UI 分离** - 将算法逻辑放在 `Worker` 类中，UI 逻辑放在插件类中
2. **协作式取消** - 在算法循环中定期检查 `m_is_canceled` 标志
3. **进度反馈** - 定期发射 `progress(int)` 信号更新进度条
4. **错误处理** - 在 `onDone()` 中检查异常并显示错误信息
5. **资源清理** - 确保 Worker 和 Thread 正确 `deleteLater()`
6. **智能指针** - 所有 PCL 对象使用 `Ptr` 类型，禁止裸指针
7. **分层原则** - 插件可以依赖 `libs/` 层的模块，但严禁依赖 `src/` 层的其他模块

## 相关主题

- [项目架构](../../development/architecture) - 整体架构设计
- [添加新算法](../../development/adding-algorithm) - 在 libs/algorithm 中添加算法
- [开发指南](../../development/intro) - 开发流程
