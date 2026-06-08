/*
 * @Author: Carrie c.yuting@moovlogistics.com
 * @Date: 2025-12-17 14:20:32
 * @LastEditors: Carrie c.yuting@moovlogistics.com
 * @LastEditTime: 2026-01-15 10:33:14
 * @FilePath: \controltowerspring\yudao-ui-admin\microservicesData.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */

// 微服务代理配置
// 配置说明：
// - pathPrefix: 前端请求的路径前缀（需要与后端微服务的 context-path 对应）
// - target: 本地微服务的地址和端口
// - ws: 是否支持 WebSocket
// 示例：如果前端请求 /user/list，会被代理到 http://localhost:8081/user/list

const microServicesConfig = []
const LOCAL_BASE_API = 'http://127.0.0.1'

const microServicesObj = {
  air: {
    target: `${LOCAL_BASE_API}:48089`,
    pathPrefixData: ["/air","/air/milestone","/air/airport/list/all","/air/airport/list/page",
      "/air/airport/create","/air/airport/update","/air/airport/remove","air/base-data","/air/air-booking"
    ],
  },
  booking: {
    target: `${LOCAL_BASE_API}:48083`,
    pathPrefixData: ['/booking']
  },
  'infra': {
    target: `${LOCAL_BASE_API}:48081`,
    pathPrefixData: ['/infra', '/monitoring']
  },
  'order': {
    target: `${LOCAL_BASE_API}:48084`,
    pathPrefixData: [
      "/order",
      "/api",
      "/xmlcheck",
      "/cargoReadyDateLog",
      "/cargoInbound",
      "/actualCargoHandoverDateLog",
      "/order/task",
    ],
  },
  'report': {
    target: `${LOCAL_BASE_API}:48085`,
    pathPrefixData: ['/report', '/power']
  },
  'shipment': {
    target: `${LOCAL_BASE_API}:48086`,
    pathPrefixData: [
      '/shipment',
      '/system/test',
      '/pepco/shipment/clp',
      '/container/report',
      '/booking/contract-region',
      '/cut/off',
      '/edi/pvh',
      '/efl/book',
      '/inventory',
      '/v1/tmff',
      '/v1/tmff/hbl',
      '/v1/track',
      '/shipment/api',
      '/api'
    ],
  },
  'shipping': {
    target: `${LOCAL_BASE_API}:48087`,
    pathPrefixData: [
      '/shipping',
      '/pepco/booking-score',
      '/pepco/destination/container',
      '/pepco/destination/container/plan',
      '/pepco/destination',
      '/pepco/destination/hbl',
      '/pepco/destination/milestone',
      '/pepco/po/approval',
      '/pepco/shipping/approval',
      '/pepco/shipping',
      '/pepco/shipping/milestone',
      '/pepco/shipping/order',
      '/pepco/milestone'
    ]
  },
  'system': {
    target: `${LOCAL_BASE_API}:48082`,
    pathPrefixData: ['/system']
  },
  'wms': {
    target: `${LOCAL_BASE_API}:48088`,
    pathPrefixData: [
      '/openApi/salesOrders',
      '/warehouse/cc',
      '/warehouse',
      '/warehouse/kk/inventory',
      '/warehouse/third',
      '/openApi/inbound',
      '/openApi/outbound',
      '/openApi/purchaseOrders',
      '/openApi/inventory']
  }
}

Object.keys(microServicesObj).forEach(key => {
  microServicesObj[key].pathPrefixData.forEach(path => {
    microServicesConfig.push({
      pathPrefix: path,
      target: microServicesObj[key].target,
      ws:
        microServicesObj[key].ws !== undefined
          ? microServicesObj[key].ws
          : true, // 默认启用 WebSocket
      description: key,
    });
  });
});

microServicesConfig.sort((a, b) => {
  const lengthA = a.pathPrefix.length;
  const lengthB = b.pathPrefix.length;
  if (lengthB !== lengthA) {
    return lengthB - lengthA;
  }
  return a.pathPrefix.localeCompare(b.pathPrefix);
});

microServicesConfig.sort((a, b) => {
  const lengthA = a.pathPrefix.length
  const lengthB = b.pathPrefix.length
  if (lengthB !== lengthA) {
    return lengthB - lengthA
  }
  return a.pathPrefix.localeCompare(b.pathPrefix)
})

// 输出生成的代理配置信息（开发环境调试用）
if (process.env.ENV === 'local') {
  const serviceCount = {}
  microServicesConfig.forEach(config => {
    serviceCount[config.description] = (serviceCount[config.description] || 0) + 1
  })
}

module.exports = microServicesConfig
