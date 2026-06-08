import request from '@/utils/request'

// 创建shipment
export function create(data) {
  return request({
    url: '/shipment/api/create',
    method: 'post',
    data: data
  })
}


export function downloadVGM(query) {
  return request({
    url: '/shipment/api/downloadVGM',
    method: 'get',
    params: query,
    responseType: 'blob'
  })
}

export function downloadContainersTemplate(query) {
  return request({
    url: '/shipment/api/downloadContainersTemplate',
    method: 'get',
    params: query,
    responseType: 'blob'
  })
}

// SI/VGM Submit container 模版下载
export function downloadSupplierContainersTemplate(query) {
  return request({
    url: '/shipment/api/downloadSupplierContainersTemplate',
    method: 'get',
    params: query,
    responseType: 'blob'
  })
}

export function downloadManifestTemplate(query) {
  return request({
    url: '/shipment/api/downloadManifestTemplate',
    method: 'get',
    params: query,
    responseType: 'blob'
  })
}

export function downloadSinotransContainersTemplate(query) {
  return request({
    url: '/shipment/container/downloadContainersTemplate',
    method: 'get',
    params: query,
    responseType: 'blob'
  })
}
export function downloadShipperSinotransContainersTemplate(query) {
  return request({
    url: '/shipment/container/downloadShipperContainersTemplate',
    method: 'get',
    params: query,
    responseType: 'blob'
  })
}


// export function exportShippedExcel(query) {
//   return request({
//     url: '/shipment/api/export/shipped/containers?ids='+query,
//     method: 'get',
//     data: query,
//     responseType: 'blob'
//   })
// }
export function exportShippedExcel(data) {
  return request({
    url: '/shipment/api/export/shipped/containers',
    method: 'post',
    data: data,
    responseType: 'blob',
    timeout: '1200000'
  })
}




export function sendToCarrier(data) {
  return request({
    url: '/shipment/api/sendToCarrier?id=' + data.id,
    method: 'put'
  })
}


export function findTmffHBL(query) {
  return request({
    url: '/v1/tmff/hbl/findTmffData?shipmentId=' + query,
    method: 'get'
  })
}


export function findTmffHBL2(query) {
  return request({
    url: '/v1/tmff/hbl/findTmffData2?shipmentId=' + query,
    method: 'get'
  })
}
//提交tmff前 校验有没有提交过
export function createTmffHBL(data) {
  return request({
    url: '/v1/tmff/hbl/create-and-verify-integration-log',
    method: 'post',
    data: data,
    timeout: '1600000'
  })
}

export function createHBL(data) {

  return request({
    url: '/v1/tmff/create',
    method: 'post',
    params: data,
    timeout: '1200000'
  })

}
export function getTmffList(query) {
  return request({
    url: '/v1/tmff/job_list',
    method: 'get',
    params: query
  })
}

export function shipmentStatus(query) {
  return request({
    url: '/shipment/api/detail',
    method: 'get',
    params: query
  })
}

export function getGenerateReadyDataPage(query) {
  return request({
    url: '/shipment/api/getGenerateReadyData/Page',
    method: 'get',
    params: query
  })
}


export function updateShipmentStatus(query) {
  return request({
    url: '/shipment/api/update/Generate/ShipmentStatus',
    method: 'get',
    params: query
  })
}

export function doCheckedOption(query) {
  return request({
    url: '/shipment/api/update/Check/ShipmentStatus',
    method: 'get',
    params: query
  })
}

export function getFilterListForGenerate(query) {
  return request({
    url: '/shipment/api/getFilterListForGenerate',
    method: 'get',
    params: query
  })
}

export function exportGenerateReadyData(query) {
  return request({
    url: '/shipment/api/exportGenerateReadyData',
    method: 'get',
    params: query,
    responseType: 'blob',
    timeout: '1200000'
  })
}

export function getTMFFLogRes(query) {
  return request({
    url: '/v1/tmff/getTMFFLogRes',
    method: 'get',
    params: query
  })
}

