const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.userInfo.staffPhoto,
  name: state => state.user.userInfo.username,
  company: state => state.user.userInfo.company, // 公司名称
  departmentName: state => state.user.userInfo.departmentName, // 所在部门
  userId: state => state.user.userInfo.userId,
  routes: state => state.user.routes,
  points: state => state.user.userInfo.roles?.points
}

export default getters
