<template>
  <el-checkbox-group v-model="checkList" size="mini">
    <el-checkbox :label="1" border>备选项1</el-checkbox>
    <el-checkbox :label="2" border>备选项2</el-checkbox>
    <el-checkbox :label="3" border>备选项3</el-checkbox>
  </el-checkbox-group>
</template>
<script>
export default {
  data() {
    return {
      checkList: [1]
    }
  },
}
</script>