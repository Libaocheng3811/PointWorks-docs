---
title: 教程
---

# 教程

本部分提供 PointWorks 三维点云处理软件的实战教程，涵盖从入门到进阶的完整工作流。

## 教程列表

| 教程 | 说明 | 难度 |
|------|------|------|
| [基础工作流](basic-workflow) | 打开、滤波、分割、导出的完整流程 | 入门 |
| [地面滤波实战](ground-filtering) | 使用 CSF 布料模拟算法从原始点云提取地面点 | 入门 |
| [点云配准实战](registration-tutorial) | 两站点云的粗配准与精配准 | 中级 |
| [变化检测实战](change-detect-tutorial) | 两期数据对比，自动识别变化区域 | 中级 |
| [Python 自动化实战](python-automation) | 使用 Python 脚本批量处理点云 | 进阶 |

## 前置条件

在开始教程之前，请确保：

- 已正确安装 PointWorks 并能正常启动
- 准备好示例点云数据（LAS、PLY 或 PCD 格式）
- 了解基本的点云概念（坐标、颜色、法线等）

:::tip[获取示例数据]
可以从公开数据集获取测试数据，如 [USGS 3DEP](https://www.usgs.gov/3d-elevation-program) 或 [OpenTopography](https://opentopography.org/) 提供的免费 LiDAR 点云数据。

:::
## 软件界面概览

PointWorks 主界面由以下核心区域组成：

- **菜单栏** - 文件、编辑、工具、插件、Python、选项等功能入口
- **点云树** - 左侧面板，管理已加载的点云列表
- **3D 视图** - 中央区域，基于 VTK 的三维渲染视口
- **控制台** - 底部面板，显示日志和 Python 输出
- **工具浮窗** - 可拖拽的参数配置面板

![PointWorks 界面](pathname:///img/screenshots/interface-overview.png)

## 导航到下一个教程

建议从 [基础工作流](basic-workflow) 开始，按照顺序学习。
