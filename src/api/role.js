import request from '@/utils/request'
// 角色列表
export const getRoleList = (params) => request.get('/sys/role', {
  params
})
// 添加角色
export const addRole = (data) => request.post('/sys/role', data)

// 更新角色
export const updateRole = (data) => request.put(`/sys/role/${data.id}`, data)

// 获取角色详情
export const getRoleDetail = (id) => request.get(`/sys/role/${id}`)

// 分配权限
export const assignPrem = (data) => request.put('/sys/role/assignPrem', data)
