import request from '@/utils/request'

// 查询住宿列表
export function listOvernight(query) {
  return request({
    url: '/bysj/overnight/list',
    method: 'get',
    params: query
  })
}

// 查询住宿详细
export function getOvernight(id) {
  return request({
    url: '/bysj/overnight/' + id,
    method: 'get'
  })
}

// 新增住宿
export function addOvernight(data) {
  return request({
    url: '/bysj/overnight',
    method: 'post',
    data: data
  })
}

// 修改住宿
export function updateOvernight(data) {
  return request({
    url: '/bysj/overnight',
    method: 'put',
    data: data
  })
}

// 删除住宿
export function delOvernight(id) {
  return request({
    url: '/bysj/overnight/' + id,
    method: 'delete'
  })
}


// 查询住宿列表
export function upLoadImg(data) {
  return request({
    url: '/common/upload',
    method: 'post',
    data: data
  })
}
