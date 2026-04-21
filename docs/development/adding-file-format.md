---
title: 添加新文件格式
---

# 添加新文件格式

本文介绍如何为 PointWorks 添加新的点云或模型文件格式支持。

## 概述

PointWorks 的文件 I/O 系统位于 `libs/io/` 目录，采用 **调度器 + 分发** 模式：

```
FileIO 调度器 (fileio.cpp)
    |
    +-- loadPointCloud() --+-- loadLAS()
    |                      +-- loadPLY()
    |                      +-- loadPCD()
    |                      +-- loadTXT()
    |                      +-- loadE57()
    |                      +-- loadXXX()  <-- 新格式
    |
    +-- savePointCloud() --+-- saveLAS()
    |                      +-- savePLY()
    |                      +-- ...
    |                      +-- saveXXX()  <-- 新格式
    |
    +-- loadMeshFile()  --+-- loadOBJ()
    |                      +-- loadSTL()
    |                      +-- loadXXX()  <-- 新模型格式
    |
    +-- saveMeshFile()   --+-- ...
```

## 文件结构

```
libs/io/
  fileio.h              # FileIO 类声明（信号、槽、公共接口）
  fileio.cpp            # 调度器 + saveMeshFile + 辅助函数
  fileio_pointcloud.cpp # 点云格式加载/保存（LAS, PLY, PCD, TXT, E57）
  fileio_mesh.cpp       # 模型格式加载（OBJ, STL, VTK, IFS）
  textured_mesh.h       # 纹理网格数据结构
  projectfile.h/cpp     # 项目文件保存/加载
```

:::info[自动源文件注册]
ct_io 的 CMakeLists.txt 使用 `file(GLOB *.cpp)`，新增 .cpp 文件无需手动在 CMakeLists.txt 中注册。

:::
## 添加点云格式

### 第一步：声明加载/保存方法

在 `libs/io/fileio.h` 中添加私有方法声明：

```cpp
class FileIO : public QObject {
    Q_OBJECT

private:
    // 点云加载
    bool loadLAS(const QString& filename, Cloud::Ptr& cloud);
    bool loadPLY(const QString& filename, Cloud::Ptr& cloud);
    // ...
    bool loadXXX(const QString& filename, Cloud::Ptr& cloud);  // 新增

    // 点云保存
    bool saveLAS(const QString& filename, const Cloud::Ptr& cloud);
    bool savePLY(const QString& filename, const Cloud::Ptr& cloud);
    // ...
    bool saveXXX(const QString& filename, const Cloud::Ptr& cloud);  // 新增
};
```

### 第二步：实现加载/保存

在 `libs/io/fileio_pointcloud.cpp` 中实现（与同类格式放在一起）：

```cpp
// libs/io/fileio_pointcloud.cpp

bool FileIO::loadXXX(const QString& filename, Cloud::Ptr& cloud) {
    // 1. 打开文件，读取 Header 获取包围盒
    // ...

    // 2. 初始化八叉树（大点云）
    cloud->initOctree(globalBox);

    // 3. 流式读取（推荐，支持大文件和进度反馈）
    CloudBatch batch;
    batch.reserve(BATCH_SIZE);

    while (hasMorePoints()) {
        batch.points.push_back(readNextPoint());
        if (batch.points.size() >= BATCH_SIZE) {
            batch.flushTo(cloud);
            emit progress(currentPercent);
            if (m_is_canceled) return false;
        }
    }

    // 4. 处理全局坐标偏移
    // ...

    // 5. 生成 LOD
    cloud->generateLOD();

    return true;
}

bool FileIO::saveXXX(const QString& filename, const Cloud::Ptr& cloud) {
    // 1. 创建文件
    // 2. 写入 Header
    // 3. 遍历 Block 写入点数据
    // 4. 处理全局偏移还原
    return true;
}
```

### 第三步：添加格式分发

在 `fileio.cpp` 的调度器方法中添加分发分支：

```cpp
// fileio.cpp

bool FileIO::loadPointCloud(const QString& filename, Cloud::Ptr& cloud) {
    QString ext = QFileInfo(filename).suffix().toLower();

    if (ext == "las" || ext == "laz")  return loadLAS(filename, cloud);
    else if (ext == "ply")             return loadPLY(filename, cloud);
    else if (ext == "pcd")             return loadPCD(filename, cloud);
    // ...
    else if (ext == "xxx")             return loadXXX(filename, cloud);  // 新增
    else return false;
}

bool FileIO::savePointCloud(const QString& filename, const Cloud::Ptr& cloud) {
    QString ext = QFileInfo(filename).suffix().toLower();

    if (ext == "las" || ext == "laz")  return saveLAS(filename, cloud);
    // ...
    else if (ext == "xxx")             return saveXXX(filename, cloud);  // 新增
    else return false;
}
```

### 第四步：更新文件对话框过滤器

在 `libs/ui/base/cloudtree.h` 中的文件对话框过滤器字符串添加新格式：

