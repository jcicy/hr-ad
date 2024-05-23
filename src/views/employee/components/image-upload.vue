<template>
  <!--
    action        自动上传 - 上传地址
    http-request	覆盖默认的上传行为，可以自定义上传的实现
    before-upload 上传前的检查
   -->
  <el-upload
    class="avatar-uploader"
    action=""
    :show-file-list="false"
    :before-upload="beforeAvatarUpload"
    :http-request="uploadFile"
  >
    <img v-if="value" :src="value" class="avatar">
    <i v-else class="el-icon-plus avatar-uploader-icon" />
  </el-upload>
</template>

<script>
import COS from 'cos-js-sdk-v5'
export default {
  props: {
    value: { // 图片地址
      type: String,
      default: ''
    }
  },
  methods: {
    // 上传前的文件检查 - 文件类型 / 文件大小
    beforeAvatarUpload(file) {
      // png / jpeg / bmp
      const fileTypes = ['image/jpeg', 'image/png', 'image/bmp']
      const isJPG = fileTypes.includes(file.type)
      const isLt5M = file.size / 1024 / 1024 < 5

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt5M) {
        this.$message.error('上传头像图片大小不能超过 5MB!')
      }
      return isJPG && isLt5M
    },
    // 自定义上传
    uploadFile(params) {
      console.log(params)
      // 初始化cos实例
      const cos = new COS({
        SecretId: 'AKID9FB4L2wqvOao19D9yshZJUly1qXFo4Im',
        SecretKey: '6fQNaJwcOyUt9MVku5GWbZTJIhDrdhqL'
      })
      // 完成上传
      cos.putObject({
        Bucket: 'heimahr-113-1257341766', // 存储桶名称
        Region: 'ap-nanjing', // 存储桶地域
        Key: params.file.name, // 文件名称
        StorageClass: 'STANDARD', // 上传模式 - 标准
        Body: params.file // 文件对象
      }, (err, data) => {
        // err 错误对象
        // data 返回结果
        console.log(err, data)
        // http://www.baidu.com
        if (data.statusCode === 200 && data.Location) {
          this.$emit('input', 'http://' + data.Location)
        }
      })
    }
  }
}
</script>

<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
