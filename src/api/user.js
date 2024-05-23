import request from '@/utils/request'

// 登录
export const login = (data) => request.post('/sys/login', data)
// 获取用户资料
export const getUserInfo = () => request.get('/sys/profile')
// 修改密码
export const updatePassword = (data) => request.put('/sys/user/updatePass', data)
