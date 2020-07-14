<template>
    <div>
       <el-button type="primary" @click="exitLogin">退出</el-button>
    </div>
</template>

<script>
export default {
    methods:{
        exitLogin(){
            window.sessionStorage.clear()
            this.$router.push('/login')
        }
    }
}
</script>

<style lang="less" scoped>

</style>