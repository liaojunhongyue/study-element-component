<template>
  <div>
    <el-radio-group v-model="radio">
      <el-radio-button label="1">选项1</el-radio-button>
      <el-radio-button label="2">选项2</el-radio-button>
      <el-radio-button label="3">选项3</el-radio-button>
      <el-radio-button label="4">选项4</el-radio-button>
    </el-radio-group>
  </div>
</template>
<script>
export default {
  data() {
    return {
      radio: '1'
    }
  }
}
</script>