```cpp
// 打开文件对话框过滤器
"Point Clouds (*.las *.laz *.ply *.pcd *.txt *.xyz *.asc *.e57 *.xxx);;"
"All Files (*.*)"

// 保存文件对话框过滤器
"LAS (*.las);;LAZ (*.laz);;PLY (*.ply);;PCD (*.pcd);;"
"E57 (*.e57);;TXT (*.txt);;XXX (*.xxx)"  // 新增
```

### 第五步：测试

- 测试流式加载（大文件）
- 测试保存后重新加载的一致性
- 测试全局坐标偏移
- 测试颜色和法线数据的读写

## 添加模型格式

### 第一步：声明加载方法

在 `libs/io/fileio.h` 中添加（含 mesh 参数）：

```cpp
class FileIO : public QObject {
private:
    bool loadOBJ(const QString& filename, vtkSmartPointer<vtkPolyData>& mesh);
    bool loadSTL(const QString& filename, vtkSmartPointer<vtkPolyData>& mesh);
    // ...
    bool loadXXX(const QString& filename, vtkSmartPointer<vtkPolyData>& mesh);  // 新增
};
```

### 第二步：实现加载

在 `libs/io/fileio_mesh.cpp` 中实现：

```cpp
bool FileIO::loadXXX(const QString& filename, vtkSmartPointer<vtkPolyData>& mesh) {
    // 1. 解析模型文件
    // 2. 构建 VTK PolyData
    // 3. 处理纹理（如果有）
    return true;
}
```

### 第三步：添加分发

模型格式的加载在 `fileio.cpp` 的 `loadPointCloud()` 调度器的 else 分支中处理：

```cpp
// fileio.cpp - loadPointCloud 的末尾
else {
    // 尝试作为模型加载
    vtkSmartPointer<vtkPolyData> mesh;
    if (loadXXX(filename, mesh)) {
        // 成功加载为模型
        emit meshLoaded(mesh);
        return true;
    }
    // 最终尝试 loadGeneralPCL
    return loadGeneralPCL(filename, cloud);
}
```

保存模型格式在 `saveMeshFile()` 中添加分发。

### 第四步：保存分发

```cpp
// fileio.cpp - saveMeshFile
bool FileIO::saveMeshFile(const QString& filename, const vtkSmartPointer<vtkPolyData>& mesh) {
    QString ext = QFileInfo(filename).suffix().toLower();

    if (ext == "obj") return saveOBJ(filename, mesh);
    else if (ext == "stl") return saveSTL(filename, mesh);
    // ...
    else if (ext == "xxx") return saveXXX(filename, mesh);  // 新增
    else return false;
}
```

## 当前支持的格式

### 点云格式

| 格式 | 扩展名 | 读取 | 写入 | 库 |
|------|--------|------|------|----|
| LAS | `.las` | Yes | Yes | LASlib |
| LAZ | `.laz` | Yes | Yes | LASlib |
| PLY | `.ply` | Yes | Yes | PCL |
| PCD | `.pcd` | Yes | Yes | PCL |
| TXT | `.txt` `.xyz` `.asc` | Yes | Yes | 自定义解析 |
| E57 | `.e57` | Yes | Yes | E57Format |

### 模型格式

| 格式 | 扩展名 | 读取 | 写入 | 说明 |
|------|--------|------|------|------|
| OBJ | `.obj` | Yes | Yes | 支持纹理检测 |
| STL | `.stl` | Yes | Yes | - |
| VTK | `.vtk` | Yes | Yes | VTK PolyData |
| IFS | `.ifs` | Yes | - | - |

## 实现注意事项

### 流式加载

对于可能很大的格式，建议实现流式加载：

```cpp
bool FileIO::loadXXX(const QString& filename, Cloud::Ptr& cloud) {
    // 每批 50 万点
    const size_t BATCH_SIZE = 500000;
    CloudBatch batch;
    batch.reserve(BATCH_SIZE);

    while (hasMorePoints()) {
        batch.points.push_back(readNextPoint());
        if (batch.points.size() >= BATCH_SIZE) {
            batch.flushTo(cloud);
            emit progress(currentPercent);
            // 检查取消
            QMutexLocker locker(&m_mutex);
            if (m_is_canceled) return false;
        }
    }
    // ...
}
```

### 全局坐标偏移

新格式必须正确处理全局坐标偏移：

```cpp
// 加载时
Eigen::Vector3d shift = calculateCentroid(cloud);
cloud->setGlobalShift(shift);
// 减去偏移
for (auto& block : cloud->blocks()) {
    for (auto& pt : block->points()) {
        pt.x -= shift.x();
        pt.y -= shift.y();
        pt.z -= shift.z();
    }
}

// 保存时
Eigen::Vector3d shift = cloud->getGlobalShift();
// 加回偏移
pt.x += shift.x();
pt.y += shift.y();
pt.z += shift.z();
```

## 相关主题

- [项目架构](architecture) - FileIO 在架构中的位置
- [大点云处理](../advanced/large-pointcloud) - 流式加载和八叉树
- [全局坐标偏移](../advanced/global-shift) - 坐标偏移详解
