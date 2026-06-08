import request from '@/utils/request'
import {queryStringify} from "@/utils/queryParamsUtils";

// 创建订单头
export function createHeader(data) {
  return request({
    url: '/order/header/create',
    method: 'post',
    data: data
  })
}

// 更新订单头
export function updateHeader(data) {
  return request({
    url: '/order/header/update',
    method: 'put',
    data: data
  })
}

// 删除订单头
export function deleteHeader(id) {
  return request({
    url: '/order/header/delete?id=' + id,
    method: 'delete'
  })
}
// hold订单头
export function holdHeader(data) {
  return request({
    url: '/order/header/hold',
    method: "post",
    params: data
  })
}
// active订单头
export function activeHeader(data) {
  return request({
    url: '/order/header/active',
    method: "post",
    params: data
  })
}


// 获得订单头
export function getHeader(id) {
  return request({
    url: '/order/header/get?id=' + id,
    method: 'get'
  })
}

// 获得订单头分页
export function getHeaderPage(query) {
  return request({
    url: '/order/header/page',
    method: 'get',
    params: query
  })
}
export function getHeaderPage1(query) {
  return request({
    url: '/order/header/page1',
    method: 'get',
    params: query
  })
}
export function getHeaderList(query) {
  return request({
    url: '/order/header/list',
    method: 'get',
    params: query
  })
}

// 导出订单头 Excel
export function exportHeaderExcel(query) {
  return request({
    url: '/order/header/export-excel',
    method: 'get',
    params: query,
    responseType: 'blob'
  })
}

// 导出po
export function exportPO(query) {
  return request({
    url: 'order/export',
    method: 'get',
    params: query,
    responseType: 'blob',
    timeout: '1200000'
  })
}
// 导出po1
export function exportPO1(query) {
  return request({
    url: 'order/export1',
    method: 'get',
    params: query,
    responseType: 'blob',
    timeout: '1200000'
  })
}

export function exportPOAll(query) {
  return request({
    url: 'order/exportAll',
    method: 'get',
    params: query,
    responseType: 'blob',
    timeout: '1200000'
  })
}

// 导出po2
export function exportPO2(query) {
  return request({
    url: 'order/export2',
    method: 'get',
    params: query,
    responseType: 'blob',
    timeout: '1200000'
  })
}
export function exportSO(query) {
  return request({
    url: 'order/exportSO',
    method: 'get',
    params: query,
    responseType: 'blob',
    timeout: '1200000'
  })
}

export function exportKaemingk(query) {
  return request({
    url: 'order/exportKaemingk',
    method: 'get',
    params: query,
    responseType: 'blob',
    timeout: '1200000'
  })
}

export function importTemplate() {
  return request({
    url: 'order/get-import-template',
    method: 'get',
    responseType: 'blob'
  })
}
export function downloadKaemingkTemplate() {
  return request({
    url: 'order/downloadKaemingkTemplate',
    method: 'get',
    responseType: 'blob'
  })
}
export function downloadHenkelmanTemplate() {
  return request({
    url: 'order/downloadHenkelmanTemplate',
    method: 'get',
    responseType: 'blob'
  })
}

export function listByConditionOrder(query) {
  return request({
    url: '/order/header/listByCondition',
    method: 'get',
    params: query
  })
}


export function countOrder(query) {
  return request({
    url: '/order/header/count',
    method: 'get',
    params: query
  })
}

export function groupByOha(query) {
  return request({
    url: '/order/header/groupByOha',
    method: 'get',
    params: query
  })
}
export function groupByCategoryCode(query) {
  return request({
    url: '/order/header/groupByCategoryCode',
    method: 'get',
    params: query
  })
}

export function getApiLogPage(query) {
  return request({
    url: '/order/api-log/page',
    method: 'get',
    params: query
  })
}

export function orderReport(query) {
  return request({
    url: '/order/header/orderReport',
    method: 'get',
    params: query
  })
}

