'use strict'
const path = require('path')
const timeStamp= new Date().getTime()
const defaultSettings = require('./src/settings.js')

function resolve(dir) {
  return path.join(__dirname, dir)
}

const CompressionPlugin = require('compression-webpack-plugin')

const name = process.env.VUE_APP_TITLE || 'smartMOOV' // 网页标题

const port = process.env.port || process.env.npm_config_port || 80 // 端口

const microServicesConfig = require('./microservicesData.js')

// 判断当前是否为 local 模式
function isLocalMode() {
  if (process.env.ENV === 'local') {
    return true
  }

  return false
}


function generateProxyConfig() {
  const proxyConfig = {}

  // 为每个微服务生成代理配置
  microServicesConfig.forEach(service => {

    // 在 bypass 中精确判断是否是 API 请求
    proxyConfig[service.pathPrefix] = {
      target: service.target,
      changeOrigin: true,           // 改变请求头中的 origin
      ws: service.ws,                // 支持 WebSocket
      secure: false,                 // 如果是 https 接口，需要配置这个参数
      // 对于前端路由，直接返回 index.html 路径，让 webpack-dev-server 返回前端页面
      bypass: function(req, res, proxyOptions) {
        const pathname = req.url.split('?')[0] // 获取路径部分，去掉查询参数

        if(pathname && pathname.startsWith('/admin-api')){
          return null; // 让 /admin-api 请求走代理
        }

        const isApiRequest = pathname && (pathname.includes('/api/') || pathname.includes('/v1/'))

        if (!isApiRequest) {
          console.log(`[跳过代理] ${service.description} ${req.method} ${req.url} ${pathname} 不是 API 请求，将返回前端页面`)
          return '/index.html'
        }

        // 3. 是 API 请求，正常走代理
        console.log(`[走代理] ${service.description} ${req.method} ${req.url} ${pathname} 是 API 请求`)
        return null  // 走代理
      },
      logLevel: 'debug',             // 开发环境显示代理日志
      onProxyReq: (proxyReq, req, res) => {
        console.log(`[代理] ${service.description} ${req.method} ${req.url} -> ${service.target}${req.url}`)
      },
      onError: (err, req, res) => {
        res.writeHead(500, {
          'Content-Type': 'text/plain'
        })
        res.end(`代理错误: ${service.description} 无法连接，请确保微服务已启动在 ${service.target}`)
      }
    }

    // 为 /admin-api 开头的请求也创建代理配置
    // 例如：/admin-api/system/tenant/get-id-by-name 会匹配到 /admin-api/system
    const adminApiPath = `/admin-api${service.pathPrefix}`
    proxyConfig[adminApiPath] = {
      target: service.target,
      changeOrigin: true,
      ws: service.ws,
      secure: false,
      // 去掉 /admin-api 前缀，因为后端不需要这个前缀
      pathRewrite: {
        [`^/admin-api${service.pathPrefix}`]: service.pathPrefix
      },
      logLevel: 'debug',
      onProxyReq: (proxyReq, req, res) => {
        console.log(`[代理] ${service.description} ${req.method} ${req.url} -> ${service.target}${req.url.replace('/admin-api', '')}`)
      },
      onError: (err, req, res) => {
        res.writeHead(500, {
          'Content-Type': 'text/plain'
        })
        res.end(`代理错误: ${service.description} 无法连接，请确保微服务已启动在 ${service.target}`)
      }
    }
  })

  return proxyConfig
}
// vue.config.js 配置说明
//官方vue.config.js 参考文档 https://cli.vuejs.org/zh/config/#css-loaderoptions
// 这里只列一部分，具体配置参考文档
module.exports = {
  // 部署生产环境和开发环境下的URL。
  // 默认情况下，Vue CLI 会假设你的应用是被部署在一个域名的根路径上
  // 例如 https://www.ruoyi.vip/。如果应用被部署在一个子路径上，你就需要用这个选项指定这个子路径。例如，如果你的应用被部署在 https://www.ruoyi.vip/admin/，则设置 baseUrl 为 /admin/。
  publicPath: process.env.PUBLIC_PATH ? process.env.PUBLIC_PATH : '/',
  // 在npm run build 或 yarn build 时 ，生成文件的目录名称（要和baseUrl的生产环境路径一致）（默认dist）
  outputDir: 'dist',
  // 用于放置生成的静态资源 (js、css、img、fonts) 的；（项目打包之后，静态资源会放在这个文件夹下）
  assetsDir: 'static',
  // 是否开启eslint保存检测，有效值：ture | false | 'error'
  lintOnSave: process.env.NODE_ENV === 'development',
  // 如果你不需要生产环境的 source map，可以将其设置为 false 以加速生产环境构建。
  productionSourceMap: false,
  // webpack-dev-server 相关配置
  devServer: {
    host: '0.0.0.0',
    port: port,
    open: true,
    historyApiFallback: true,
    // 只在 local 模式下启用代理
    proxy: isLocalMode() ? generateProxyConfig() : {
      '/proxy-api': {
        target: `http://161.189.170.87:48080`,
        // target: `http://api-dashboard.yudao.iocoder.cn`,
        changeOrigin: true,
        pathRewrite: {
          ['^' + process.env.VUE_APP_BASE_API]: ''
        }
      }
    },
    disableHostCheck: true
  },
  css: {
      // 输出重构 打包编译后的css文件名称，添加时间戳
      extract: {
        filename: `css/[name].${timeStamp}.css`,
        chunkFilename: `css/[name].${timeStamp}.css`,
      },
    loaderOptions: {
      sass: {
        sassOptions: { outputStyle: "expanded" }
      }
    }
  },
  configureWebpack: {
      output: {
        filename: `js/[name].js?v=${timeStamp}`,
        chunkFilename: `js/[name].js?v=${timeStamp}`,
      },
    name: name,
    resolve: {
      alias: {
        '@': resolve('src')
      }
    },
    // 排除 redoc 包，使用 CDN 方式加载
    externals: process.env.NODE_ENV === 'production' ? {
      'redoc': 'RedocStandalone'
    } : {},
    plugins: [
      // http://doc.ruoyi.vip/ruoyi-vue/other/faq.html#使用gzip解压缩静态文件
      new CompressionPlugin({
        cache: false,                   // 不启用文件缓存
        test: /\.(js|css|html)?$/i,     // 压缩文件格式
        filename: '[path].gz[query]',   // 压缩后的文件名
        algorithm: 'gzip',              // 使用gzip压缩
        minRatio: 0.8                   // 压缩率小于1才会压缩
      }),
    ],
  },
  chainWebpack(config) {
    config.plugins.delete('preload') // TODO: need test
    config.plugins.delete('prefetch') // TODO: need test

    // set svg-sprite-loader
    config.module
      .rule('svg')
      .exclude.add(resolve('src/assets/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/assets/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()

    config
      .when(process.env.NODE_ENV !== 'development',
        config => {
          config
            .plugin('ScriptExtHtmlWebpackPlugin')
            .after('html')
            .use('script-ext-html-webpack-plugin', [{
            // `runtime` must same as runtimeChunk name. default is `runtime`
              inline: /runtime\..*\.js$/
            }])
            .end()
          config
            .optimization.splitChunks({
              chunks: 'all',
              maxInitialRequests: Infinity,
              minSize: 20000, // 引入的模块大于20kb才做代码分割，官方默认20000，这里不用修改了
              //maxSize: 50000, // 若引入的模块大于50kb，则告诉webpack尝试再进行拆分
              cacheGroups: {
//                libs: {
//                  name: 'chunk-libs',
//                  test: /[\\/]node_modules[\\/]/,
//                  priority: -10,
//                  chunks: 'initial' // only package third parties that are initially dependent
//                },
                elementUI: {
                  name: 'chunk-elementUI', // split elementUI into a single package
                  priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
                  test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // in order to adapt to cnpm
                },
                commons: {
                  name: 'chunk-commons',
                  test: resolve('src/components'), // can customize your rules
                  minChunks: 3, //  minimum common number
                  priority: 5,
                  reuseExistingChunk: true
                },
                libs: {
                  test: /[\\/]node_modules[\\/]/, // 使用正则匹配node_modules中引入的模块
                  priority: 10, // 优先级值越大优先级越高，默认-10，不用修改
                  chunks: 'initial', // only package third parties that are initially dependent
                  name(module) {
                    // 设定分包以后的文件模块名字，按照包名字替换拼接一下

                    if (!module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)) return;
                    const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
                    return `npm.${packageName.replace('@', '')}`;
                  }
                },
                default: {
                    // 表示这个库 至少被多少个chunks引入，
                    minChunks: 2,
                    priority: -20,
                    // 如果 这个模块已经 被分到 vendors组，这里无需在分割 直接引用 分割后的
                    reuseExistingChunk: true
                },
              }
            })
            console.log("拆包-加速js")
          config.optimization.runtimeChunk('single'),
          {
             from: path.resolve(__dirname, './public/robots.txt'), //防爬虫文件
             to: './', //到根目录下
          }
        }
      )
  }
}