export function getCraNumList(craNum) {
  return request({
    url: '/shipment/cra/num?craNum=' + craNum,
    method: 'get'
  })
}
export function getCraNumsList() {
  return request({
    url: '/shipment/cra/nums',
    method: 'get'
  })
}
export function deleteCra(id) {
  return request({
    url: '/shipment/cra/delete?id=' + id,
    method: 'delete'
  })
}
export function updateStatus(query) {
  return request({
    url: '/shipment/api/update_status',
    method: 'put',
    params: query
  })
}
export function trackVessel(query) {
  return request({
    url: '/v1/track/iframe',
    method: 'get',
    params: query
  })
}
export function subscribe(query) {
  return request({
    url: '/v1/track/subscribe',
    method: 'post',
    params: query
  })
}
export function getCraPage(query) {
  return request({
    url: '/shipment/cra/page',
    method: 'get',
    params: query
  })
}

export function si(data) {
  return request({
    url: '/shipment/api/si',
    method: 'post',
    data: data
  })
}

export function addOrUpdate(data) {
  return request({
    url: '/shipment/api/addOrUpdate',
    method: 'put',
    data: data
  })
}

export function vgm(data) {
  return request({
    url: '/shipment/api/vgm',
    method: 'post',
    data: data
  })
}

export function submitSISinotrans(data) {
  return request({
    url: '/shipment/api/submitSISinotrans',
    method: 'post',
    data: data
  })
}


export function submitSinotransVGMAPI(data) {
  return request({
    url: '/shipment/api/submitSinotransVGM',
    method: 'post',
    data: data
  })
}

export function submitManifest(data) {
  return request({
    url: '/shipment/api/submitManifest',
    method: 'post',
    data: data
  })
}
export function submitProductNonContainer(data) {
  return request({
    url: '/shipment/api/submitProductNonContainer',
    method: 'post',
    data: data
  })
}

// 更新shipment
export function update(data) {
  return request({
    url: '/shipment/api/update',
    method: 'put',
    data: data
  })
}

// 删除shipment
export function deleteById(id) {
  return request({
    url: '/shipment/api/delete?id=' + id,
    method: 'delete'
  })
}

// 获得shipment
export function get(id) {
  return request({
    url: '/shipment/api/get?id=' + id,
    method: 'get'
  })
}

// 获得shipment分页
export function getPage(query) {
  return request({
    url: '/shipment/api/page',
    method: 'get',
    params: query
  })
}

export function getList(query) {
  return request({
    url: '/shipment/api/list',
    method: 'get',
    params: query
  })
}

export function groupByPort(query) {
  return request({
    url: '/shipment/api/groupByPort',
    method: 'get',
    params: query
  })
}


// 导出shipment Excel
export function exportExcel(query) {
  return request({
    url: '/shipment/api/export-excel',
    method: 'get',
    params: query,
    responseType: 'blob'
  })
}

// 查询船期表
export function findShippingScheduleList(query) {
  return request({
    url: '/shipment/api/schedulePage',
    method: 'get',
    params: query
  })
}

export function getThirdPartyRes(query) {
  return request({
    url: '/shipment/api/getThirdPartyRes',
    method: 'get',
    params: query
  })
}

export function scheduleDetails(query) {
  return request({
    url: '/shipment/api/scheduleDetails',
    method: 'get',
    params: query
  })
}


//查询船期表里面的所有港口
export function findShippingSchedulePortList() {
  return request({
    url: '/shipment/api/schedulePortList',
    method: 'get'
  })
}

//查询下拉框数据
export function findDropDownList() {
  return request({
    url: '/shipment/api/findDropDownList',
    method: 'get'
  })
}
//查询下拉框数据
export function findDropDownListFromCt() {
  return request({
    url: '/shipment/api/findDropDownListFromCt',
    method: 'get'
  })
}
export function cancelShipment(data) {
  return request({
    url: '/shipment/api/cancelShipment',
    method: 'post',
    data: data
  })
}

