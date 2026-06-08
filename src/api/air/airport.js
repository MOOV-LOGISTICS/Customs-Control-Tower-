import request from "@/utils/request";

export function getAirportList(query) {
  return request({
    url: "/air/airport/list/all",
    method: "get",
    params: query,
  });
}

export function airportPage(query) {
  return request({
    url: "/air/airport/list/page",
    method: "get",
    params: query,
  });
}

export function createAirport(data) {
  return request({
    url: "/air/airport/create",
    method: "post",
    data: data,
  });
}

export function updateAirport(data) {
  return request({
    url: "/air/airport/update",
    method: "put",
    data: data,
  });
}

export function removeAirport(id) {
  return request({
    url: "/air/airport/remove",
    method: "delete",
    params: { airportId: id },
  });
}