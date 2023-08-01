<template>
  <div>
    <el-form
      ref="form"
      :model="form"
      label-position="left"
      :rules="rules"
      label-width="auto"
      @validate="handleValidate"
      :status-icon="true"
    >
      <el-form-item label="活动名称" prop="name" v-if="isShow" ref="fieldname" :inline-message="true">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="类型" prop="type">
        <el-checkbox-group v-model="form.type">
          <el-checkbox label="1" name="type">美食/餐厅线上活动</el-checkbox>
          <el-checkbox label="2" name="type">地推活动</el-checkbox>
          <el-checkbox label="3" name="type">线下主题活动</el-checkbox>
          <el-checkbox label="4" name="type">单纯品牌曝光</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="特殊资源" prop="resource" v-if="isShow">
        <el-radio-group v-model="form.resource">
          <el-radio label="1">线上品牌商赞助</el-radio>
          <el-radio label="2">线下场地免费</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="活动数量" prop="amount" v-if="isShow">
        <el-input-number v-model="form.amount">
        </el-input-number>
      </el-form-item>
    </el-form>
    <button @click="reset()">重置</button>
    <button @click="isShow = false">删除</button>
    <button @click="valid()">验证</button>
    <button @click="changeRules()">改变验证规则</button>
  </div>
</template>
<script>
export default {
  data() {
    return {
      form: {
        name: '',
        type: [],
        resource: '',
        amount: 1,
      },
      error: '123',
      rules: {
        name: [
          { required: true, message: '请输入活动名称', trigger: 'change' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择类型' }
        ],
        resource: [
          { required: true, message: '请选择特殊资源' }
        ],
        amount: [
          { required: true, message: '请输入活动数量' }
        ]
      },
      isShow: true
    }
  },
  methods: {
    reset() {
      this.$refs.form.resetFields();
    },
    valid() {
      this.$refs.form.validate((err) => {
        console.log(err)
      })
    },
    handleValidate(a, b, c) {
      console.log(a)
      console.log(b)
      console.log(c)
    },
    changeRules() {
      console.log(this.$set)
      this.$set(this.rules, 'test', []);
      this.$delete(this.rules, 'amount');
      console.log(this.rules)
    }
  }
}
</script>