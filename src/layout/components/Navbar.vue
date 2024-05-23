<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <img v-if="avatar" :src="avatar" class="user-avatar">
          <!-- <span v-else class="username">{{ name && name.charAt(0) }}</span> -->
          <span v-else class="username">{{ name?.charAt(0) }}</span>
          <span class="name">{{ name }}</span>
          <i class="el-icon-setting" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link to="/">
            <el-dropdown-item>
              首页
            </el-dropdown-item>
          </router-link>
          <a target="_blank" href="https://github.com/PanJiaChen/vue-admin-template/">
            <el-dropdown-item>项目地址</el-dropdown-item>
          </a>
          <!--
            stop 阻止冒泡
            prevent 阻止标签的默认行为

           -->
          <a target="_blank" href="https://panjiachen.github.io/vue-element-admin-site/#/" @click.prevent="updatePassword">
            <el-dropdown-item>修改密码</el-dropdown-item>
          </a>
          <!-- element-ui 组件 @click.native 给组件的根元素注册事件 -->
          <el-dropdown-item divided @click.native="logout">
            <span style="display:block;">退出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <!-- dialog -->
    <el-dialog append-to-body title="修改密码" :visible.sync="showDialog" width="500px" @close="btnCancel">
      <el-form ref="passwordForm" :model="passwordForm" :rules="passwordRules" label-width="120px">
        <el-form-item prop="oldPassword" label="原密码">
          <el-input v-model="passwordForm.oldPassword" type="password" size="mini" />
        </el-form-item>
        <el-form-item prop="newPassword" label="新密码">
          <el-input v-model="passwordForm.newPassword" type="password" size="mini" />
        </el-form-item>
        <el-form-item prop="confirmPassword" label="重复密码">
          <el-input v-model="passwordForm.confirmPassword" type="password" size="mini" />
        </el-form-item>
        <el-form-item>
          <el-button size="mini" type="primary" @click="btnOk">确认修改</el-button>
          <el-button size="mini" @click="btnCancel">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import { updatePassword } from '@/api/user'
export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  data() {
    return {
      showDialog: false,
      // 表单数据
      passwordForm: {
        oldPassword: '', // 旧
        newPassword: '', // 新
        confirmPassword: '' // 重复
      },
      // 校验规则
      // 规则:
      // 1. 新密码不能和原密码一致
      // 2. 重复密码必须和新密码一致
      passwordRules: {
        oldPassword: [
          { required: true, message: '请输入原密码', trigger: 'blur' },
          { min: 6, max: 15, message: '密码长度不符合规则', trigger: 'blur' }
        ],
        newPassword: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { min: 6, max: 15, message: '密码长度不符合规则', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (value === this.passwordForm.oldPassword) {
                callback(new Error('新密码不能和原密码一致'))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          }
        ],
        confirmPassword: [
          { required: true, message: '请输入重复密码', trigger: 'blur' },
          { min: 6, max: 15, message: '密码长度不符合规则', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (value === this.passwordForm.newPassword) {
                callback()
              } else {
                callback(new Error('重复密码与新密码不一致'))
              }
            },
            trigger: 'blur'
          }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar', // 头像
      'name' // 昵称
    ])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push('/login')
    },
    updatePassword() {
      this.showDialog = true
    },
    btnOk() {
      this.$refs.passwordForm.validate(async valid => {
        if (!valid) return
        console.log('发送请求了')
        await updatePassword(this.passwordForm)
        this.$message.success('密码修改成功')
        this.btnCancel()
      })
    },
    btnCancel() {
      // 重置表单
      this.$refs.passwordForm.resetFields()
      // 关闭弹层
      this.showDialog = false
    }

  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;
        display: flex;
        align-items: center;

        .user-avatar {
          cursor: pointer;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          margin-right: 5px;
        }
        .username {
          width: 30px;
          height: 30px;
          text-align: center;
          line-height: 30px;
          border-radius: 50%;
          color: #fff;
          background-color: #04c9be;
          margin-right: 5px;
        }
        .name {
          font-size: 16px;
          margin-right: 10px;
        }
        .el-icon-setting {
          cursor: pointer;
          // position: absolute;
          // right: -20px;
          // top: 25px;
          font-size: 20px;
        }
      }
    }
  }
}
</style>
