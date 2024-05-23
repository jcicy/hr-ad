import Vue from 'vue'
import store from '@/store'
// 全局自定义指令
Vue.directive('permission', {
  // 指令所绑定的元素被插入到页面中 - 触发该函数
  inserted(el, binding) {
    // el 指令所绑定的元素
    // binding.value 指令的值
    // console.log(el)
    // console.log(binding.value)
    // 可选链运算符 ? 优势: 获取深层次对象属性时, 可以避免报错
    // const points = store.state.user.userInfo.roles?.points || []
    const points = store.getters.points || []
    // console.log(points)
    if (!points.includes(binding.value)) {
      // 移除
      el.remove()
      // 禁用
      // el.disabled = true
    }
  }
})
