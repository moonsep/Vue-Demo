import request from '@/utils/request'

// 查询教工离校列表
export function listSchoolout(query) {
  return request({
    url: '/bysj/schoolout/list',
    method: 'get',
    params: query
  })
}

// 查询教工离校详细
export function getSchoolout(id) {
  return request({
    url: '/bysj/schoolout/' + id,
    method: 'get'
  })
}

// 新增教工离校
export function addSchoolout(data) {
  return request({
    url: '/bysj/schoolout',
    method: 'post',
    data: data
  })
}

// 修改教工离校
export function updateSchoolout(data) {
  return request({
    url: '/bysj/schoolout',
    method: 'put',
    data: data
  })
}

// 删除教工离校
export function delSchoolout(id) {
  return request({
    url: '/bysj/schoolout/' + id,
    method: 'delete'
  })
}
