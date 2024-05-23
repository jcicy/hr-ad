import request from '@/utils/request'

/**
 * 获取首页数据
 *
*/
export const getHomeData = () => request({
  url: '/home/data'
})

export const getMessageList = () => request({
  url: '/home/notice'
})
