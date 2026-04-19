# Python 控制台

Python 控制台提供一个交互式命令行界面，可以直接输入 Python 代码并立即执行。

## 打开方式

菜单栏：`工具` → `Python 控制台`

## 使用方法

控制台打开后，在输入框中输入 Python 代码，按 Enter 执行。

```python
# 查看已加载的点云
import pointworks as pw
clouds = pw.app.get_clouds()
for c in clouds:
    print(f"{c.name}: {c.size()} points")
```

## 常用操作

```python
# 获取选中的点云
cloud = pw.app.get_selected_cloud()

# 查看点云信息
print(cloud)

# 获取点云边界
bounds = cloud.bounds()
print(bounds)
```

!!! tip "提示"
    控制台支持自动补全（Tab 键）和历史记录（上下方向键）。
