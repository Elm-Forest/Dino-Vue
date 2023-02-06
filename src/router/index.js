import Vue from 'vue'
import Router from 'vue-router'
import login from '../components/login.vue'
import Register from '../components/Register.vue'
import retrievePassword from '../components/retrievePassword.vue'
import normal from '../components/normal.vue'
import admin from '../components/admin.vue'
import home from '../components/home.vue'
import selectFile from '../components/File/selectFile.vue'
import recycle from '../components/File/recycle.vue'
import record from '../components/File/record.vue'
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
import fjxDetail from '../components/message/fjxDetail.vue'
import sjxDetail from '../components/message/sjxDetail.vue'
import adminList from '../components/message/adminList.vue'
import adminListDetail from '../components/message/adminListDetail.vue'
import schedule from '../components/date/schedule.vue'
import friendsSchedule from '../components/date/friendsSchedule.vue'
import deptSchedule from '../components/date/deptSchedule.vue'
import deptRegister from "@/components/deptRegister";
import requestOffer from "@/components/requestOffer";
import userinfo from "@/components/user/userinfo";
import adminOffer from "@/components/dept/adminOffer";
import registerInfo from "@/components/registerInfo";
import socket from '@/components/test/socket.vue'
import superAdmin from "@/components/superAdmin.vue";

Vue.use(Router)

const routes = [
    {path: '/socket', component: socket},
    {path: '/', redirect: '/login'},
    {path: '/login', name: '登录', component: login},
    {path: '/register', component: Register},
    {path: '/retrievePassword', component: retrievePassword},
    {path: '/dept', component: deptRegister},
    {path: '/offer', component: requestOffer},
    {path: '/registerInfo', component: registerInfo},

    //普通员工
    {
        path: '/normal',
        component: normal,
        redirect: '/home',
        children: [
            {path: '/userinfo', component: userinfo},
            {path: '/home', component: home},
            {path: '/File/selectFile', component: selectFile},
            {path: '/File/recycle', component: recycle},
            {path: '/File/record', component: record},
            {path: '/sign/signIn', component: signIn},
            {path: '/sign/addSign', component: addSign},
            {path: '/message/fjx', name: 'fjx', component: fjx},
            {path: '/message/sjx', name: 'sjx', component: sjx},
            {path: '/message/cgx', component: cgx},
            {path: '/message/ljx', component: ljx},
            {path: '/message/add', component: add},
            {path: '/message/bindMailbox', component: bindMailbox},
            {path: '/message/fjxDetail/:id', name: 'fjxDetail', component: fjxDetail},
            {path: '/message/sjxDetail/:id', name: 'sjxDetail', component: sjxDetail},
            {path: '/date/schedule', component: schedule},
            {path: '/date/schedule', component: schedule},
            {path: '/date/friendsSchedule', component: friendsSchedule},
            {path: '/date/deptSchedule', component: deptSchedule},
        ]
    },
    //部门管理员
    {
        path: '/admin',
        component: admin,
        redirect: '/admin/admUser',
        children: [
            {path: '/admin/userinfo', component: userinfo},
            {path: '/admin/home', component: home},
            {path: '/admin/selectFile', component: selectFile},
            {path: '/admin/recycle', component: recycle},
            {path: '/admin/record', component: record},
            {path: '/admin/searchSign', component: searchSign},
            {path: '/admin/signTime', component: signTime},
            {path: '/admin/approve', component: approve},
            {path: '/admin/admUser', component: admUser},
            {path: '/admin/company', component: company},
            {path: '/admin/adminList', name: 'adminList', component: adminList},
            {path: '/admin/adminListDetail/:id', name: 'adminListDetail', component: adminListDetail},
            {path: '/admin/schedule', component: schedule},
            {path: '/admin/friendsSchedule', component: friendsSchedule},
            {path: '/admin/deptSchedule', component: deptSchedule},
            {path: '/admin/offer', component: adminOffer},
        ]
    },
    //超级管理员
    {
        path: '/super',
        component: superAdmin,
        redirect: '/super/admUser',
        children: [
            {path: '/super/userinfo', component: userinfo},
            {path: '/super/home', component: home},
            {path: '/super/selectFile', component: selectFile},
            {path: '/super/recycle', component: recycle},
            {path: '/super/record', component: record},
            {path: '/super/searchSign', component: searchSign},
            {path: '/super/signTime', component: signTime},
            {path: '/super/approve', component: approve},
            {path: '/super/admUser', component: admUser},
            {path: '/super/company', component: company},
            {path: '/super/adminList', name: 'adminList', component: adminList},
            {path: '/super/adminListDetail/:id', name: 'adminListDetail', component: adminListDetail},
            {path: '/super/schedule', component: schedule},
            {path: '/super/friendsSchedule', component: friendsSchedule},
            {path: '/super/deptSchedule', component: deptSchedule},
            {path: '/super/offer', component: adminOffer},
        ]
    }
]

const router = new Router({
    // mode: 'history',
    mode: 'hash',
    routes
})

export default router