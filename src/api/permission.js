import request from '@/utils/request'
// 获取权限点列表
export const getPermissionList = () => request.get('/sys/permission')
