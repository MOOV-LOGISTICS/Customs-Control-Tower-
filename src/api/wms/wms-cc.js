import request from '@/utils/request'

export function inventoryPage(query) {
    return request({
        url: '/warehouse/cc/inventory/list/page',
        method: 'get',
        params: query
    })
}

export function syncInventory(query) {
    return request({
        url: '/warehouse/cc/inventory/sync',
        method: 'post'
    })
}

export function exportinventory() {
    return request({
        url: '/warehouse/cc/inventory/export',
        method: 'get',
        responseType: 'blob'
    })
}

export function itemBomPage(query) {
    return request({
        url: '/warehouse/cc/item-bom/list/page',
        method: 'get',
        params: query
    })
}

export function itemBomSubList(query) {
    return request({
        url: '/warehouse/cc/item-bom/list/sub',
        method: 'get',
        params: query
    })
}
export function itemBomTree(query) {
    return request({
        url: '/warehouse/cc/item-bom/list/tree',
        method: 'get',
        params: query
    })
}
export function itemBomTreeWithInventory(query) {
    return request({
        url: '/warehouse/cc/item-bom/list/tree-with-inventory',
        method: 'post',
        data: query
    })
}

export function exportBomTemplate() {
    return request({
        url: '/warehouse/cc/item-bom/template/bom',
        method: 'get',
        responseType: 'blob'
    })
}
export function exportBomSearchTemplate() {
    return request({
        url: '/warehouse/cc/item-bom/template/bom-search',
        method: 'get',
        responseType: 'blob'
    })
}