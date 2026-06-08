import request from "@/utils/request";

export function getAirlineList(query) {
  return request({
    url: "/air/airline/list/all",
    method: "get",
    params: query,
  });
}


export function airlinePage(query) {
  return request({
    url: "/air/airline/list/page",
    method: "get",
    params: query,
  });
}

export function airlineDetail(id) {
  return request({
    url: "/air/airline/detail",
    method: "get",
    params: { airlineId: id },
  });
}

export function createAirline(data) {
  return request({
    url: "/air/airline/create",
    method: "post",
    data: data,
  });
}

export function updateAirline(data) {
  return request({
    url: "/air/airline/update",
    method: "put",
    data: data,
  });
}

export function removeAirline(id) {
  return request({
    url: "/air/airline/remove",
    method: "delete",
    params: { airlineId: id },
  });
}