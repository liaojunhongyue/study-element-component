<template>
  <div>
    <el-input
      style="width: 200px;"
      autosize
      :type="type"
      v-model="val"
    >
    </el-input>
  </div>
</template>
<script>
export default {
  data() {
    return {
      type: 'textarea',
      val: ''
    }
  },
  methods: {
    handleChange(val) {
      console.log(val);
    },
  }
}
</script>