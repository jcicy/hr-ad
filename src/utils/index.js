// 将列表型数据 --> 树形数据

// 递归
// 特点 1. 函数内部自己调用自己 / 2. 必须得有出口 - 结束条件
// list 列表型数据
export const translateListToTreeData = (list, rootValue) => {
  const arr = []
  // console.log(list)
  list.forEach(item => {
    // console.log(item)
    if (item.pid === rootValue) {
      // 找子部门 / 子节点的过程 -> 添加
      const children = translateListToTreeData(list, item.id)
      if (children.length) item.children = children
      arr.push(item)
    }
  })
  return arr // 转换好的树形数据
}

