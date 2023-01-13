import request from '@/utils/request'

// 查询一周订餐列表
export function listFood(query) {
  return request({
    url: '/bysj/food/list',
    method: 'get',
    params: query
  })
}

// 查询一周订餐详细
export function getFood(foodId) {
  return request({
    url: '/bysj/food/' + foodId,
    method: 'get'
  })
}

// 新增一周订餐
export function addFood(data) {
  return request({
    url: '/bysj/food',
    method: 'post',
    data: data
  })
}

// 修改一周订餐
export function updateFood(data) {
  return request({
    url: '/bysj/food',
    method: 'put',
    data: data
  })
}

// 删除一周订餐
export function delFood(foodId) {
  return request({
    url: '/bysj/food/' + foodId,
    method: 'delete'
  })
}
