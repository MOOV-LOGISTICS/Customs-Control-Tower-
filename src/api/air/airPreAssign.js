import request from "@/utils/request";

export function createAirPreAssign(data) {
  return request({
    url: '/air/air-transport-assign-leg/air-pre-assign/create',
    method: 'post',
    data: data
  })
}

export function getListAirPreAssign(query) {
  return request({
    url: "/air/air-transport-assign-leg/air-pre-assign/list",
    method: "get",
    params: query,
  });
}


