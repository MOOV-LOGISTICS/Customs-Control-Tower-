import request from '@/utils/request'

export function getDestinationContainerPage(query) {
  return request({
    url: '/pepco/destination/container/page',
    method: 'get',
    params: query
  })
}

export function exportDestinationContainer(query) {
  return request({
    url: '/pepco/destination/container/export',
    method: 'get',
    params: query,
    responseType: 'blob',
    timeout: '1200000'
  })
}

export function getDestinationContainerDetail(id) {
  return request({
    url: '/pepco/destination/container/detail?destinationContainerId=' + id,
    method: 'get'
  })
}

export function getDestinationMileStoneByContainerNo(number) {
  return request({
    url: '/pepco/destination/milestone/list-by-containerNo?containerNo=' + number,
    method: 'get'
  })
}

export function getDestinationMilestone(query) {
  return request({
    url: '/pepco/destination/milestone/list-by-container',
    method: 'get',
    params: query
  })
}

export function getDestinationContainerOverviewStatistics(query) {
  return request({
    url: '/pepco/destination/container/overview-statistics',
    method: 'get',
    params: query
  })
}

export function getDestinationContainerQueryFilter() {
  return request({
    url: '/pepco/destination/container/query-filter',
    method: 'get'
  })
}

export function getDestinationContainerQueryDateFilter() {
  return request({
    url: '/pepco/destination/container/query-date-filter',
    method: 'get'
  })
}

export function importDeliveryPlan() {
  return request({
    url: '/pepco/destination/import-delivery-plan',
    method: 'get',
    responseType: 'blob'
  })
}
// 导出
export function exportContainerDeliveryPlan(query) {
  return request({
    url: '/pepco/destination/download-delivery-plan',
    method: 'get',
    params: query,
    responseType: 'blob',
    timeout: '1200000'
  })
}

export function exportContainerDeliveryPrePlan(query) {
  return request({
    url: '/pepco/destination/download-delivery-pre-plan',
    method: 'get',
    params: query,
    responseType: 'blob',
    timeout: '1200000'
  })
}

export function exportArrivalAtDC(query) {
  return request({
    url: '/pepco/destination/download-arrival-at-dc',
    method: 'get',
    params: query,
    responseType: 'blob',
    timeout: '1200000'
  })
}

export function exportContainerBroker(query) {
  return request({
    url: '/pepco/destination/container/download-broker-template',
    method: 'get',
    params: query,
    responseType: 'blob',
    timeout: '1200000'
  })
}

export function getDestinationDeliveryPlan(query) {
  return request({
    url: '/pepco/destination/delivery-plan',
    method: 'get',
    params: query
  })
}

export function getDestinationDeliveryPlanList(query) {
  return request({
    url: '/pepco/destination/delivery-plan/all',
    method: 'get',
    params: query
  })
}

// create destination delivery plan
export function createDestinationDeliveryPlan(data) {
  return request({
    url: '/pepco/destination/delivery-plan/create',
    method: 'post',
    data: data
  })
}

// update destination delivery plan
export function updateDestinationDeliveryPlan(data) {
  return request({
    url: '/pepco/destination/delivery-plan/update',
    method: 'put',
    data: data
  })
}

export function updateContainerNo(data) {
  return request({
    url: '/pepco/destination/updateContainerNo/related-update',
    method: 'put',
    params: data
  })
}

// delete destination delivery plan
export function deleteDestinationDeliveryPlan(id) {
  return request({
    url: '/pepco/destination/delivery-plan/delete?deliveryPlanId=' + id,
    method: 'delete'
  })
}

export function getDictData(dictType) {
  return request({
    url: '/pepco/destination/dict/data?dictType=' + dictType,
    method: 'get',
  })
}

export function getDestinationUnplannedReasonList() {
  return request({
    url: '/pepco/destination/container/plan/dict/unplanned/reason',
    method: 'get',
  })
}

export function updateDestinationContainerPlanStatus(data) {
  return request({
    url: '/pepco/destination/container/plan/status',
    method: 'post',
    data: data
  })
}

export function handleMilestone(data) {
  return request({
    url: '/pepco/destination/milestone/handle',
    method: 'post',
    data: data
  })
}

