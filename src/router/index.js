import Vue from 'vue'
import Router from 'vue-router'
import retrievePassword from '../components/retrievePassword.vue'
import normal from '../components/normal.vue'
import admin from '../components/admin.vue'
import home from '../components/home.vue'
import selectFile from '../components/file/selectFile.vue'
import recycle from '../components/file/recycle.vue'
import record from '../components/file/record.vue'
import signIn from '../components/sign/signIn.vue'
import addSign from '../components/sign/addSign.vue'
import searchSign from '../components/sign/searchSign.vue'
import signTime from '../components/sign/signTime.vue'
import approve from '../components/sign/approve.vue'
import admUser from '../components/dept/admUser.vue'
import company from '../components/dept/company.vue'
import fjx from '../components/message/fjx.vue'
import sjx from '../components/message/sjx.vue'
import cgx from '../components/message/cgx.vue'
import ljx from '../components/message/ljx.vue'
import add from '../components/message/add.vue'
import bindMailbox from '../components/message/bindMailbox.vue'
import deptSchedule from '../components/date/deptSchedule.vue'
import deptRegister from "@/components/deptRegister";
import requestOffer from "@/components/requestOffer";
import userinfo from "@/components/user/userinfo";
import adminOffer from "@/components/dept/adminOffer";
import registerInfo from "@/components/registerInfo";
import superAdmin from "@/components/superAdmin.vue";
import account from "@/components/user/account.vue";
import chatRoom from "@/components/chat/chatRoom.vue";
import gpt from "@/components/gpt/gpt.vue";
import checkList from "@/components/sign/checkList";
import schedule from "@/components/date/schedule.vue";
import userDeptSchedule from "@/components/date/userDeptSchedule";
import newLogin from "@/components/login.vue";
import newRegister from "@/components/register.vue";

Vue.use(Router)

const routes = [
    {path: '/', redirect: '/login'},
    {path: '/login', name: '登录', component: newLogin},
    {path: '/register', name: '注册', component: newRegister},
    {path: '/retrievePassword', component: retrievePassword},
    {path: '/dept', component: deptRegister},
    {path: '/offer', component: requestOffer},
    {path: '/registerInfo', component: registerInfo},

    //普通员工
    {
        path: '/normal',
        component: normal,
        redirect: '/normal/home',
        children: [
            {path: '/normal/userinfo', component: userinfo},
            {path: '/normal/account', component: account},
            {path: '/normal/home', component: home},
            {path: '/normal/selectFile', component: selectFile},
            {path: '/normal/recycle', component: recycle},
            {path: '/normal/record', component: record},
            {path: '/normal/signIn', component: signIn},
            {path: '/normal/checkList', component: checkList},
            {path: '/normal/addSign', component: addSign},
            {path: '/normal/fjx', name: 'fjx', component: fjx},
            {path: '/normal/sjx', name: 'sjx', component: sjx},
            {path: '/normal/cgx', component: cgx},
            {path: '/normal/ljx', component: ljx},
            {path: '/normal/add', component: add},
            {path: '/normal/bindMailbox', component: bindMailbox},
            {path: '/normal/schedule', component: schedule},
            {path: '/normal/deptSchedule', component: userDeptSchedule},
            {path: '/normal/chat', component: chatRoom},
            {path: '/normal/gpt', component: gpt},
        ]
    },
    //部门管理员
    {
        path: '/admin',
        component: admin,
        redirect: '/admin/home',
        children: [
            {path: '/admin/userinfo', component: userinfo},
            {path: '/admin/account', component: account},
            {path: '/admin/home', component: home},
            {path: '/admin/selectFile', component: selectFile},
            {path: '/admin/recycle', component: recycle},
            {path: '/admin/record', component: record},
            {path: '/admin/searchSign', component: searchSign},
            {path: '/admin/signTime', component: signTime},
            {path: '/admin/approve', component: approve},
            {path: '/admin/admUser', component: admUser},
            {path: '/admin/company', component: company},
            {path: '/admin/schedule', component: schedule},
            {path: '/admin/deptSchedule', component: deptSchedule},
            {path: '/admin/offer', component: adminOffer},
            {path: '/admin/chat', component: chatRoom},
            {path: '/admin/gpt', component: gpt},
        ]
    },
    //超级管理员
    {
        path: '/super',
        component: superAdmin,
        redirect: '/super/home',
        children: [
            {path: '/super/userinfo', component: userinfo},
            {path: '/super/account', component: account},
            {path: '/super/home', component: home},
            {path: '/super/selectFile', component: selectFile},
            {path: '/super/recycle', component: recycle},
            {path: '/super/record', component: record},
            {path: '/super/searchSign', component: searchSign},
            {path: '/super/fjx', component: fjx},
            {path: '/super/sjx', component: sjx},
            {path: '/super/cgx', component: cgx},
            {path: '/super/ljx', component: ljx},
            {path: '/super/add', component: add},
            {path: '/super/bindMailbox', component: bindMailbox},
            {path: '/super/signTime', component: signTime},
            {path: '/super/approve', component: approve},
            {path: '/super/admUser', component: admUser},
            {path: '/super/company', component: company},
            {path: '/super/schedule', component: schedule},
            {path: '/super/deptSchedule', component: deptSchedule},
            {path: '/super/offer', component: adminOffer},
            {path: '/super/chat', component: chatRoom},
            {path: '/super/gpt', component: gpt},
        ]
    },
    {
        path: '*',
        name: '404',
        component: () => import('../components/404.vue')
    }
]

const router = new Router({
    // mode: 'history',
    mode: 'hash',
    routes
})

export default router
