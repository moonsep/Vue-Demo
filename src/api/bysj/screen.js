import request from '@/utils/request'

// 查询电子屏、横幅、展板申请列表
export function listScreen(query) {
  return request({
    url: '/bysj/screen/list',
    method: 'get',
    params: query
  })
}

// 查询电子屏、横幅、展板申请详细
export function getScreen(screenId) {
  return request({
    url: '/bysj/screen/' + screenId,
    method: 'get'
  })
}

// 新增电子屏、横幅、展板申请
export function addScreen(data) {
  return request({
    url: '/bysj/screen',
    method: 'post',
    data: data
  })
}

// 修改电子屏、横幅、展板申请
export function updateScreen(data) {
  return request({
    url: '/bysj/screen',
    method: 'put',
    data: data
  })
}

// 删除电子屏、横幅、展板申请
export function delScreen(screenId) {
  return request({
    url: '/bysj/screen/' + screenId,
    method: 'delete'
  })
}
