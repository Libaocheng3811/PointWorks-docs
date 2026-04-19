# 数据管理

数据管理模块负责点云和网格文件的导入、导出以及项目工作区的管理。该模块基于 `ct_io` 库实现，采用流式 I/O 架构，支持大规模点云的高效加载与保存。

## 模块组成

### [文件格式支持](file-formats.md)

PointWorks 支持业界主流的点云和网格文件格式，覆盖测绘、三维建模等领域常用的数据交换标准。

- **点云格式**：LAS/LAZ、PLY、PCD、E57、TXT/XYZ/ASC
- **网格格式**：OBJ（含纹理）、STL、VTK、IFS

### [导入导出](import-export.md)

完整的文件加载与保存流程，包括：

- 拖放式文件导入
- 批量文件加载
- TXT 文件的字段映射配置
- 全局坐标偏移自动检测与设置
- 加载进度实时反馈

### [项目文件](project-files.md)

项目级工作区管理功能，支持：

- 保存当前工作区状态（已加载点云列表、视图状态等）
- 快速恢复上次工作环境
- 最近项目列表管理

## 技术架构

数据管理功能的核心由 `FileIO` 类调度，按数据类型拆分为多个编译单元：

| 组件 | 文件 | 职责 |
|------|------|------|
| FileIO 调度器 | `libs/io/fileio.cpp` | 格式分发、公共逻辑 |
| 点云格式读写 | `libs/io/fileio_pointcloud.cpp` | LAS、PLY、PCD、TXT、E57 |
| 网格格式读写 | `libs/io/fileio_mesh.cpp` | OBJ、STL、VTK、IFS |
| 项目文件管理 | `libs/io/projectfile.cpp` | 项目保存/加载 |
| TXT 字段映射 | `libs/ui/dialog/fieldmappingdialog.h` | TXT 导入列配置 |
| 全局偏移设置 | `libs/ui/dialog/globalshiftdialog.h` | 坐标偏移配置 |

## 大数据支持

!!! info "流式加载"
    点云文件采用流式加载策略，每批处理 50 万个点。加载过程中会实时报告进度，并支持取消操作。这意味着即使是数亿级别的点云，也能在不耗尽内存的情况下完成加载。

!!! warning "全局坐标偏移"
    当点云使用 UTM 等大坐标系（如 x=500000）时，直接渲染会导致 GPU 浮点精度丢失，表现为点云抖动或显示异常。PointWorks 会自动检测并提示设置全局偏移，将坐标平移至原点附近进行渲染，保存时自动还原。

## 相关主题

- [功能总览](../index.md) -- 所有功能模块一览
- [文件格式详情](file-formats.md) -- 各格式的详细说明
- [导入导出操作](import-export.md) -- 具体操作步骤
- [项目文件说明](project-files.md) -- 项目管理功能
