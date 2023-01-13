import request from '@/utils/request'

// 查询公务接待列表
export function listOfficial(query) {
  return request({
    url: '/bysj/official/list',
    method: 'get',
    params: query
  })
}

// 查询公务接待详细
export function getOfficial(id) {
  return request({
    url: '/bysj/official/' + id,
    method: 'get'
  })
}

// 新增公务接待
export function addOfficial(data) {
  return request({
    url: '/bysj/official',
    method: 'post',
    data: data
  })
}

// 修改公务接待
export function updateOfficial(data) {
  return request({
    url: '/bysj/official',
    method: 'put',
    data: data
  })
}

// 删除公务接待
export function delOfficial(id) {
  return request({
    url: '/bysj/official/' + id,
    method: 'delete'
  })
}
