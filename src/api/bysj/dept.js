import request from '@/utils/request'

// 查询系部信息列表
export function listDept(query) {
  return request({
    url: '/bysj/dept/list',
    method: 'get',
    params: query
  })
}

// 查询系部信息详细
export function getDept(id) {
  return request({
    url: '/bysj/dept/' + id,
    method: 'get'
  })
}
// 查询系部所有信息详细
export function listDeptAll() {
  return request({
    url: '/bysj/dept/listAll',
    method: 'get'
  })
}

// 新增系部信息
export function addDept(data) {
  return request({
    url: '/bysj/dept',
    method: 'post',
    data: data
  })
}

// 修改系部信息
export function updateDept(data) {
  return request({
    url: '/bysj/dept',
    method: 'put',
    data: data
  })
}

// 删除系部信息
export function delDept(id) {
  return request({
    url: '/bysj/dept/' + id,
    method: 'delete'
  })
}
