<template>
  <div class="container">
    <div class="app-container">
      <div class="role-operate">
        <el-button type="primary" size="mini" @click="showDialog = true">添加角色</el-button>
      </div>
      <!-- 表格 -->
      <el-table :data="list">
        <el-table-column prop="name" align="center" width="200" label="角色">
          <template #default="{row}">
            <el-input v-if="row.isEdit" v-model="row.editRow.name" size="mini" />
            <span v-else>{{ row.name }}</span>
          </template>

        </el-table-column>
        <el-table-column prop="state" align="center" width="200" label="启用">
          <template #default="{row}">
            <el-switch v-if="row.isEdit" v-model="row.editRow.state" :active-value="1" :inactive-value="0" size="mini" />
            <span v-else>
              {{ row.state === 1 ? '已启用' : '不启用' }}
            </span>
          </template>

        </el-table-column>
        <el-table-column prop="description" align="center" label="描述">
          <template #default="{row}">
            <el-input v-if="row.isEdit" v-model="row.editRow.description" size="mini" type="textarea" />
            <span v-else>{{ row.description }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template #default="{row}">
            <!-- template 是一个默认你的标签. 不会进行渲染 - 逻辑的区分 (空标签) -->
            <template v-if="row.isEdit">
              <el-button size="mini" type="primary" @click="btnConfirm(row)">确定</el-button>
              <el-button size="mini" @click="row.isEdit = false">取消</el-button>
            </template>
            <template v-else>
              <el-button type="text" size="mini" @click="btnPermission(row.id)">分配权限</el-button>
              <el-button type="text" size="mini" @click="handleEdit(row)">编辑</el-button>
              <el-popconfirm
                title="这是一段内容确定删除吗？"
                @onConfirm="confirmDel(row)"
              >
                <!-- <el-button slot="reference" type="text" size="mini">删除</el-button> -->
                <template #reference>
                  <el-button style="margin-left: 10px;" type="text" size="mini">删除</el-button>
                </template>
              </el-popconfirm>
            </template>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-row type="flex" style="width: 100%;height: 40px" justify="end" align="middle">
        <el-pagination
          layout="prev, pager, next"
          :total="total"
          :current-page="params.page"
          :page-size="params.pagesize"
          @current-change="handleCurrentChange"
        />
      </el-row>
      <el-dialog width="500px" title="新增角色" :visible.sync="showDialog" @close="btnCancel">
        <!-- 表单内容 -->
        <el-form ref="roleForm" :model="roleForm" :rules="rules" label-width="120px">
          <el-form-item prop="name" label="角色名称">
            <el-input v-model="roleForm.name" style="width:300px" size="mini" />
          </el-form-item>
          <el-form-item label="启用">
            <!-- 如果不需要校验 就不需要写 prop属性 -->
            <el-switch v-model="roleForm.state" :active-value="1" :inactive-value="0" size="mini" />
          </el-form-item>
          <el-form-item prop="description" label="角色描述">
            <el-input v-model="roleForm.description" type="textarea" :rows="3" style="width:300px" size="mini" />
          </el-form-item>
          <el-form-item>
            <el-row type="flex" justify="center">
              <el-col :span="12">
                <el-button type="primary" size="mini" @click="btnOK">确定</el-button>
                <el-button size="mini" @click="btnCancel">取消</el-button>
              </el-col>
            </el-row>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
    <!-- 分配权限 -->
    <el-dialog :visible.sync="showPermissionDialog" title="分配权限">
      <el-tree
        ref="treeData"
        show-checkbox
        :data="permissionList"
        default-expand-all
        :props="{ label: 'name' }"
        check-strictly
        node-key="id"
        :default-checked-keys="permIds"
      />
      <template #footer>
        <el-row type="flex" justify="center">
          <el-button size="mini" type="primary" @click="btnPermissionOk">确定</el-button>
          <el-button size="mini">取消</el-button>
        </el-row>
      </template>
    </el-dialog>
  </div>
</template>
<script>
import { addRole, getRoleList, updateRole, getRoleDetail, assignPrem } from '@/api/role'
import { translateListToTreeData } from '@/utils'
import { getPermissionList } from '@/api/permission'
export default {
  name: 'Role',
  data() {
    return {
      list: [],
      params: {
        page: 1, // 页码
        pagesize: 10 // 每页条数
      },
      total: 0,
      showDialog: false,
      roleForm: {
        name: '',
        description: '',
        state: 0 // 默认未1启用 关闭 0 打开1
      },
      rules: {
        name: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }],
        description: [{ required: true, message: '角色描述不能为空', trigger: 'blur' }]
      },
      showPermissionDialog: false, // 分配权限弹层
      permissionList: [], // 权限列表
      currentRoleId: null, // 当前角色id
      permIds: [] // 角色的权限集合
    }
  },
  created() {
    this.getRoleList()
  },
  methods: {
    async btnPermission(id) {
      // 记录角色id
      this.currentRoleId = id
      // 根据id查询详情
      const { permIds } = await getRoleDetail(id)
      this.permIds = permIds

      // 获取权限数据
      this.permissionList = translateListToTreeData(await getPermissionList(), 0)
      // 显示弹层
      this.showPermissionDialog = true
    },
    async btnPermissionOk() {
      // console.log(this.$refs.treeData.getCheckedKeys())
      await assignPrem({
        id: this.currentRoleId,
        permIds: this.$refs.treeData.getCheckedKeys()
      })
      this.$message.success('权限分配成功')
      this.showPermissionDialog = false
    },
    async getRoleList() {
      const { rows, total } = await getRoleList(this.params)
      this.list = rows
      this.total = total
      // 1. 每一行中添加标记状态 isEdit (是否编辑)
      this.list.forEach(item => {
        // vue 数据驱动视图
        // 响应式: 数据变化, 视图会立即更新
        // isEdit false -> true / 视图没有更新
        // 问题: 动态添加的属性不具备响应式
        // item.isEdit = false
        // this.$set(对象, '属性', 属性的值)
        this.$set(item, 'editRow', {
          name: item.name,
          state: item.state,
          description: item.description
        })
        this.$set(item, 'isEdit', false)
      })
    },
    // 编辑行内状态
    handleEdit(row) {
      // 更新缓存数据 - 还原默认值
      row.editRow.name = row.name
      row.editRow.state = row.state
      row.editRow.description = row.description
      row.isEdit = true
    },
    // 确定编辑
    async btnConfirm(row) {
      // 1. 非空校验
      // 2. 调用更新接口
      // 3. 提示用户
      // 4. 更新显示数据
      // 5. 退出编辑状态
      if (row.editRow.name && row.editRow.description) {
        await updateRole({ ...row.editRow, id: row.id })
        this.$message.success('更新角色成功')
        // eslint误判
        // // eslint-disable-next-line require-atomic-updates
        // row.name = row.editRow.name
        // // eslint-disable-next-line require-atomic-updates
        // row.state = row.editRow.state
        // 将源对象source拷贝到目标对象身上
        // Object.assign(target, source)
        Object.assign(row, {
          ...row.editRow,
          isEdit: false
        }) // 规避eslint的误判
      } else {
        this.$message.warning('角色名称和描述不能为空')
      }
    },
    confirmDel(row) {
      console.log('删除的id', row)
    },
    handleCurrentChange(val) {
      // 1. 修改页码
      this.params.page = val
      // 2. 重新渲染
      this.getRoleList()
    },
    btnOK() {
      this.$refs.roleForm.validate(async isOK => {
        if (isOK) {
          await addRole(this.roleForm)
          this.$message.success('新增角色成功')
          this.getRoleList()
          this.btnCancel()
        }
      })
    },
    btnCancel() {
      this.$refs.roleForm.resetFields() // 重置表单数据
      this.showDialog = false // 关闭弹层
    }
  }
}
</script>
<style lang="scss" scoped>
  .role-operate {
    padding: 10px
  }
</style>
