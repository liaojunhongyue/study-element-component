<template>
  <div>
    <el-checkbox
      v-model="isChecked"
      :indeterminate="isIndeterminate"
    >备选项</el-checkbox>
  </div>
</template>
<script>
export default {
  data() {
    return {
      isChecked: false,
      isIndeterminate: true
    }
  },
}
</script>
