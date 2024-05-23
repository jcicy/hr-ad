<template>
  <div class="container">
    <div class="app-container">
      <el-button class="btn-add" size="mini" type="primary">添加权限</el-button>
      <el-table :data="list" row-key="id" default-expand-all>
        <el-table-column prop="name" label="名称" />
        <el-table-column prop="code" label="标识" />
        <el-table-column prop="description" label="描述" />
        <el-table-column label="操作">
          <template #default="{row}">
            <!-- type: 1 一级权限 - 页面访问权限 / type: 2 二级权限 - 按钮操作权限 -->
            <el-button v-if="row.type=== 1" size="mini" type="text">添加</el-button>
            <el-button size="mini" type="text">编辑</el-button>
            <el-button size="mini" type="text">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import { getPermissionList } from '@/api/permission'
import { translateListToTreeData } from '@/utils'
export default {
  name: 'Permission',
  data() {
    return {
      list: [] // 权限点列表
    }
  },
  created() {
    this.getPermissionList()
  },
  methods: {
    async getPermissionList() {
      this.list = translateListToTreeData(await getPermissionList(), 0)
    }
  }
}
</script>
<style>
.btn-add {
  margin: 10px;
}
</style>
