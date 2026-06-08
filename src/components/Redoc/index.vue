<template>
  <div id="redoc-container" ref="redocContainer"></div>
</template>

<script>
export default {
  name: 'Redoc',
  props: {
    // OpenAPI 规范，支持以下格式：
    // 1. URL 字符串：'/v3/api-docs' 或 'https://example.com/api-docs'
    // 2. JSON 字符串：'{"openapi":"3.0.0",...}'
    // 3. JSON 对象：{openapi: "3.0.0", ...}
    spec: {
      type: [String, Object],
      required: true
    },
    // 基础配置（只保留最常用的一个 scrollYOffset）
    options: {
      type: Object,
      default: () => ({
        scrollYOffset: 0
      })
    }
  },
  data() {
    return {
      redocLoaded: false,
      redoclyObserver: null
    }
  },
  mounted() {
    this.loadRedocScript()
  },
  watch: {
    spec: {
      handler() {
        if (this.redocLoaded) {
          this.initRedoc()
        }
      },
      deep: true
    },
    options: {
      handler() {
        if (this.redocLoaded) {
          this.initRedoc()
        }
      },
      deep: true
    }
  },
  beforeDestroy() {
    // 清理 MutationObserver
    if (this.redoclyObserver) {
      this.redoclyObserver.disconnect()
      this.redoclyObserver = null
    }
    
    if (this.$refs.redocContainer) {
      this.$refs.redocContainer.innerHTML = ''
    }
  },
  methods: {
    // 基础版：只用一个 CDN 加载 redoc.standalone.js 和 CSS
    loadRedocScript() {
      if (window.Redoc) {
        this.redocLoaded = true
        this.initRedoc()
        return
      }

      // 加载 CSS
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = 'https://unpkg.com/redoc@2.1.3/bundles/redoc.standalone.css'
      document.head.appendChild(link)

      // 加载 JS
      const script = document.createElement('script')
      script.src = 'https://unpkg.com/redoc@2.1.3/bundles/redoc.standalone.js'
      // script.src = 'https://cdn.redoc.ly/redoc/latest/bundles/redoc.standalone.js'
      script.onload = () => {
        this.redocLoaded = true
        this.initRedoc()
      }
      script.onerror = () => {
        this.$emit('error', new Error('Failed to load Redoc script'))
      }
      document.head.appendChild(script)
    },

    // 基础版初始化：直接调用 Redoc.init
    initRedoc() {
      if (!this.redocLoaded || !this.$refs.redocContainer) {
        return
      }

      const container = this.$refs.redocContainer
      container.innerHTML = ''

      try {
        let specToUse = null

        if (typeof this.spec === 'string') {
          // 字符串：可能是 URL 或 JSON 字符串
          if (this.spec.startsWith('http://') || 
              this.spec.startsWith('https://') || 
              this.spec.startsWith('/')) {
            // URL 格式
            specToUse = this.spec
          } else {
            // 尝试解析为 JSON 对象
            try {
              specToUse = JSON.parse(this.spec)
            } catch (e) {
              this.$emit('error', new Error('Invalid JSON string in spec'))
              return
            }
          }
        } else if (typeof this.spec === 'object' && this.spec !== null) {
          // 直接是对象（JSON 对象）
          specToUse = this.spec
        } else {
          this.$emit('error', new Error('Invalid spec: must be URL string, JSON string, or object'))
          return
        }

        // Redoc.init 可以直接接受 URL 字符串或对象
        window.Redoc.init(
          specToUse,
          this.options || {},
          container
        )
        
        // 使用 MutationObserver 监听 DOM 变化，确保在 Redoc 渲染完成后移除品牌链接
        this.setupRedoclyBrandingRemover()
      } catch (error) {
        console.error('Redoc init error:', error)
        this.$emit('error', error)
      }
    },
    
    // 设置 Redocly 品牌链接移除器
    setupRedoclyBrandingRemover() {
      if (!this.$refs.redocContainer) {
        return
      }

      this.removeRedoclyBranding()
      //  监听 DOM 变化
      const observer = new MutationObserver(() => {
        this.removeRedoclyBranding()
      })
       
      // // 开始观察容器内的所有变化
      observer.observe(this.$refs.redocContainer, {
        childList: true,
        subtree: true
      })

      this.redoclyObserver = observer
      
      setTimeout(() => {
        this.removeRedoclyBranding()
      }, 1000)
    },
    
    // 移除 Redocly 品牌链接
    removeRedoclyBranding() {
      if (!this.$refs.redocContainer) {
        return
      }
      
      // 查找所有包含 redoc 相关链接的元素
      const links = this.$refs.redocContainer.querySelectorAll('a')
      links.forEach(link => {
        const href = (link.getAttribute('href') || '').toLowerCase()
        const text = (link.textContent || '').toLowerCase()
        
        // 匹配 redoc.ly、redocly 相关的链接
        if (href.includes('redoc') || text.includes('redocly') || text.includes('api docs by')) {
          link.style.display = 'none'
          link.style.visibility = 'hidden'
          if (link.parentElement && link.parentElement.children.length === 1) {
            link.parentElement.style.display = 'none'
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
#redoc-container {
  width: 100%;
  height: 100%;
  min-height: 600px;
  overflow: visible; /* 改为 visible，让子元素自己处理滚动 */
}

/* 使用深度选择器穿透 scoped 样式，定位 Redoc 生成的 DOM */
/* Redoc 2.x 的结构：.redoc-wrap > div:first-child (侧边栏) + div:last-child (主内容) */

/* 确保 Redoc 根容器使用 flex 布局 */
#redoc-container >>> .redoc-wrap {
  display: flex !important;
  height: 100% !important;
  overflow: visible !important;
}

/* 固定左侧菜单栏 - 第一个子元素 */
#redoc-container >>> .redoc-wrap > div:first-child {
  position: sticky !important;
  top: 0 !important;
  align-self: flex-start !important;
  max-height: 100vh !important;
  height: 100vh !important;
  overflow-y: auto !important;
  overflow-x: hidden !important;
  z-index: 10 !important;
  /* 限制宽度 */
  width: 260px !important;
  min-width: 260px !important;
  max-width: 260px !important;
  flex-shrink: 0 !important;
}

/* 针对 Redoc 的 menu-content 类（如果存在） */
#redoc-container >>> [class*="menu-content"] {
  position: sticky !important;
  top: 0 !important;
  max-height: 100vh !important;
  height: 100vh !important;
  overflow-y: auto !important;
  overflow-x: hidden !important;
}

/* 主内容区域可以正常滚动 */
#redoc-container >>> .redoc-wrap > div:last-child,
#redoc-container >>> .redoc-wrap > div:nth-child(2) {
  flex: 1 1 auto !important;
  min-width: 0 !important;
  overflow-y: auto !important;
  overflow-x: hidden !important;
  height: 100vh !important;
}


</style>

