import request from '@/utils/request'

// 查询业务用车列表
export function listbysjCarorder(query) {
  return request({
    url: '/bysj/bysjcarorder/list',
    method: 'get',
    params: query
  })
}


// 查询业务用车详细
export function getbysjCarorder(carorderId) {
  return request({
    url: '/bysj/bysjcarorder/' + carorderId,
    method: 'get'
  })
}

// 新增业务用车
export function addbysjCarorder(data) {
  return request({
    url: '/bysj/bysjcarorder',
    method: 'post',
    data: data
  })
}

// 修改业务用车
export function updatebysjCarorder(data) {
  return request({
    url: '/bysj/bysjcarorder',
    method: 'put',
    data: data
  })
}

// 删除业务用车
export function delbysjCarorder(carorderId) {
  return request({
    url: '/bysj/bysjcarorder/' + carorderId,
    method: 'delete'
  })
}
