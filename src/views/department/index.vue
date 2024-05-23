<template>
  <div class="container">
    <div class="app-container">
      <el-tree :data="depts" :expand-on-click-node="false" default-expand-all :props="defaultProps">
        <template #default="{data}">
          <el-row type="flex" align="middle" style="width: 100%; height: 40px" justify="space-between">
            <el-col>
              {{ data.name }}
            </el-col>
            <el-col :span="4">
              <span class="manager">{{ data.managerName }}</span>
              <el-dropdown @command="operateDept(data.id, $event)">
                <span class="el-dropdown-link">
                  操作<i class="el-icon-arrow-down el-icon--right" />
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="add">添加部门</el-dropdown-item>
                  <el-dropdown-item command="edit">编辑部门</el-dropdown-item>
                  <el-dropdown-item command="del">删除</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-col>
          </el-row>
        </template>
      </el-tree>
    </div>
    <!-- 部门操作 -->
    <add-dept ref="addDept" :current-node-id="currentNodeId" :show-dialog.sync="showDialog" @getDepartment="getDepartment" />
  </div>
</template>
<script>
import { getDepartment } from '@/api/department'
import { translateListToTreeData } from '@/utils'
import addDept from './add-dept.vue'
export default {
  name: 'Department',
  components: {
    addDept
  },
  data() {
    return {
      depts: [
      ],
      defaultProps: {
        children: 'children', // 子节点的属性名
        label: 'name' // 标签节点的属性名
      },
      showDialog: false, // 控制弹层
      currentNodeId: null // 点击部门的id
    }
  },
  created() {
    this.getDepartment()
  },
  methods: {
    // 获取部门列表
    async getDepartment() {
      const result = await getDepartment()
      // console.log(result)
      // 0:pid 确定好谁是一级部门
      this.depts = translateListToTreeData(result, 0)
    },
    // 部门操作
    operateDept(id, type) {
      // console.log(id, type)
      // 记录id
      this.currentNodeId = id
      // 添加部门
      if (type === 'add') {
        // 显示弹层...
        this.showDialog = true
      } else if (type === 'edit') {
        // 编辑部门
        // 调用获取部门详情的method (子组件)
        // console.log(this.$refs.addDept)
        // 问题: 获取时机问题 -> prop更新是异步
        // $nextTick() 批量更新 -> 将update的操作放到了任务队列中
        this.$nextTick(() => {
          this.$refs.addDept.getDepartmentDetail()
          this.showDialog = true
        })
      }
    }
  }
}
</script>
<style scoped lang="scss">
  .app-container {
    padding: 30px 140px;
    font-size: 14px;
    .manager {
      width: 70px;
      margin-right: 10px;
      display: inline-block;
    }
  }
</style>
