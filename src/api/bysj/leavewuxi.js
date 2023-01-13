import request from '@/utils/request'

// 查询离锡报批列表
export function listLeavewuxi(query) {
  return request({
    url: '/bysj/leavewuxi/list',
    method: 'get',
    params: query
  })
}

// 查询离锡报批详细
export function getLeavewuxi(id) {
  return request({
    url: '/bysj/leavewuxi/' + id,
    method: 'get'
  })
}

// 新增离锡报批
export function addLeavewuxi(data) {
  return request({
    url: '/bysj/leavewuxi',
    method: 'post',
    data: data
  })
}

// 修改离锡报批
export function updateLeavewuxi(data) {
  return request({
    url: '/bysj/leavewuxi',
    method: 'put',
    data: data
  })
}

// 删除离锡报批
export function delLeavewuxi(id) {
  return request({
    url: '/bysj/leavewuxi/' + id,
    method: 'delete'
  })
}
