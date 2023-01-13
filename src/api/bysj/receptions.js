import request from '@/utils/request'

// 查询公务接待列表
export function listReceptions(query) {
  return request({
    url: '/bysj/receptions/list',
    method: 'get',
    params: query
  })
}

// 查询公务接待详细
export function getReceptions(id) {
  return request({
    url: '/bysj/receptions/' + id,
    method: 'get'
  })
}

// 新增公务接待
export function addReceptions(data) {
  return request({
    url: '/bysj/receptions',
    method: 'post',
    data: data
  })
}

// 修改公务接待
export function updateReceptions(data) {
  return request({
    url: '/bysj/receptions',
    method: 'put',
    data: data
  })
}

// 删除公务接待
export function delReceptions(id) {
  return request({
    url: '/bysj/receptions/' + id,
    method: 'delete'
  })
}
