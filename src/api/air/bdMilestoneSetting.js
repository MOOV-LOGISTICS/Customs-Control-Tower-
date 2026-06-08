import request from "@/utils/request";

export function airMilestoneSettingAll(query) {
  return request({
    url: "/air/milestone/setting/list/all",
    method: "get",
    params: query,
  });
}


export function airMilestoneSettingPage(query) {
  return request({
    url: "/air/milestone/setting/list/page",
    method: "get",
    params: query,
  });
}

export function airMilestoneSettingDetail(id) {
  return request({
    url: "/air/milestone/setting/detail",
    method: "get",
    params: { airMilestoneSettingId: id },
  });
}

export function createAirMilestoneSetting(data) {
  return request({
    url: "/air/milestone/setting/create",
    method: "post",
    data: data,
  });
}

export function updateAirMilestoneSetting(data) {
  return request({
    url: "/air/milestone/setting/update",
    method: "put",
    data: data,
  });
}

export function removeAirMilestoneSetting(id) {
  return request({
    url: "/air/milestone/setting/remove",
    method: "delete",
    params: { airMilestoneSettingId: id },
  });
}