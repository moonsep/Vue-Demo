import request from '@/utils/request'

// 查询教工入校列表
export function listSchoolin(query) {
  return request({
    url: '/bysj/schoolin/list',
    method: 'get',
    params: query
  })
}

// 查询教工入校详细
export function getSchoolin(id) {
  return request({
    url: '/bysj/schoolin/' + id,
    method: 'get'
  })
}

// 新增教工入校
export function addSchoolin(data) {
  return request({
    url: '/bysj/schoolin',
    method: 'post',
    data: data
  })
}

// 修改教工入校
export function updateSchoolin(data) {
  return request({
    url: '/bysj/schoolin',
    method: 'put',
    data: data
  })
}

// 删除教工入校
export function delSchoolin(id) {
  return request({
    url: '/bysj/schoolin/' + id,
    method: 'delete'
  })
}
