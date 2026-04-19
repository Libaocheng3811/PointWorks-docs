# 插件开发

PointWorks 支持通过插件机制扩展功能。

## 插件架构

插件基于 Qt 的插件系统实现，遵循以下接口：

```cpp
class PluginInterface {
public:
    virtual ~PluginInterface() = default;
    virtual QString name() const = 0;
    virtual QString description() const = 0;
    virtual void initialize() = 0;
    virtual void execute() = 0;
};
```

## 开发步骤

### 1. 创建插件项目

在 `src/plugins/` 目录下创建新的插件模块，包含：

- 插件头文件（继承 `PluginInterface`）
- 插件实现文件
- CMakeLists.txt

### 2. 实现插件接口

```cpp
// my_plugin.h
#include <plugin_interface.h>

class MyPlugin : public QObject, public PluginInterface {
    Q_OBJECT
    Q_PLUGIN_METADATA(IID "org.pointworks.PluginInterface")
    Q_INTERFACES(PluginInterface)

public:
    QString name() const override { return "My Plugin"; }
    QString description() const override { return "示例插件"; }
    void initialize() override;
    void execute() override;
};
```

### 3. 注册菜单项

在 `initialize()` 中注册菜单入口：

```cpp
void MyPlugin::initialize() {
    // 获取主窗口菜单栏
    auto* menu = mainWindow->addMenu("我的插件");
    auto* action = menu->addAction("执行功能");
    connect(action, &QAction::triggered, this, &MyPlugin::execute);
}
```

### 4. 编译与部署

编译后将 DLL/SO 文件放置到 `plugins/` 目录，PointWorks 启动时自动加载。

!!! warning "分层约束"
    插件可以依赖 `libs/` 层的模块，但**严禁**依赖 `src/` 层的其他模块。
