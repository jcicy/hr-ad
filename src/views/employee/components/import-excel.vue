<template>
  <el-dialog
    width="500px"
    title="员工导入"
    :visible="showExcelDialog"
    @close="$emit('update:showExcelDialog', false)"
  >
    <el-row type="flex" justify="center">
      <div class="upload-excel">
        <input
          ref="excel-upload-input"
          class="excel-upload-input"
          type="file"
          accept=".xlsx, .xls"
          @change="uploadFile"
        >
        <div class="drop">
          <i class="el-icon-upload" />
          <el-button type="text" @click="getImportExcel">下载导入模板</el-button>
          <span>将文件拖到此处或
            <el-button type="text" @click="uploadExcel">点击上传</el-button>
          </span>
        </div>
      </div>
    </el-row>
    <el-row type="flex" justify="end">
      <!-- update:props属性名，值 直接修改 .sync修饰符的属性值 -->
      <el-button size="mini" type="primary" @click="$emit('update:showExcelDialog', false)">取消</el-button>
    </el-row>
  </el-dialog>
</template>
<script>
import { getImportExcel, uploadFile } from '@/api/employee'
import FileSaver from 'file-saver'

export default {
  props: {
    showExcelDialog: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    async getImportExcel() {
      const result = await getImportExcel()
      FileSaver.saveAs(result, '员工默认导入模板.xlsx')
    },
    // input的change事件 - 监听上传文件的改变行为
    async uploadFile(e) {
      const files = e.target.files
      if (files.length === 0) return
      // 上传 - 获取到上传文件 - 格式 FormData()
      const data = new FormData()
      data.append('file', files[0])
      try {
        // 成功
        // 1. 调用接口
        await uploadFile(data)
        // 2. 提示用户
        this.$message.success('员工上传成功')
        // 3. 重新加载数据
        this.$emit('updateEmployee')
        // 4. 关闭弹层
        this.$emit('update:showExcelDialog', false)
        // 5. 清空内容
      } finally {
        // 无论成功or失败 - 都会执行  (清空内容)
        this.$refs['excel-upload-input'].value = ''
      }
    },
    uploadExcel() {
      // 模拟input的点击行为
      this.$refs['excel-upload-input'].click()
    }
  }
}
</script>

<style scoped lang="scss">
    .upload-excel {
      display: flex;
      justify-content: center;
      margin: 20px;
      width: 360px;
      height: 180px;
      align-items: center;
      color: #697086;
      .excel-upload-input {
        display: none;
        z-index: -9999;
      }
      .btn-upload,
      .drop {
        border: 1px dashed #dcdfe6;
        width: 100%;
        height: 100%;
        text-align: center;
        line-height: 160px;
        border-radius: 8px;
        display: flex;
        flex-direction: column;
        justify-content: center;
      }
      .drop {
        line-height: 40px;
        color: #bbb;
        i {
          font-size: 60px;
          display: block;
          color: #c0c4cc;
        }
      }
    }
</style>
