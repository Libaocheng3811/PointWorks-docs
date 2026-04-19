# 添加新算法

本文介绍如何为 PointWorks 添加新的点云处理算法。

## 添加步骤

### 1. 实现算法

在 `libs/algorithm/` 下对应的模块中添加算法函数：

```cpp
// libs/algorithm/filter.h
namespace ct::filter {
    Cloud::Ptr myNewFilter(
        const Cloud::Ptr& cloud,
        float param1,
        int param2
    );
}

// libs/algorithm/filter.cpp
Cloud::Ptr ct::filter::myNewFilter(
    const Cloud::Ptr& cloud,
    float param1,
    int param2
) {
    // 实现算法逻辑
    auto result = Cloud::create();
    // ... 处理点云 ...
    return result;
}
```

### 2. 添加对话框

在 `src/tool/` 下创建对应的对话框：

```cpp
// src/tool/filter/my_filter_dialog.h
class MyFilterDialog : public DialogBase {
    Q_OBJECT
public:
    explicit MyFilterDialog(QWidget* parent = nullptr);
private slots:
    void onApply() override;
};
```

### 3. 注册菜单项

在对应的菜单管理器中添加入口：

```cpp
// src/tool/filter/filter_manager.cpp
auto* action = menu->addAction("我的滤波器");
connect(action, &QAction::triggered, [](/* ... */) {
    MyFilterDialog dialog;
    dialog.exec();
});
```

### 4. 确保 CPU 卸载

耗时算法必须在工作线程执行：

```cpp
void MyFilterDialog::onApply() {
    auto cloud = getSelectedCloud();
    auto future = QtConcurrent::run([cloud, param1, param2]() {
        return ct::filter::myNewFilter(cloud, param1, param2);
    });

    auto* watcher = new QFutureWatcher<Cloud::Ptr>();
    connect(watcher, &QFutureWatcher<Cloud::Ptr>::finished, [=]() {
        auto result = watcher->result();
        addCloud(result);
        delete watcher;
    });
    watcher->setFuture(future);
}
```

!!! tip "提示"
    参考 `libs/algorithm/filter.cpp` 中已有的滤波器实现作为模板。
