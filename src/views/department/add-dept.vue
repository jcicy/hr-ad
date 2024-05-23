<template>
  <el-dialog :title="title" :visible="showDialog" @close="close">
    <el-form ref="addDept" :model="formData" :rules="rules" label-width="120px">
      <el-form-item prop="name" label="部门名称">
        <el-input v-model="formData.name" placeholder="2-10个字符" style="width: 80%" size="mini" />
      </el-form-item>
      <el-form-item prop="code" label="部门编码">
        <el-input v-model="formData.code" placeholder="2-10个字符" style="width: 80%" size="mini" />
      </el-form-item>
      <el-form-item prop="managerId" label="部门负责人">
        <el-select v-model="formData.managerId" placeholder="请选择负责人" style="width: 80%" size="mini">
          <!--
            label 展示
            value 存储
           -->
          <el-option v-for="item in managerList" :key="item.id" :label="item.username" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item prop="introduce" label="部门介绍">
        <el-input v-model="formData.introduce" placeholder="1-100个字符" type="textarea" size="mini" :rows="4" style="width: 80%" />
      </el-form-item>
      <el-form-item>
        <!-- 按钮 -->
        <el-row type="flex" justify="center">
          <el-col :span="12">
            <el-button size="mini" type="primary" @click="confirm">确定</el-button>
            <el-button size="mini" @click="close">取消</el-button>
          </el-col>
        </el-row>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import { getDepartment, getManagerList, addDepartment, getDepartmentDetail, updateDepartment } from '@/api/department'
export default {
  // props的数据更新是异步的
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    currentNodeId: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      formData: {
        code: '', // 部门编码
        introduce: '', // 部门介绍
        managerId: '', // 部门负责人id
        name: '', // 部门名称
        pid: '' // 父级部门的id
      },
      rules: {
        // 部门名称
        name: [
          { required: true, message: '部门名称不能为空', trigger: 'blur' },
          {
            min: 2,
            max: 10,
            message: '部门名称的长度为2-10个字符',
            trigger: 'blur'
          },
          {
            validator: async(rule, value, callback) => {
              let depts = await getDepartment()
              // 1. 判断新增or编辑
              if (this.formData.id) {
                // 编辑
                // 将该部门从数组中过滤出去
                depts = depts.filter(item => item.name !== value)
                console.log('过滤后的depts', depts)
              }

              if (depts.some(item => item.name === value)) {
                callback(new Error('部门名称不能重复'))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          }
        ],
        // 部门编码
        code: [
          { required: true, message: '部门编码不能为空', trigger: 'blur' },
          {
            min: 2,
            max: 10,
            message: '部门编码的长度为2-10个字符',
            trigger: 'blur'
          },
          {
            validator: async(rule, value, callback) => {
              let depts = await getDepartment()
              if (this.formData.id) {
                depts = depts.filter(item => item.code !== value)
              }
              if (depts.some(item => item.code === value)) {
                callback(new Error('部门编码不能重复'))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          }
        ],
        // 部门负责人id
        managerId: [
          { required: true, message: '部门负责人不能为空', trigger: 'blur' }
        ],
        // 部门介绍
        introduce: [
          { required: true, message: '部门介绍不能为空', trigger: 'blur' },
          {
            min: 1,
            max: 100,
            message: '部门介绍的长度为1-100个字符',
            trigger: 'blur'
          }
        ]
        // pid: '' // 父级部门的id 不需要做校验
      },
      managerList: []
    }
  },
  computed: {
    title() {
      return this.formData.id ? '编辑部门' : '新增部门'
    }
  },
  created() {
    this.getManagerList()
  },
  methods: {
    async getManagerList() {
      const res = await getManagerList()
      this.managerList = res
    },
    async close() {
      await this.$refs.addDept.resetFields()
      // 将表单重置
      this.formData = {
        code: '', // 部门编码
        introduce: '', // 部门介绍
        managerId: '', // 部门负责人id
        name: '', // 部门名称
        pid: '' // 父级部门的id
      }
      this.$emit('update:showDialog', false)
    },
    // 获取部门详情
    async getDepartmentDetail() {
      // 1. 调用封装的api
      const result = await getDepartmentDetail(this.currentNodeId)
      // 2. 表单数据的赋值
      this.formData = result
    },
    confirm() {
      this.$refs.addDept.validate(async valid => {
        console.log(valid)
        if (!valid) return
        if (this.formData.id) {
          // 编辑
          await updateDepartment(this.formData)
          this.$message.success('修改部门成功')
        } else {
          // 新增
          // 发送请求
          await addDepartment({ ...this.formData, pid: this.currentNodeId })
          // 提示用户
          this.$message.success('添加部门成功')
        }
        // 通知父组件更新
        this.$emit('getDepartment')
        // 重置表单&关闭弹层
        this.close()
      })
    }
  }
}
</script>

<style>
</style>
