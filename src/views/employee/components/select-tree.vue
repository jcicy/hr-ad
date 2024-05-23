<template>
  <el-cascader
    size="mini"
    :value="value"
    :props="props"
    :options="depts"
    separator="-"
    @change="changeValue"
  />
</template>

<script>
import { getDepartment } from '@/api/department'
import { translateListToTreeData } from '@/utils'
export default {
  props: {
    value: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      depts: [],
      props: {
        label: 'name', // 标签名称
        value: 'id' // 存储 - 部门的id
      }
    }
  },
  created() {
    this.getDepartment()
  },
  methods: {
    async getDepartment() {
      const result = await getDepartment()
      this.depts = translateListToTreeData(result, 0)
    },
    changeValue(list) {
      if (list.length) {
        this.$emit('input', list[list.length - 1])
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .select-tree {
    width: 300px;
  }
</style>