export function orderReportForKaemingk(query) {
  return request({
    url: '/order/header/orderReportForKaemingk',
    method: 'get',
    params: query
  })
}
export function getTenantIdsHaveDataByOrder() {
  return request({
    url: '/order/header/getTenantIdsHaveData',
    method: 'get'
  })
}
// 获得订单头
export function getHeaderApiByOrderId(id) {
  return request({
    url: '/order/header/getHeaderApiByOrderId?id=' + id,
    method: 'get'
  })
}
export function getInboundFilesById(id) {
  return request({
    url: '/order/header/getInboundFilesById?id=' + id,
    method: 'get'
  })
}
export function updateKaemingk(data) {
  return request({
    url: '/order/updateKaemingk',
    method: "post",
    //Content-Type请求类型必须设置为multipart/form-data
    headers: {
      "Content-Type": "multipart/form-data",
    },
    // 上传文件
    data,
  })
}


export function importPepcoTemplate() {
  return request({
    url: 'order/pepco/get-import-template',
    method: 'get',
    responseType: 'blob'
  })
}
// 导出po
export function exportPepcoPO(query) {
  return request({
    url: 'order/pepco/export',
    method: 'get',
    params: query,
    responseType: 'blob',
    timeout: '1200000'
  })
}

export function getHeaderPageForPepco(query) {
  return request({
    url: '/order/header/pepco/page',
    method: 'get',
    params: query
  })
}
export function getOrderPageForChange(query) {
  return request({
    url: '/order/header/pepco/page/for/amend',
    method: 'get',
    params: query
  })
}
export function changePoByOrderNumber(query) {
  return request({
    url: '/order/header/pepco/chagePoByOrderNumber',
    method: 'post',
    params: query
  })
}

export function getOrder4ShippingBook(query) {
  return request({
    url: '/order/header/pepco/order-for-shipping',
    method: 'get',
    params: query
  })
}

export function getOrder4Factory(query) {
  return request({
    url: '/order/header/pepco/order-for-factory',
    method: 'get',
    params: query
  })
}
export function getOrder4FactorySelected(query) {
  return request({
    url: '/order/header/pepco/order-for-factory-selected',
    method: 'get',
    params: query
  })
}

export function getOrder4SubDeptSelected(query) {
  console.log("11111")
  return request({
    url: '/order/header/pepco/order-for-sub-dept-selected',
    method: 'get',
    params: query
  })
}


export function updateCRD(data) {
  return request({
    url: '/order/header/updateCRD',
    method: 'post',
    data: data
  })
}

export function batchUpdateCRD(data) {
  return request({
    url: '/order/header/batch-update-crd',
    method: 'post',
    data: data
  })
}


export function getOrdreItemByShipmentId(query) {
  return request({
    url: '/order/header/pepco/order-item',
    method: 'get',
    params: query
  })
}

export function getOrdreByNumbers(query) {
  return request({
    url: '/order/header/pepco/orderByNumbers',
    method: 'get',
    params: query
  })
}

export function groupByCountryAndSuppliercode(query) {
  return request({
    url: '/order/header/pepco/groupByCountryAndSuppliercode',
    method: 'get',
    params: query
  })
}

export function countOrderByCountry(query) {
  return request({
    url: '/order/header/countOrderByCountry',
    method: 'get',
    params: query
  })
}

// 下载PO数据
export function downloadOrderData(query) {
  return request({
    url: '/order/header/pepco/po-download',
    method: 'get',
    responseType: 'blob',
    params: query
  })
}

export function downloadOrderListData(query) {
  return request({
    url: '/order/header/pepco/po-list-download',
    method: 'get',
    responseType: 'blob',
    params: query
  })
}

// 下载PO数据
export function getOrderStatus(query) {
  return request({
    url: '/order/header/pepco/order-status',
    method: 'get',
    params: query
  })
}

export function groupByCarrierAndTransportMeanName() {
  return request({
    url: '/shipment/api/pepco/groupByCarrierAndTransportMeanName',
    method: 'get',
  })
}

export function getHeaderTaskPage(params) {
  return request({
    url: '/order/header/getHeaderTaskPage',
    method: 'get',
    params: params
  })
}

