---
title: Python 控制台使用
---

# Python 控制台使用

本文介绍 PointWorks 内置的 Python 交互式控制台。

## 概述

Python 控制台是一个嵌入在 PointWorks 界面中的交互式 Python shell，支持：

- 逐行输入 Python 代码并立即执行
- 查看表达式返回值
- 输出重定向到 GUI 控制台面板
- 支持多行语句（函数定义、循环等）

## 打开控制台

通过菜单 **Python > Console** 打开 Python 控制台面板。面板以 Dock 窗口形式显示，可以拖拽到界面的任意位置。

控制台组件位于 `src/python/python_console.h`，底层依赖 `libs/python/python_manager.h` 进行 stdio 重定向。

## 控制台界面

```
+------------------------------------------+
| Python Console                            |
+------------------------------------------+
| >>> import ct                             |
| >>> cloud = ct.get_cloud("test")          |
| >>> cloud.size()                          |
| 12345678                                  |
| >>> ct.printI("Hello")                    |
| [INFO] Hello                              |
| >>> for i in range(3):                    |
| ...     ct.printI(f"Line {i}")            |
| ...                                       |
| [INFO] Line 0                             |
| [INFO] Line 1                             |
| [INFO] Line 2                             |
| >>> _                                     |
+------------------------------------------+
```

## 基本操作

### 执行单行代码

在 `>>>` 提示符后输入 Python 表达式并按回车执行：

```python
>>> 2 + 3
5
>>> "Hello, " + "World"
'Hello, World'
```

### 执行多行语句

输入冒号结尾的语句后，提示符变为 `...`，继续输入缩进的代码块：

```python
>>> def greet(name):
...     ct.printI(f"Hello, {name}!")
...
>>> greet("PointWorks")
[INFO] Hello, PointWorks!
```

### 执行结果

- 表达式的值直接显示在控制台
- `ct.printI()` 输出到日志面板（带颜色标记）
- 错误信息以红色显示

## 使用场景

### 快速查看点云信息

```python
>>> import ct
>>> cloud = ct.get_cloud("terrain")
>>> cloud.size()
5000000
>>> cloud.has_colors()
True
>>> cloud.num_blocks()
84
```

### 快速数据检查

```python
>>> import numpy as np
>>> cloud = ct.get_cloud("terrain")
>>> xyz = cloud.to_numpy()
>>> xyz.mean(axis=0)
array([  0.123, -25.456,  12.789], dtype=float32)
>>> xyz.std(axis=0)
array([45.67, 32.18,  8.92], dtype=float32)
```

### 原型验证

在编写完整脚本前，先在控制台中验证算法逻辑：

```python
>>> import numpy as np
>>> # 测试颜色映射逻辑
>>> t = np.linspace(0, 1, 10)
>>> r = (t * 255).astype(np.uint8)
>>> r
array([  0,  28,  56,  85, 113, 141, 170, 198, 226, 255], dtype=uint8)
```

## 注意事项

:::warning[执行环境]
- 控制台和编辑器共享同一个 Python 解释器
- 控制台中定义的变量在编辑器脚本中可用，反之亦然
- 每次启动 PointWorks 时 Python 环境重新初始化

:::
:::warning[长时间运行的操作]
在控制台中执行耗时操作会阻塞控制台输入。长时间脚本建议使用 Python 编辑器执行（支持后台运行和取消）。

:::
:::info[与系统 Python 的关系]
PointWorks 嵌入了独立的 Python 3.9 解释器，但会加载系统 Python 3.9 安装的包。可以在控制中 `import numpy` 等第三方库。

:::
## 快捷键

| 快捷键 | 功能 |
|--------|------|
| Enter | 执行当前行 |
| Shift+Enter | 插入新行（多行输入） |
| Up/Down | 浏览命令历史 |
| Ctrl+C | 中断当前执行 |

## 相关主题

- [Python 编辑器](editor) - 编写完整脚本
- [Python API 参考](api-reference) - 完整 API 文档
- [Python 自动化实战](../../tutorials/python-automation) - 实战示例
