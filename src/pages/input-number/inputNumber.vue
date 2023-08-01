<template>
  <div>
    <el-input-number ref="input" v-model="val" :precision="1" :min="0" :max="5"></el-input-number>
    <!-- <button @click="changeStrictly()">点击</button> -->
  </div>
</template>
<script>
export default {
  data() {
    return {
      isStrictly: false,
      val: -1.45,
    }
  },
  mounted() {
    this.$refs.input.focus();
  },
  methods: {
    changeStrictly() {
      this.isStrictly = true;
    }
  }
}
</script>