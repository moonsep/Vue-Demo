import request from '@/utils/request'

// 查询用餐列表
export function listMeals(query) {
  return request({
    url: '/bysj/meals/list',
    method: 'get',
    params: query
  })
}

// 查询用餐详细
export function getMeals(id) {
  return request({
    url: '/bysj/meals/' + id,
    method: 'get'
  })
}

// 新增用餐
export function addMeals(data) {
  return request({
    url: '/bysj/meals',
    method: 'post',
    data: data
  })
}

// 修改用餐
export function updateMeals(data) {
  return request({
    url: '/bysj/meals',
    method: 'put',
    data: data
  })
}

// 删除用餐
export function delMeals(id) {
  return request({
    url: '/bysj/meals/' + id,
    method: 'delete'
  })
}
