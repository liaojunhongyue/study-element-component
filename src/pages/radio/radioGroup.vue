<template>
  <div>
    <el-radio-group v-model="groupValue">
      <el-radio label="1">选项1</el-radio>
      <el-radio label="2">选项2</el-radio>
    </el-radio-group>
    <el-radio-group v-model="groupValuea">
      <el-radio label="1">选项1</el-radio>
      <el-radio label="2">选项2</el-radio>
    </el-radio-group>
  </div>
</template>
<script>
export default {
  data() {
    return {
      groupValue: '1',
      groupValuea: ''
    }
  },
}
</script>