// 根据orderNumber 获取order_header数据
export function getByOrderNumber(orderNumber) {
  return request({
    url: '/order/header/getByOrderNumber?orderNumber=' + orderNumber,
    method: 'get'
  })
}

// 根据orderNumber 获取order_header数据
export function getByOrderNumbers(params) {
  return request({
    url: `/order/header/getByOrderNumbers?${queryStringify(params)}`,
    method: 'get'
  })
}


export function getHeaderPageForPepcoList(query) {
  return request({
    url: '/order/v2/header/pepco/page',
    method: 'get',
    params: query
  })
}

export function getHeaderInfoForPepco(query) {
  return request({
    url: '/order/v2/header/pepco/info',
    method: 'get',
    params: query
  })
}


export function getExpandedData(query) {
  return request({
    url: '/order/v2/header/pepco/detail',
    method: 'get',
    params: query
  })
}

export function getOrderTaskList(query) {
  return request({
    url: '/order/v2/header/pepco/orderTaskList',
    method: 'get',
    params: query
  })
}


export function exportPoData(query) {
  return request({
    url: 'order/exportPoExcel',
    method: 'get',
    params: query,
    responseType: 'blob',
    timeout: '1200000'
  })
}

export function getHeaderTasksByOrderNumbers(params) {
  return request({
    url: '/order/header/getHeaderTasksByOrderNumbers',
    method: 'get',
    params: params
  })
}

export function getHasAHodOrdersByShippingOrderId(params) {
  return request({
    url: '/cargoInbound/getHasAHodOrdersByShippingOrderId',
    method: 'get',
    params: params
  })
}

export function getActualCargoHandoverDateLog(params) {
  return request({
    url: '/actualCargoHandoverDateLog/getActualCargoHandoverDateLog',
    method: 'get',
    params: params
  })
}

export function getCargoInboundAHodInfo(params) {
  return request({
    url: '/cargoInbound/getCargoInboundAHodInfo',
    method: 'get',
    params: params
  })
}

export function updateCargoInboundAHod(params) {
  return request({
    url: '/cargoInbound/updateCargoInboundAHod',
    method: 'post',
    data: params
  })
}

export function batchUpdateCargoInbound(params) {
  return request({
    url: '/cargoInbound/batchUpdateCargoInbound',
    method: 'post',
    data: params
  })
}

export function getAHodLogListByOrderId(params) {
  return request({
    url: '/actualCargoHandoverDateLog/getAHodLogListByOrderId',
    method: 'get',
    params: params
  })
}

export function getOrderItemList(id) {
  return request({
    url: '/order/v2/header/pepco/orderItemList?orderId=' + id,
    method: 'get'
  })
}

export function getHodsByOrderNumbers(params) {
  return request({
    url: '/cargoInbound/getHodsByOrderNumbers',
    method: 'post',
    data: params
  })
}

export function getOrderTypesByOrderNumbers(params) {
  return request({
    url: '/cargoInbound/getOrderTypesByOrderNumbers',
    method: 'post',
    data: params
  })
}

export function reactivateFromCancelPo(id) {
  return request({
    url: '/order/header/reactivateFromCancelPo?id=' + id,
    method: "get"
  })
}

export function batchUpdateGateIn(params) {
  return request({
    url: '/order/task/batchUpdateGateIn',
    method: 'post',
    data: params
  })
}

export function getOrdersTypeBySoRefs(params) {
  return request({
    url: '/shipping/order/getOrdersTypeBySoRefs',
    method: 'post',
    data: params
  })
}

export function withdrawContainerGateInMilestone(data) {
  return request({
    url: '/order/header/withdrawContainerGateInMilestone',
    method: 'post',
    params: data
  })
}

export function withdrawCargoInboundMilestone(data) {
  return request({
    url: '/order/header/withdrawCargoInboundMilestone',
    method: 'post',
    params: data
  })
}


export function rejectOrderHeader(params) {
  return request({
    url: '/order/header/pepco/reject',
    method: 'post',
    params: params
  })
}
