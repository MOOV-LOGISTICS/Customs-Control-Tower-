# Redoc OpenAPI 文档集成指南

## 简介

Redoc 是一个功能强大的 OpenAPI 文档生成工具，提供了比 Swagger UI 更现代、更美观的文档展示界面。本项目已集成 Redoc，可以通过动态加载 OpenAPI 规范来展示 API 文档。

## 安装说明

### 方式一：CDN 方式（默认，推荐）

项目默认使用 CDN 方式加载 Redoc，支持多个 CDN 源自动降级：
1. unpkg.com（优先）
2. cdn.jsdelivr.net
3. cdn.bootcdn.net
4. 本地文件（如果存在）

**优点**：
- 无需安装 npm 包
- 减少打包体积
- 自动 CDN 降级

### 方式二：本地文件方式（CDN 无法访问时）

如果所有 CDN 都无法访问，可以下载文件到本地：

1. 创建目录：`public/lib/redoc/`
2. 下载文件：
   - CSS: https://unpkg.com/redoc@2.1.3/bundles/redoc.standalone.css
   - JS: https://unpkg.com/redoc@2.1.3/bundles/redoc.standalone.js
3. 系统会自动尝试加载本地文件

### 方式三：npm 包方式（不推荐，可能有编译问题）

如果需要使用 npm 包：
```bash
cd yudao-ui-admin
npm install redoc --save
```

然后修改 `src/components/Redoc/index.vue` 使用 `import` 方式导入。

## 文件结构

```
yudao-ui-admin/
├── src/
│   ├── components/
│   │   └── Redoc/
│   │       └── index.vue          # Redoc 组件
│   └── views/
│       └── infra/
│           └── redoc/
│               └── index.vue      # Redoc 页面视图
```

## 使用方法

### 1. 基本使用

在 Vue 组件中使用 Redoc 组件：

```vue
<template>
  <redoc :spec="specUrl" :options="redocOptions" />
</template>

<script>
import Redoc from '@/components/Redoc'

export default {
  components: {
    Redoc
  },
  data() {
    return {
      // OpenAPI 规范 URL
      specUrl: 'https://api.example.com/v3/api-docs',
      // 或者直接使用 JSON 对象
      // specUrl: { openapi: '3.0.0', ... },
      
      // Redoc 配置选项
      redocOptions: {
        scrollYOffset: 0,
        hideDownloadButton: false,
        expandResponses: '200,201',
        theme: {
          colors: {
            primary: {
              main: '#004F7C'
            }
          }
        }
      }
    }
  }
}
</script>
```

### 2. 通过路由访问

Redoc 页面已创建在 `src/views/infra/redoc/index.vue`，你可以通过以下方式配置路由：

#### 方式一：在路由配置中添加（推荐）

在 `src/router/index.js` 的 `constantRoutes` 中添加：

```javascript
{
  path: '/infra/redoc',
  component: Layout,
  hidden: true,
  children: [{
    path: '',
    component: (resolve) => require(['@/views/infra/redoc'], resolve),
    name: 'InfraRedoc',
    meta: { title: 'API 文档 (Redoc)', icon: 'documentation' }
  }]
}
```

#### 方式二：通过后端动态路由

如果项目使用后端动态路由，可以在后端菜单配置中添加：
- 路由路径: `/infra/redoc`
- 组件路径: `infra/redoc/index`
- 菜单名称: `API 文档 (Redoc)`

### 3. 配置 OpenAPI 文档地址

#### 方式一：通过系统配置（推荐）

在系统配置中添加配置项：
- 配置键: `url.redoc`
- 配置值: `http://your-api-server/v3/api-docs/all?token={token}&tenantId={tenantId}`

系统会自动从配置中读取 URL。

#### 方式二：使用默认地址

默认使用: `${VUE_APP_BASE_API}/v3/api-docs/all`

支持通过 URL 参数指定 API 分组：
- `/infra/redoc?group=all` - 所有 API
- `/infra/redoc?group=shipment` - Shipment API
- `/infra/redoc?group=system` - System API

### 4. 自定义配置

在 `src/views/infra/redoc/index.vue` 中可以自定义 Redoc 选项：

```javascript
redocOptions: {
  scrollYOffset: 0,                    // 滚动偏移量
  hideDownloadButton: false,           // 隐藏下载按钮
  hideHostname: false,                 // 隐藏主机名
  expandResponses: '200,201',         // 默认展开的响应码
  jsonSampleExpandLevel: 2,           // JSON 示例展开层级
  theme: {
    colors: {
      primary: {
        main: '#004F7C'                // 主题色
      }
    },
    typography: {
      fontSize: '14px',
      code: {
        fontSize: '13px'
      }
    }
  }
}
```

## API 分组支持

如果你的后端支持多个 API 分组，可以通过以下方式访问：

1. **所有 API**: `/infra/redoc?group=all`
2. **Shipment API**: `/infra/redoc?group=shipment`
3. **System API**: `/infra/redoc?group=system`
4. **其他分组**: `/infra/redoc?group={groupName}`

## 认证支持

Redoc 页面会自动从请求头中获取认证信息：
- `Authorization`: Bearer token
- `tenant-id`: 租户 ID

这些信息会自动添加到 OpenAPI 规范 URL 的查询参数中。

## 与 Swagger 对比

| 特性 | Redoc | Swagger UI |
|------|-------|------------|
| 界面美观度 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| 响应式设计 | ✅ | ✅ |
| 代码示例 | ✅ | ✅ |
| 主题定制 | ✅ | ⚠️ 有限 |
| 性能 | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| 交互体验 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |

## 常见问题

### 1. Redoc 组件不显示

- 检查网络连接，确保可以访问 CDN（jsdelivr.net）
- 检查 `spec` prop 是否正确传递
- 查看浏览器控制台是否有错误信息
- 如果 CDN 无法访问，可以修改组件中的 CDN 地址或使用本地文件

### 2. OpenAPI 规范加载失败

- 检查 OpenAPI 规范 URL 是否正确
- 检查网络连接和 CORS 配置
- 确认后端服务是否正常运行

### 3. 认证问题

- 确认已正确登录系统
- 检查 token 是否有效
- 查看请求头是否正确设置

## 更多资源

- [Redoc 官方文档](https://github.com/Redocly/redoc)
- [OpenAPI 规范](https://swagger.io/specification/)
- [Springdoc OpenAPI](https://springdoc.org/)

## 更新日志

### 2024-01-XX
- 初始版本
- 支持动态加载 OpenAPI 规范
- 支持多 API 分组
- 自动处理认证信息
- 自定义主题配置

