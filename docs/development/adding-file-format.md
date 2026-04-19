# 添加新文件格式

本文介绍如何为 PointWorks 添加新的文件格式支持。

## 注册机制

PointWorks 使用 FileIO 分发表模式管理文件格式。要支持新格式，需实现 `FileReader` 和/或 `FileWriter` 接口并注册。

## 添加步骤

### 1. 实现读取器

```cpp
// libs/io/my_format_reader.h
class MyFormatReader : public FileReader {
public:
    QStringList supportedExtensions() const override {
        return { "myf" };
    }

    Cloud::Ptr read(const QString& path,
                    const FileIOOptions& options) override {
        auto cloud = Cloud::create();
        // 解析文件格式，填充点云数据
        // ...
        return cloud;
    }
};
```

### 2. 实现写入器

```cpp
// libs/io/my_format_writer.h
class MyFormatWriter : public FileWriter {
public:
    QStringList supportedExtensions() const override {
        return { "myf" };
    }

    bool write(const Cloud::Ptr& cloud,
               const QString& path,
               const FileIOOptions& options) override {
        // 将点云数据写入文件
        // ...
        return true;
    }
};
```

### 3. 注册到 FileIO

```cpp
// libs/io/file_io.cpp
void FileIO::registerBuiltinFormats() {
    // ... 已有格式注册 ...
    registerReader(std::make_shared<MyFormatReader>());
    registerWriter(std::make_shared<MyFormatWriter>());
}
```

### 4. 更新文件对话框过滤器

在打开/保存对话框的过滤器字符串中添加新格式：

```
"我的格式 (*.myf);;LAS (*.las);;PLY (*.ply)"
```

!!! tip "大文件支持"
    如果新格式支持流式读取，实现 `StreamingReader` 接口而非 `FileReader`，以支持大文件的分块加载。