export function updateShipmentCancelSubCode(data) {
  return request({
    url: '/shipment/api/updateShipmentCancelSubCode',
    method: 'post',
    data: data
  })
}

export function updateBlNumber(data) {
  return request({
    url: '/shipment/api/updateBlNumber',
    method: 'put',
    data: data
  })
}
export function updateFollower(data) {
  return request({
    url: '/shipment/api/updateFollower',
    method: 'put',
    data: data
  })
}
export function addRemovePO(data) {
  return request({
    url: '/shipment/api/addRemovePO',
    method: 'put',
    data: data
  })
}
export function addRemoveSo(data) {
  return request({
    url: '/shipment/api/addRemoveSo',
    method: 'put',
    data: data
  })
}

export function submitBooking(data) {
  return request({
    url: '/shipment/api/submitBooking?shipmentId=' + data.shipmentId,
    method: 'put'
  })
}

export function shipmentDetails(id) {
  return request({
    url: '/shipment/api/getShipmentDetails?id=' + id,
    method: 'get'
  })
}

export function exportShipmentDetails(data) {
  return request({
    url: '/shipment/api/exportShipmentDetails',
    method: 'post',
    data: data,
    responseType: 'blob',
    timeout: '1200000'
  })
}

export function trackByBookingNumber(query) {
  return request({
    url: '/shipment/api/trackByBookingNumber',
    method: 'get',
    params: query
  })
}

export function listByConditionShipment(query) {
  return request({
    url: '/shipment/api/listByCondition',
    method: 'get',
    params: query
  })
}


export function countShipment(query) {
  return request({
    url: '/shipment/api/count',
    method: 'get',
    params: query
  })
}

export function updateShipment(data) {
  return request({
    url: '/shipment/api/updateShipment',
    method: 'post',
    data: data
  })
}

/**
 * tailwind类型的船更新接口
 * @param data
 * @returns {*}
 */
export function updateTailwindShipment(data) {
  return request({
    url: '/shipment/api/updateTailwindShipment',
    method: 'post',
    data: data
  })
}

export function submitVmtJson(data) {
  return request({
    url: '/shipment/api/submitVmtJson',
    method: 'post',
    data: data
  })
}


export function getShipmentFiles(id) {
  return request({
    url: '/shipment/api/getShipmentFiles?id=' + id,
    method: 'get'
  })
}

export function getTSHGSchedule(query) {
  return request({
    url: '/shipment/api/getTSHGSchedule',
    method: 'get',
    params: query
  })
}

export function getShipLogList(query) {
  return request({
    url: '/shipment/ship-log/listByShipmentIds',
    method: 'get',
    params: query
  })
}

export function activateShipment(id) {
  return request({
    url: '/shipment/api/activateShipment?id=' + id,
    method: 'get'
  })
}

export function getVmtApiLogPage(query) {
  return request({
    url: '/shipment/vmt-api-log/page',
    method: 'get',
    params: query
  })
}


export function findBookingNumberList(query) {
  return request({
    url: '/shipment/api/findBookingNumberList?shipmentBookingNumber=' + query,
    method: 'get'
  })
}
export function saveCargo(id) {
  return request({
    url: '/shipment/api/saveCargo?id=' + id,
    method: 'post'
  })
}

export function checkCarrierAndBookingNumSame(id, carrier, bookingNum) {
  return request({
    url: '/shipment/api/checkCarrierAndBookingNumSame?id=' + id + '&carrier=' + carrier + '&bookingNum=' + bookingNum,
    method: 'get'
  })
}
export function shipLogCreate(data) {
  return request({
    url: '/shipment/ship-log/create',
    method: 'post',
    data: data
  })
}

export function shipLogDelete(shipLogId) {
  return request({
    url: '/shipment/ship-log/delete',
    method: 'delete',
    params: { id: shipLogId }
  })
}

export function draftSI(data) {
  return request({
    url: '/shipment/api/draftSI',
    method: 'post',
    data: data
  })
}

