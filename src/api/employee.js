import request from '@/utils/request'
export const getEmployeeList = (params) => request.get('/sys/user', { params })

// excel导出
export const exportExcel = () => request.get('/sys/user/export', {
  responseType: 'blob' // 指定返回数据的类型 - 二进制流blob
})

// excel模板下载
export const getImportExcel = () => request.get('/sys/user/import/template', {
  responseType: 'blob'
})

// 上传excel
export const uploadFile = (data) => request.post('/sys/user/import', data)

// 获取员工信息
export const getEmployeeDetail = (id) => request.get(`/sys/user/${id}`)

export const addEmployee = (data) => {
  return request.post('/sys/user', data)
}

// 更新员工信息
export const updateEmployee = (data) => {
  return request.put(`/sys/user/${data.id}`, data)
}

// 获取已启用的角色列表
export const getEnabledRoleList = () => request.get('/sys/role/list/enabled')

// 分配员工的角色
export const assignRoles = (data) => request.put('/sys/user/assignRoles', data)
