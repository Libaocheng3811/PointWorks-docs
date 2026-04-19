# Python 编辑器

Python 编辑器提供一个代码编辑环境，支持编写、保存和运行完整的 Python 脚本。

## 打开方式

菜单栏：`工具` → `Python 编辑器`

## 编辑器功能

| 功能 | 说明 |
|------|------|
| 语法高亮 | Python 语法自动着色 |
| 行号显示 | 左侧显示行号 |
| 文件操作 | 新建、打开、保存脚本文件 |
| 运行脚本 | 点击运行按钮或 `Ctrl+R` 执行 |
| 输出面板 | 底部显示脚本运行输出 |

## 脚本模板

```python
"""
脚本名称：批量降采样
功能描述：对当前加载的所有点云进行体素降采样
"""
import pointworks as pw

leaf_size = 0.05  # 体素大小（米）

clouds = pw.app.get_clouds()
for cloud in clouds:
    result = pw.filter.voxel_grid(cloud, leaf_size=leaf_size)
    pw.app.add_cloud(result, f"{cloud.name}_filtered")
    print(f"已完成: {cloud.name} ({cloud.size()} -> {result.size()})")

print("批量处理完成!")
```

!!! warning "注意"
    脚本在主线程中执行。长时间运行的脚本可能导致界面无响应，建议将耗时操作拆分为小批次。