export function getMilestonesEnumListByType(type) {
  return request({
    url: '/pepco/destination/milestone/enum/list-by-type?type=' + type,
    method: 'get'
  })
}

export function getMilestonesEnumListByTypeAndRole(type) {
  return request({
    url: '/pepco/destination/milestone/enum/list-by-type-and-role?type=' + type,
    method: 'get'
  })
}

export function getListArrivalDcByContainerIds(containerIds) {
  return request({
    url: '/pepco/destination/milestone/list-arrival-dc-by-containerIds',
    method: 'get',
    params: {
      containerIds: containerIds.join(',') // 将数组转为逗号分隔字符串
    }
  })
}

export function getDestinationShippingPage(query) {
  return request({
    url: '/pepco/destination/shipping/page',
    method: 'get',
    params: query
  })
}


export function getDestinationShippingDetail(query) {
  return request({
    url: '/pepco/destination/shipping/detail',
    method: 'get',
    params: query
  })
}

export function getDestinationShippingCount(query) {
  return request({
    url: '/pepco/destination/shipping/count',
    method: 'get',
    params: query
  })
}

export function verifyDestinationShipping(data) {
  return request({
    url: '/pepco/destination/shipping/verify',
    method: 'post',
    data: data
  })
}


// 下载PO数据
export function downloadShippingOrderData(query) {
  return request({
    url: '/pepco/destination/shipping/download',
    method: 'get',
    responseType: 'blob',
    params: query
  })
}


export function getBrokerList(query) {
  return request({
    url: '/pepco/destination/shipping/brokers',
    method: 'get',
    params: query
  })
}

export function submitBroker(data) {
  return request({
    url: '/pepco/destination/shipping/submit-broker',
    method: 'post',
    data: data
  })
}

export function containerSubmitBroker(data) {
  return request({
    url: '/pepco/destination/container/submit-broker',
    method: 'post',
    data: data
  })
}

export function getDestinationTraceLog(query) {
  return request({
    url: '/pepco/destination/shipping/trace-log',
    method: 'get',
    params: query
  })
}

export function submitDate(data) {
  return request({
    url: '/pepco/destination/shipping/submit-date',
    method: 'post',
    data: data
  })
}


export function getPageFilterData(query) {
  return request({
    url: '/pepco/destination/shipping/filter-date',
    method: 'get',
    params: query
  })
}


export function getBrokerDataList(query) {
  return request({
    url: '/pepco/destination/shipping/broker-list',
    method: 'get',
    params: query
  })
}


export function getDestinationOverview(query) {
  return request({
    url: '/pepco/destination/milestone/overview',
    method: 'get',
    params: query
  })
}

export function getDestinationDcList(data) {
  return request({
    url: '/pepco/destination/shipping/dc/list',
    method: 'get',
    params: data
  })
}

export function verifyDestinationShippingFinish(data) {
  return request({
    url: '/pepco/destination/shipping/finish-verify',
    method: 'post',
    data: data
  })
}

export function verifyDestinationContainerFinish(data) {
  return request({
    url: '/pepco/destination/container/finish-verify',
    method: 'post',
    data: data
  })
}

// 导出
export function exportShippingBrokerTemplate(query) {
  return request({
    url: '/pepco/destination/download-broker-template',
    method: 'get',
    params: query,
    responseType: 'blob',
    timeout: '1200000'
  })
}

export function exportContainerInvoiceTemplate(query) {
  return request({
    url: '/pepco/destination/download-invoice-template',
    method: 'get',
    params: query,
    responseType: 'blob',
    timeout: '1200000'
  })
}

export function revokeBroker(data) {
  return request({
    url: '/pepco/destination/shipping/revoke-broker',
    method: 'post',
    data: data
  })
}

export function containerRevokeBroker(data) {
  return request({
    url: '/pepco/destination/container/revoke-broker',
    method: 'post',
    data: data
  })
}

//

export function getDestinationShippingQueryFilter() {
  return request({
    url: '/pepco/destination/shipping/query-filter',
    method: 'get'
  })
}

