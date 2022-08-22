<template>
    <div class="resetPassword">
        <!-- 标题部分 -->
        <div id="title">Retrieve Password</div>
        <!-- 返回键 -->
        <el-button style="position: absolute;right: 61px;top: 47px;" type="info" @click="goback">返回</el-button>
        <!-- 忘记密码主题框 -->
        <div class="container">
            <!-- 步骤条 -->
            <el-steps :active="active" :space="200" finish-status="success"  align-center>
                <el-step title="验证用户名和邮箱" icon="el-icon-edit"></el-step>
                <el-step title="输入验证码" icon="el-icon-s-promotion"></el-step>
                <el-step title="设置新密码" icon="el-icon-key"></el-step>
            </el-steps>
            <!-- 页面一 验证用户名和邮箱 -->
            <div v-if="active === 0" class="common_div">
                <el-form :model="Form"  class="user-container" label-position="left" label-width="60px" size="medium">
                    <el-form-item  style="float: right; width: 80%" label="用户名">
                        <el-input type="text" v-model="Form.username" autofocus ref="username" auto-complete="off"
                                  placeholder="请输入要找回密码的用户名" prefix-icon="el-icon-user-solid" spellcheck="false">
                        </el-input>
                    </el-form-item>
                    <el-form-item style="float: right; width: 80%" label="邮箱号">
                        <el-input type="text" v-model="Form.email" autofocus ref="email" auto-complete="off"
                                  placeholder="请输入用来找回密码的邮箱" prefix-icon="el-icon-message" spellcheck="false">
                        </el-input>
                    </el-form-item>
                </el-form>
            </div>
            <!-- 页面二 输入验证码 -->
            <div v-if="active === 1" class="common_div">
                <el-form :model="codeForm"  class="user-container" label-position="left" label-width="60px" size="medium">
                    <el-form-item  style="float: right; width: 80%" label="验证码">
                        <el-input type="text" v-model="codeForm.code" autofocus ref="code" auto-complete="off"
                                  placeholder="请输入邮箱验证码" prefix-icon="el-icon-s-promotion" spellcheck="false">
                        </el-input>
                    </el-form-item>
                </el-form>
            </div>
            <!-- 页面三 设置新密码 -->
            <div v-if="active === 2" class="common_div">
                <el-form :model="passwordForm"  class="user-container" label-position="left" label-width="60px" size="medium">
                    <el-form-item  style="float: right; width: 80%" label="新密码">
                        <el-input type="password" v-model="passwordForm.password" autofocus ref="password"
                                  auto-complete="off" placeholder="请输入新密码" prefix-icon="el-icon-key" >
                        </el-input>
                    </el-form-item>
                </el-form>
            </div>
            <!-- 下一步按钮 -->
            <div class="common_div">
                <el-button  @click="next" class="action_button">下一步</el-button>
            </div>
        </div>        
        <router-view></router-view>
    </div>
</template>

