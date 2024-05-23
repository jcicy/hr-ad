<template>
  <div class="container">
    <div class="app-container">
      <div class="left">
        <el-input
          v-model="queryParams.keyword"
          style="margin-bottom:10px"
          type="text"
          prefix-icon="el-icon-search"
          size="small"
          placeholder="输入员工姓名全员搜索"
          @input="changeValue"
        />
        <!-- 树形组件 -->
        <el-tree ref="tree" node-key="id" :data="depts" highlight-current :expand-on-click-node="false" default-expand-all :props="defaultProps" @current-change="currentChange" />
      </div>
      <div class="right">
        <el-row class="opeate-tools" type="flex" justify="end">
          <el-button
            v-permission="employeePermission"
            size="mini"
            type="primary"
            @click="$router.push('/employee/detail')"
          >添加员工
          </el-button>
          <el-button size="mini" @click="showExcelDialog = true">excel导入</el-button>
          <el-button size="mini" @click="exportExcel">excel导出</el-button>
        </el-row>
        <!-- 表格组件 -->
        <el-table :data="list">
          <el-table-column prop="staffPhoto" align="center" label="头像">
            <template v-slot="{ row }">
              <el-avatar v-if="row.staffPhoto" :src="row.staffPhoto" :size="30" />
              <span v-else class="username">{{ row.username?.charAt(0) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="username" label="姓名" />
          <el-table-column prop="mobile" label="手机号" sortable />
          <el-table-column prop="workNumber" label="工号" sortable />
          <el-table-column prop="formOfEmployment" label="聘用形式">
            <template v-slot="{ row }">
              <span v-if="row.formOfEmployment === 1">正式</span>
              <span v-else-if="row.formOfEmployment === 2">非正式</span>
              <span v-else>无</span>
            </template>
          </el-table-column>
          <el-table-column prop="departmentName" label="部门" />
          <el-table-column prop="timeOfEntry" label="入职时间" sortable />
          <el-table-column label="操作" width="280px">
            <template #default="{row}">
              <el-button size="mini" type="text" @click="$router.push(`/employee/detail/${row.id}`)">查看</el-button>
              <el-button size="mini" type="text" @click="btnRole(row.id)">角色</el-button>
              <el-button size="mini" type="text">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-row style="height: 60px" align="middle" type="flex" justify="end">
          <el-pagination
            layout="total,prev, pager, next"
            :total="total"
            :current-page="queryParams.page"
            :page-size="queryParams.pagesize"
            @current-change="changePage"
          />
        </el-row>
      </div>
    </div>
    <!-- excel组件 -->
    <import-excel :show-excel-dialog.sync="showExcelDialog" @updateEmployee="getEmployeeList" />
    <!-- 分配角色弹出层 -->
    <el-dialog title="分配角色" :visible.sync="showRoleDialog">
      <el-checkbox-group v-model="roleIds">
        <el-checkbox
          v-for="item in roleList"
          :key="item.id"
          :label="item.id"
        >{{ item.name }}</el-checkbox>
      </el-checkbox-group>
      <template #footer>
        <el-row type="flex" justify="center">
          <el-button size="mini" type="primary" @click="btnRoleOk">确定</el-button>
          <el-button size="mini" @click="showRoleDialog = false">取消</el-button>
        </el-row>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { getDepartment } from '@/api/department'
import { exportExcel, getEmployeeList, getEnabledRoleList, getEmployeeDetail, assignRoles } from '@/api/employee'
import { translateListToTreeData } from '@/utils'
import FileSaver from 'file-saver'
import ImportExcel from './components/import-excel.vue'
export default {
  name: 'Employee',
  components: {
    ImportExcel
  },
  data() {
    return {
      employeePermission: 'add-employee',
      depts: [], // 部门树形列表
      defaultProps: {
        label: 'name', // 部门名称
        children: 'children'
      },
      queryParams: {
        page: 1, // 当前页数
        pagesize: 10, // 每页条数
        keyword: '', // 搜索关键词
        departmentId: null // 查询部门id
      },
      list: [],
      total: 0, // 记录员工的总数
      showExcelDialog: false, // excel弹层
      showRoleDialog: false, // 分配角色弹层
      roleIds: [], // 已选中的角色列表
      roleList: [], // 可用的角色列表
      currentUserId: null
    }
  },
  created() {
    this.getDepartment()
  },
  methods: {
    // 获取员工角色
    async btnRole(id) {
      // 展示所有可用的角色列表
      this.roleList = await getEnabledRoleList()
      // 显示当前用户拥有的角色列表
      this.currentUserId = id
      const { roleIds } = await getEmployeeDetail(id)
      this.roleIds = roleIds
      this.showRoleDialog = true
    },
    // 分配角色
    async btnRoleOk() {
      await assignRoles({
        roleIds: this.roleIds,
        id: this.currentUserId
      })
      this.$message.success('分配角色成功')
      this.showRoleDialog = false
    },
    async getDepartment() {
      const result = await getDepartment()
      this.depts = translateListToTreeData(result, 0)
      // console.log(this.depts)
      // 初始化获取首个节点 - 根节点 (根部门)
      this.queryParams.departmentId = this.depts[0].id
      // 设置选中节点 - 高亮
      // 树形组件的渲染是异步的, 必须等到数据渲染成功, 在进行选中节点的设置
      this.$nextTick(() => {
        this.$refs.tree.setCurrentKey(this.queryParams.departmentId)
        this.getEmployeeList()
      })
    },
    // 获取员工列表的方法
    async getEmployeeList() {
      const { rows, total } = await getEmployeeList(this.queryParams)
      this.list = rows
      this.total = total
    },
    // 当前节点被切换
    currentChange(node) {
      this.queryParams.departmentId = node.id
      this.queryParams.page = 1 // 设置第一页
      this.getEmployeeList()
    },
    changePage(newPage) {
      this.queryParams.page = newPage // 赋值新页码
      this.getEmployeeList(this.queryParams) // 查询数据
    },
    changeValue() {
      // 单位时间内只执行最后一次
      // this的实例上赋值了一个timer的属性
      clearTimeout(this.timer) // 清理上一次的定时器
      this.timer = setTimeout(() => {
        this.queryParams.page = 1
        this.getEmployeeList()
      }, 300)
    },
    // excel导出
    async exportExcel() {
      const result = await exportExcel()
      console.log(result)
      FileSaver.saveAs(result, '员工表.xlsx')
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  background: #fff;
  display: flex;
  .left {
    width: 280px;
    padding: 20px;
    border-right: 1px solid #eaeef4;
  }
  .right {
    flex: 1;
    padding: 20px;
    .opeate-tools {
      margin:10px ;
    }
    .username {
      height: 30px;
      width: 30px;
      line-height: 30px;
      text-align: center;
      border-radius: 50%;
      color: #fff;
      background: #04C9BE;
      font-size: 12px;
      display:inline-block;
    }
  }
}

</style>
