# Redoc 本地文件说明

如果 CDN 无法访问，可以将 Redoc 文件下载到本地。

## 下载文件

1. 下载 CSS 文件：
   - URL: https://unpkg.com/redoc@2.1.3/bundles/redoc.standalone.css
   - 保存为: `public/lib/redoc/redoc.standalone.css`

2. 下载 JS 文件：
   - URL: https://unpkg.com/redoc@2.1.3/bundles/redoc.standalone.js
   - 保存为: `public/lib/redoc/redoc.standalone.js`

## 目录结构

```
yudao-ui-admin/
└── public/
    └── lib/
        └── redoc/
            ├── redoc.standalone.css
            └── redoc.standalone.js
```

## 使用方式

下载文件后，如果 CDN 加载失败，系统会自动尝试加载本地文件。

## 下载命令（可选）

如果可以使用命令行下载：

```bash
# 创建目录
mkdir -p public/lib/redoc

# 下载文件（需要 curl 或 wget）
curl -o public/lib/redoc/redoc.standalone.css https://unpkg.com/redoc@2.1.3/bundles/redoc.standalone.css
curl -o public/lib/redoc/redoc.standalone.js https://unpkg.com/redoc@2.1.3/bundles/redoc.standalone.js
```

