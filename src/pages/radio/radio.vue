<template>
  <div>
    <el-radio v-model="radio" label="1">选项1</el-radio>
    <el-radio v-model="radio" label="2">选项2</el-radio>
    <el-radio v-model="radio" label="3" border>选项3</el-radio>
  </div>
</template>
<script>
export default {
  data() {
    return {
      radio: "1"
    }
  }
}
</script>