# Python 脚本

PointWorks 内嵌 Python 3.9 解释器，通过 pybind11 将 C++ 核心功能暴露为 Python API，支持用户编写脚本进行自动化批处理。

## 两种使用方式

| 方式 | 入口 | 适用场景 |
|------|------|----------|
| [Python 控制台](console.md) | `工具` → `Python 控制台` | 交互式执行、快速测试 |
| [Python 编辑器](editor.md) | `工具` → `Python 编辑器` | 编写和运行完整脚本 |

## 快速示例

```python
import pointworks as pw

# 获取当前选中的点云
cloud = pw.app.get_selected_cloud()
print(f"点数: {cloud.size()}")

# 体素降采样
result = pw.filter.voxel_grid(cloud, leaf_size=0.1)
pw.app.add_cloud(result, "降采样结果")
```

## 更多内容

- [Python 控制台使用](console.md)
- [Python 编辑器使用](editor.md)
- [API 参考](api-reference.md)