<script>
export default {
    name: "retrievePassword",
    data() {
        return {
            active: 0,
            // 验证用户名和邮箱表单
            Form: {
                username: '',
                email: '',
            },
            // 输入验证码表单
            codeForm: {
                code: '',
            },
            // 设置新密码表单
            passwordForm: {
                password: '',
            },
            disabled: false,
            isUsername: false,
        }
    },
    created() {
        let regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
        if (regEmail.test(this.$route.query.username)) {
            console.log("传来了邮箱")
            this.Form.email = this.$route.query.username;
            this.isUsername = false;
        } else {
            // 传来的不是邮箱，那就是用户名
            console.log("传来了用户名")
            this.Form.username = this.$route.query.username;
            this.isUsername = true;
        }
    },
    methods: {
        // 返回登录页面
        goback(){
            this.$router.push('/login');
        },
        // 邮箱验证
        isEmail() {
            let regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
            if (!regEmail.test(this.Form.email)) {
                this.$message({
                    message: '邮箱格式不正确',
                    type: 'error'
                });
                return false;
            }
            return true;
        },
        beforePost () {
            if (this.Form.username === '' || this.Form.email === '') {
                // 重置密码时，如果用户名或者邮箱未输入，那么提醒用户输入
                if (this.Form.username === '') {
                    this.$message({
                        message: '警告, 用户名未输入哦',
                        type: 'warning'
                    });
                    this.$refs.username.focus();
                }else {
                    this.$message({
                        message: '警告, 邮箱未输入哦',
                        type: 'warning'
                    });
                    this.$refs.email.focus();
                }
                return false;
            }else {
                //进行邮箱格式的检测
                return this.isEmail();
            }
        },
        next() {
            // 当面板为0时，先判断用户名和邮箱是否输入，进行相关的验证
            if (this.active === 0) {
                let isFinished = this.beforePost();
                if (isFinished) {
                    //数据输入正确后，将按钮禁掉，并提示相关信息，然后数据发送到后台
                    this.disabled = true;
                    this.$notify.info({
                        title: '提示',
                        message: '数据正确发送，请耐心等待，勿重复操作！',
                        duration: 0,
                        offset: 100,
                    });
                    this.post();
                }
            }
            // 当面板为1时，则到了用户输入验证码的时候, 将验证码传入后台
            if (this.active === 1) {
                // 如果验证码未输入，提示用户
                if (this.codeForm.code === '') {
                    this.$notify({
                        title: '警告',
                        message: '警告, 验证码未输入，请去您邮箱中查看!',
                        type: 'warning',
                        offset: 100,
                    });
                    this.$refs.code.focus();
                }else {
                    this.$axios.post('/resetPassword', {
                        code: this.codeForm.code,
                        username: this.username,
                    }).then(successResponse => {
                        if (successResponse.data.code === 200) {
                            //验证码输入正确，
                            this.active++;
                            this.$notify({
                                title: '成功',
                                message: '验证码匹配正确！',
                                type: 'success',
                                duration: 0,
                                offset: 100,
                            });
                        }else if (successResponse.data.code === 400) {
                            //验证码匹配错误返回对应信息
                            this.$message.error(successResponse.data.message);
                        }
                    }).catch(failResponse => {

                    })
                }

            }
            // 当面板为2时，则到了用户输入密码的时候, 将密码传入后台
            if (this.active === 2) {
                //在发送密码之前，先校验一下是否输入了，不能让用户不小心输入了空密码
                if (this.passwordForm.password === '') {
                    this.$notify({
                        title: '警告',
                        message: '警告, 新密码未输入',
                        type: 'warning',
                        offset: 100,
                    });
                    this.$refs.password.focus();
                }else {
                    let password_md5 = this.$md5(this.passwordForm.password);
                    this.$axios.post('/resetPassword', {
                        password: password_md5,
                        username: this.username,
                    }).then(successResponse => {
                        if (successResponse.data.code === 200) {
                            //密码修改成功
                            this.$notify({
                                title: '成功',
                                message: '该账号密码修改正确！',
                                type: 'success',
                                duration: 0,
                                offset: 100,
                            });
                            let path = this.$route.query.redirect;
                            this.$router.replace({path: path === '/' || path === undefined ? '/login' : path})
                        }else if (successResponse.data.code === 400) {
                            //修改密码失败，返回对应信息
                            this.$message.error(successResponse.data.message);
                        }
                    }).catch(failResponse => {

                    })
                }
            }
        },
        post(){
            console.log(this.Form.username)
            console.log(this.Form.email)
            this.$axios
                .post('/resetPassword', {
                    username: this.Form.username,
                    email: this.Form.email,
                })
                .then(successResponse => {
                    if (successResponse.data.code === 200) {
                        // 如果返回的结果正确，那么需要发送邮件到对应的用户邮箱中，用户自己登录邮箱后找到对应的链接后才可以输入新密码
                        this.$notify({
                            title: '成功',
                            message: '已向'+ this.Form.email + '发送验证码，请在5分钟之内修改密码，否则验证码失效',
                            type: 'success',
                            duration: 0,
                            offset: 100
                        });
                        //跳转到下一个面板，并且将按钮恢复正常
                        this.active++;
                        this.disabled = false;
                        //将用户username保存下来
                        this.username = successResponse.data.result;
                    }else if (successResponse.data.code === 400) {
                        //如果用户名和密码匹配错误，那么显示错误信息，并让按钮重新可用
                        this.$notify({
                            title: '失败',
                            message: successResponse.data.message + "未知错误！",
                            type: 'error',
                            duration: 0,
                            offset: 100,
                        });
                        this.disabled = false;
                    }
                })
                .catch(failResponse => {
                })
        },
    }
}

</script>

<style scoped>    
.resetPassword{
    background-image: url("../images/background2.png");
    background-position: center;
    height: 100%;
    width: 100%;
    background-size: cover;
    position: absolute;
    top: 0;
    left: 0;
}
#title{
    font-size: 80px;
    color: #999;
    text-align: center;
    height: 200px;
    line-height: 170%;
}
.container{
    border-radius: 15px;
    background-clip: padding-box;
    margin: 0 auto;
    width: 40%;
    padding: 25px 30px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 200px #929288;
    opacity: 0.7;
}
.common_div{
    margin-top: 5%;
}
.user-container {
    width: 80%;
    background: #fff;
}
.action_button {
    width: 20%;
    margin-top: 3%;
    text-align: center;
}

</style>

