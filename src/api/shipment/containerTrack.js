import request from '@/utils/request'

// 创建shipment_container_overtime
export function createContainerTrack(data) {
  return request({
    url: '/shipment/container-track/create',
    method: 'post',
    data: data
  })
}

// 更新shipment_container_overtime
export function updateContainerTrack(data) {
  return request({
    url: '/shipment/container-track/update',
    method: 'put',
    data: data
  })
}

// 删除shipment_container_overtime
export function deleteContainerTrack(id) {
  return request({
    url: '/shipment/container-track/delete?id=' + id,
    method: 'delete'
  })
}

// 获得shipment_container_overtime
export function getContainerTrack(id) {
  return request({
    url: '/shipment/container-track/get?id=' + id,
    method: 'get'
  })
}

// 获得shipment_container_overtime分页
export function getContainerTrackPage(query) {
  return request({
    url: '/shipment/container-track/page',
    method: 'get',
    params: query
  })
}

// 导出shipment_container_overtime Excel
export function exportContainerTrackExcel(query) {
  return request({
    url: '/shipment/container-track/export-excel',
    method: 'get',
    params: query,
    responseType: 'blob'
  })

}

  export function getContainerVesselAndYoyageOptions(query) {
    return request({
      url: '/shipment/container-track/getContainerVesselAndYoyageOptions',
      method: 'get',
      params: query
    })
  }

  export function trackReport(query) {
    return request({
      url: '/shipment/container-track/trackReport',
      method: 'get',
      params: query
    })
  }
  