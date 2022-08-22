<template>
<div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>消息管理平台</el-breadcrumb-item>
        <el-breadcrumb-item>邮箱账户</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="bagBox">
        <div class="mailBox">
            <div class="boxT">
                <div class="text">邮箱:</div>
                <input type="text" name="" id="" placeholder="请输入邮箱">
            </div>
            <div class="boxT">
                <div class="text">授权码:</div>
                <input type="text" name="" id="" placeholder="请输入授权码">
            </div>
            <div class="boxT">
                <div class="text">验证码:</div>

                <input type="text" name="" id="" placeholder="请输入验证码">

                <div class="but" @click="checkS">
                    发送
                </div>
            </div>
        </div>
    </div>
</div>
    
</template>

<script>
export default {
    methods: {
        checkS() {
            this.$store.commit('SET_SHOW');
            alert('切换邮箱成功')
        }
    }
}
</script>

<style scoped>
.bagBox {
    width: 100%;
    height: 100%;
    display: flex;
}

.mailBox {
    width: 480px;
    height: 260px;
    border-radius: 12px;
    margin: auto;
    display: flex;
    flex-wrap: wrap;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}

.boxT {
    width: 80%;
    height: 40px;
    margin: auto;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    position: relative;
}

.text {
    /* font-size: 18px;
    font-weight: 550; */
    color: black;
    display: block;
}

.boxT input {
    display: block;
    width: 70%;
    height: 25px;
    font-size: 13px;
    border-radius: 10px;
    color: rgb(103, 98, 98);
    padding-left: 12px;
    border: 0.5px solid #666;
}

.but {
    position: absolute;
    right: -35px;
    width: 40px;
    height: 20px;
    text-align: center;
    line-height: 20px;
    background-color: rgb(204, 202, 202);
    font-size: 12px;
    color: white;
    border-radius: 12px;
}
.el-breadcrumb{
    margin-bottom: 180px;
}
</style>