export function getAllBrokerList() {
  return request({
    url: '/pepco/destination/shipping/list',
    method: 'get'
  })
}

export function revokeVerify(data) {
  return request({
    url: '/pepco/destination/shipping/revoke-verify',
    method: 'post',
    data: data
  })
}

export function getShippingOverviewStatistics(query) {
  return request({
    url: '/pepco/destination/shipping/overview-statistics',
    method: 'get',
    params: query
  })
}

export function repairData(data) {
  return request({
    url: '/pepco/destination/milestone/test/repair-data',
    method: 'post',
    params: data
  })
}
export function syncBatch(data) {
  return request({
    url: '/pepco/destination/milestone/test/sync-batch',
    method: 'post',
    params: data
  })
}
export function repairContainer(data) {
  return request({
    url: '/pepco/destination/milestone/test/repair-container',
    method: 'post',
    params: data
  })
}

export function syncContainerBatch(data) {
  return request({
    url: '/pepco/destination/milestone/test/container/sync/batch',
    method: 'post',
    params: data
  })
}

export function fixTeu(data) {
  return request({
    url: '/pepco/destination/milestone/test/fix-teu',
    method: 'post',
    params: data
  })
}

export function generateDataByShipmentId(data) {
  return request({
    url: '/pepco/destination/milestone/test/start',
    method: 'post',
    params: data
  })
}

export function generateData(data) {
  return request({
    url: '/pepco/destination/milestone/test/start2',
    method: 'post',
    params: data
  })
}

export function getCarriers() {
  return request({
    url: '/pepco/destination/shipping/getCarriers',
    method: 'get'
  })
}


export function getMblTypeListByField() {
  return request({
    url: '/pepco/destination/shipping/getMblTypeListByField',
    method: 'get'
  })
}

export function getHblTypeListByField() {
  return request({
    url: '/pepco/destination/shipping/getHblTypeListByField',
    method: 'get'
  })
}

export function getCarrierList() {
  return request({
    url: '/pepco/destination/container/carrier/list',
    method: 'get'
  })
}

export function getContractTypeList() {
  return request({
    url: '/pepco/destination/container/contract-type/list',
    method: 'get'
  })
}


export function getDestinationHblPage(query) {
  return request({
    url: '/pepco/destination/hbl/page',
    method: 'get',
    params: query
  })
}

export function getDestinationHblCount() {
  return request({
    url: '/pepco/destination/hbl/total-count',
    method: 'get'
  })
}

export function destinationHblDocumentsTab(id) {
  return request({
    url: '/pepco/destination/hbl/tab/documents?destinationHblId=' + id,
    method: 'get'
  })
}

export function destinationHblDocumentsVerifiedTab(id) {
  return request({
    url: '/pepco/destination/hbl/tab/documentVerified?destinationHblId=' + id,
    method: 'get'
  })
}

export function destinationHblLogTab(id) {
  return request({
    url: '/pepco/destination/hbl/tab/log?destinationHblId=' + id,
    method: 'get'
  })
}

export function destinationHbCarrierbookingTab(id) {
  return request({
    url: '/pepco/destination/hbl/tab/carrier-booking?destinationHblId=' + id,
    method: 'get'
  })
}

export function destinationHblPosInHblTab(id) {
  return request({
    url: '/pepco/destination/hbl/tab/pos-in-hbl?destinationHblId=' + id,
    method: 'get'
  })
}

export function destinationHblContainerHblTab(id) {
  return request({
    url: '/pepco/destination/hbl/tab/container-hbl?destinationHblId=' + id,
    method: 'get'
  })
}

export function destinationHblContainerLpTab(id) {
  return request({
    url: '/pepco/destination/hbl/tab/container-lp?destinationHblId=' + id,
    method: 'get'
  })
}


export function verifyDocumentsOverviewStatistics(query) {
  return request({
    url: '/pepco/destination/hbl/overview-statistics/verify-documents',
    method: 'get',
    params: query
  })
}

export function verifyDestinationHbl(data) {
  return request({
    url: '/pepco/destination/hbl/verify',
    method: 'post',
    data: data
  })
}

export function revokeHblVerify(data) {
  return request({
    url: '/pepco/destination/hbl/revoke-verify',
    method: 'post',
    data: data
  })
}

