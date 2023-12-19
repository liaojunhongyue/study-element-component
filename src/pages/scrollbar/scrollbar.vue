<template>
    <div style="width: 400px;">
        <el-scrollbar
            :wrap-style="wrapStyle"
            :wrap-class="wrapClass"
            tag="section"
        >
            <div v-for="i in count" :key="i">测试{{ i }}</div>
        </el-scrollbar>
        <button @click="changeSize()">改变大小</button>
    </div>
</template>
<script>
export default {
    data() {
        return {
            count: 50,
            wrapStyle: "height: 200px;",
            wrapClass: ['classone', 'classtwo'] 
        }
    },
    mounted() {
        console.log('123')
    },
    methods: {
        changeSize() {
            this.count = 25
        }
    }
}
</script>