export function siVGMDraft(data) {
  return request({
    url: '/shipment/api/siVGMDraft',
    method: 'post',
    data: data
  })
}

export function draftVGM(data) {
  return request({
    url: '/shipment/api/draftVGM',
    method: 'post',
    data: data
  })
}

export function shipmentReport(query) {
  return request({
    url: '/shipment/api/shipmentReport',
    method: 'get',
    params: query
  })
}

export function updateDocumentFile(data) {
  return request({
    url: '/shipment/api/updateDocumentFile',
    method: 'post',
    data: data
  })
}
export function sendDocumentEmail(data) {
  return request({
    url: '/shipment/api/sendDocumentEmail',
    method: 'post',
    data: data
  })
}
// 导出shipment Excel
export function exportShipmentExcel(query) {
  return request({
    url: '/shipment/api/exportShipmentExcel',
    method: 'get',
    params: query,
    responseType: 'blob'
  })
}

// 获得booking order shipment分页
export function shipperPage(query) {
  return request({
    url: '/shipment/api/shipperPage',
    method: 'get',
    params: query
  })
}


export function exportCraTemplate(query) {
  return request({
    url: '/shipment/cra/downloadCraTemplate',
    method: 'get',
    params: query,
    responseType: 'blob'
  })
}


export function getTenantPorts() {
  return request({
    url: '/shipment/api/getTenantPorts',
    method: 'get'
  })
}

export function getPushSinotransRecordListByBookingNumber(query) {
  return request({
    url: '/shipment/sinotrans/listByBookingNumber',
    method: 'get',
    params: query
  })
}

export function getPushQingdaoRecordListByBookingNumber(query) {
  return request({
    url: '/shipment/sinotrans/listQingdaoByBookingNumber',
    method: 'get',
    params: query
  })
}


export function getFeedbackInformationFromNingbo(query) {
  return request({
    url: '/shipment/sinotrans/getFeedbackInformationFromNingbo',
    method: 'get',
    params: query
  })
}

export function exportShippingInstruction(query) {
  return request({
    url: '/shipment/api/download/instructions',
    method: 'get',
    params: query,
    responseType: 'blob'
  })
}

export function exportShipmentICS2F15(query) {
  return request({
    url: '/shipment/api/download/ics2-f15',
    method: 'get',
    params: query,
    responseType: 'blob'
  })
}

export function findShipmentOrderById(query, orderId) {
  return request({
    url: '/shipment/api/findShipmentOrderById?id=' + query + '&orderId=' + orderId,
    method: 'get'
  })
}

export function getPoTaskStatusByShipmentId(query) {
  return request({
    url: '/shipment/api/pepco/poTaskStatusByShipmentId?shipmentId=' + query,
    method: 'get'
  })
}

export function listDept(query) {
  return request({
    url: '/shipment/api/dept/list',
    method: 'get',
    params: query
  })
}

export function isAlreadyCreate(shippingIds) {
  return request({
    url: '/shipment/api/pepco/already-create',
    method: 'post',
    data: shippingIds
  })
}



export function getPoMilestonsStatusByShipmentId(query) {
  return request({
    url: '/shipment/api/pepco/po-milestones-task-status?shipmentId=' + query,
    method: 'get'
  })
}

export function getPoHblImportStatusByOrderHeaderId(query) {
  return request({
    url: '/shipment/api/pepco/po-hbl-status?orderHeaderId=' + query,
    method: 'get'
  })
}
export function updateShipmentBookedDate(data) {
  return request({
    url: '/shipment/api/pepco/updateBookedDate',
    method: 'post',
    data: data
  })
}

//根据shipmentId查询换船信息
export function getChangeVesselInfo(query) {
  return request({
    url: '/shipment/api/getChangeVesselInfo',
    method: 'get',
    params: query
  })
}

//根据shipmentId查询换SI/VGM Submit to Carrier完成状态
export function checkShippingSIStatus(params) {
  return request({
    url: '/order/task/checkShippingSIStatus',
    method: 'get',
    params: params
  })
}