// 下载PO数据
export function downloadShipmentHblData(query) {
  return request({
    url: '/pepco/destination/hbl/download',
    method: 'get',
    responseType: 'blob',
    timeout: '1800000',
    params: query
  })
}

/**
 * 创建 HBL 异步导出任务
 */
export function createHblExportTask(query) {
  return request({
    url: '/pepco/destination/hbl/export/create',
    method: 'post',
    data: query
  })
}

/**
 * 轮询导出进度
 */
export function getHblExportProgress(params) {
  return request({
    url: '/pepco/destination/hbl/export/progress',
    method: 'get',
    params
  })
}

/**
 * 获取文件下载地址（filePath）
 */
export function getHblExportFile(params) {
  return request({
    url: '/pepco/destination/hbl/export/download',
    method: 'get',
    params
  })
}

export function destinationHblPolList() {
  return request({
    url: '/pepco/destination/hbl/pol-list',
    method: 'get'
  })
}

export function destinationHblPodList() {
  return request({
    url: '/pepco/destination/hbl/pod-list',
    method: 'get'
  })
}

export function destinationHblDcList() {
  return request({
    url: '/pepco/destination/hbl/dc-list',
    method: 'get'
  })
}

export function destinationHblVesselList() {
  return request({
    url: '/pepco/destination/hbl/vessel-list',
    method: 'get'
  })
}

export function destinationHblVoyageList() {
  return request({
    url: '/pepco/destination/hbl/voyage-list',
    method: 'get'
  })
}

export function destinationHblCarrierList() {
  return request({
    url: '/pepco/destination/hbl/carrier-list',
    method: 'get'
  })
}

export function destinationHblSupplierList() {
  return request({
    url: '/pepco/destination/hbl/supplier-list',
    method: 'get'
  })
}

export function destinationHblCountryList() {
  return request({
    url: '/pepco/destination/hbl/country-list',
    method: 'get'
  })
}

export function destinationHblBrokerList() {
  return request({
    url: '/pepco/destination/hbl/broker-list',
    method: 'get'
  })
}

export function destinationHblTypeList() {
  return request({
    url: '/pepco/destination/hbl/hbl-type-list',
    method: 'get'
  })
}

export function updateEta(data) {
  return request({
    url: '/pepco/destination/hbl/update-eta',
    method: 'post',
    data: data
  })
}

export function updateAta(data) {
  return request({
    url: '/pepco/destination/hbl/update-ata',
    method: 'post',
    data: data
  })
}

export function doDataFix(data) {
  return request({
    url: '/pepco/destination/hbl/destination/data-fix',
    method: 'post',
    data: data
  })
}

export function getAllCountry() {
  return request({
    url: '/shipment/api/getAllCountry',
    method: 'get'
  })
}

export function updateContainerInfo(data) {
  return request({
    url: '/pepco/destination/container/update-container',
    method: 'post',
    data: data
  })
}


export function destinationSystemPodList() {
  return request({
    url: '/pepco/destination/container/pod/list',
    method: 'get'
  })
}

export function destinationSystemVesselList() {
  return request({
    url: '/pepco/destination/container/vessel/list',
    method: 'get'
  })
}

export function destContainerOrderItemList(destContainerId) {
  return request({
    url: '/pepco/destination/container/order-info?destContainerId=' + destContainerId,
    method: 'get'
  })
}


export function updateContainerDocsReady(data) {
  return request({
    url: '/pepco/destination/container/docs-ready',
    method: 'put',
    data
  })
}

export function getDocsReadyStatusDetail(data) {
  return request({
    url: '/pepco/destination/container/getDocsReadyStatusDetail',
    method: 'post',
    data
  })
}


export function getDestinationDcListAll(query) {
  return request({
    url: '/pepco/destination/data/dc/list/all',
    method: 'get',
    params: query
  })
}

/**
 * 获取容器下所有 HBL 的 Sanitary Required 详情
 */
export function getHblSanitaryDetail(containerNo) {
  return request({
    url: '/pepco/destination/container/sanitary-detail',
    method: 'get',
    params: { containerNo }
  })
}
