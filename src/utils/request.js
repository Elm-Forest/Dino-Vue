import axios from 'axios'
import {Message} from 'element-ui'
import router from '../router/index'
import {requestUrl} from './back-end.js'

// create an axios instance
const service = axios.create({
    baseURL: 'http://' + requestUrl, // url = base url + request url
    timeout: 60000 // request timeout
})

// request interceptor
service.interceptors.request.use(config => {
        // do something before request is sent
        let token = localStorage.getItem('token')
        if (token !== null || token !== '') {
            config.headers['token'] = token
        }
        return config
    },
    error => {
        // do something with request error
        console.log(error) // for debug
        return Promise.reject(error)
    }
)

// response interceptor
service.interceptors.response.use(
    /**
     * If you want to get http information such as headers or status
     * Please return  response => response
     */

    /**
     * Determine the request status by custom code
     * Here is just an example
     * You can also judge the status by HTTP Status Code
     */
    response => {
        let res = response.data;
        if (res.code !== 99000) {
            return res
        }
        router.push('/login').then()
        this.message({
            message: '您尚未登录！',
            type: 'warning'
        })
        return res
    },
    error => {
        let msg = error.response.data.message;
        if (error.response.data.message === null || error.response.data.message === '' || error.response.data.message === undefined) {
            msg = error.message;
        }
        Message({
            message: msg,
            type: 'error',
            duration: 5 * 1000
        })
        return Promise.reject(error)
    }
)

export default service