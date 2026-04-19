# Python 编辑器使用

本文介绍 PointWorks 内置的 Python 脚本编辑器。

## 概述

Python 编辑器提供一个功能完整的脚本编写和执行环境，适合编写和运行复杂的多行脚本。编辑器组件位于 `src/python/python_editor.h`。

## 打开编辑器

通过菜单 **Python > Editor** 打开 Python 脚本编辑器面板。

## 编辑器界面

```
+--------------------------------------------------+
| 工具栏: [打开] [保存] [运行] [停止] [清除]         |
+--------------------------------------------------+
| # PointWorks Python 脚本                          |
| import ct                                         |
| import numpy as np                                |
|                                                   |
| cloud = ct.get_cloud("my_cloud")                  |
| if cloud is not None:                             |
|     ct.printI(f"点数: {cloud.size()}")            |
|     xyz = cloud.to_numpy()                        |
|     ct.printI(f"均值: {xyz.mean(axis=0)}")        |
|     cloud.refresh()                               |
+--------------------------------------------------+
| [INFO] 点数: 5000000                              |
| [INFO] 均值: [  0.123 -25.456  12.789]           |
+--------------------------------------------------+
```

## 功能特性

### 脚本管理

| 功能 | 说明 |
|------|------|
| **打开** | 从文件加载 `.py` 脚本 |
| **保存** | 保存当前脚本到文件 |
| **新建** | 清空编辑器，开始新脚本 |

### 执行控制

| 功能 | 说明 |
|------|------|
| **运行** | 在后台线程中执行当前脚本 |
| **停止** | 中断正在运行的脚本 |
| **清除输出** | 清空输出面板 |

### 编辑功能

- Python 语法高亮
- 自动缩进
- 行号显示
- 基本的编辑操作（复制、粘贴、查找等）

## 使用流程

### 1. 编写脚本

在编辑器中编写 Python 脚本：

```python
import ct
import numpy as np

# 获取点云
cloud = ct.get_cloud("terrain")
if cloud is None:
    ct.printE("未找到点云: terrain")
else:
    ct.printI(f"开始处理，总点数: {cloud.size()}")

    # 按 Block 处理
    for i in range(cloud.num_blocks()):
        xyz = cloud.block_to_numpy(i)

        # 计算 Z 值统计
        z = xyz[:, 2]
        ct.printI(f"Block {i}: Z范围 [{z.min():.2f}, {z.max():.2f}]")

    ct.printI("处理完成")
```

### 2. 保存脚本

点击 **保存** 按钮将脚本保存为 `.py` 文件，便于后续复用。

### 3. 执行脚本

点击 **运行** 按钮执行脚本：

- 脚本在后台 `PythonWorker` 线程中执行（持有 GIL）
- 输出面板实时显示日志
- 执行期间编辑器仍可继续编写
- 进度信息通过 `ct.printI()` 输出

### 4. 停止执行

如果脚本运行时间过长，点击 **停止** 按钮：

- 设置原子取消标志 `m_is_canceled`
- 脚本在下一次 Python 字节码执行时检查并退出
- 这是协作式取消，脚本需定期检查取消状态

## 后台执行

!!! info "线程模型"
    脚本在 `PythonWorker`（`QThread`）中执行，持有 Python GIL。这意味着：
    - 脚本执行不会阻塞 UI 主线程
    - 脚本执行期间用户可以正常操作界面
    - 同时只允许一个脚本执行

## 脚本模板

### 基本处理模板

```python
import ct
import numpy as np

def process_cloud(name):
    """处理指定点云"""
    cloud = ct.get_cloud(name)
    if cloud is None:
        ct.printE(f"未找到点云: {name}")
        return

    ct.printI(f"处理: {name} ({cloud.size()} 点)")

    for i in range(cloud.num_blocks()):
        xyz = cloud.block_to_numpy(i)
        # ... 在此添加处理逻辑
        ct.printI(f"Block {i}/{cloud.num_blocks()} 完成")

    cloud.refresh()
    ct.printI("处理完成")

# 执行
process_cloud("my_cloud")
```

### 批量处理模板

```python
import ct

cloud_names = ["cloud_1", "cloud_2", "cloud_3"]

for name in cloud_names:
    cloud = ct.get_cloud(name)
    if cloud is None:
        ct.printW(f"跳过: {name}")
        continue

    ct.printI(f"处理: {name}")
    # ... 处理逻辑
    ct.printI(f"完成: {name}")

ct.printI("批量处理全部完成")
```

### 错误处理模板

```python
import ct
import numpy as np
import traceback

def safe_process(name):
    try:
        cloud = ct.get_cloud(name)
        if cloud is None:
            raise ValueError(f"点云不存在: {name}")

        ct.printI(f"点数: {cloud.size()}")

        # 处理逻辑...
        for i in range(cloud.num_blocks()):
            xyz = cloud.block_to_numpy(i)
            if xyz.shape[0] == 0:
                ct.printW(f"Block {i} 为空，跳过")
                continue
            # ... 处理

        cloud.refresh()

    except Exception as e:
        ct.printE(f"错误: {e}")
        ct.printE(traceback.format_exc())

safe_process("my_cloud")
```

## 最佳实践

!!! tip "编写高质量脚本"
    1. **总是检查 None** - `ct.get_cloud()` 可能返回 None
    2. **使用 Block 遍历** - 避免对大点云使用 `to_numpy()` 全量拷贝
    3. **输出进度** - 长时间运行时定期 `ct.printI()` 输出进度
    4. **错误处理** - 使用 try/except 捕获异常，避免脚本静默失败
    5. **保存脚本** - 编辑完成后保存为 `.py` 文件，便于复用和版本管理

## 相关主题

- [Python 控制台](console.md) - 交互式 Python shell
- [Python API 参考](api-reference.md) - 完整 API 文档
- [Python 自动化实战](../../tutorials/python-automation.md) - 实战脚本示例
