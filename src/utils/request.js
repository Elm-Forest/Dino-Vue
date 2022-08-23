import axios from 'axios'
import {MessageBox, Message} from 'element-ui'
import router from '../router/index'

// create an axios instance
const service = axios.create({
    baseURL: 'http://120.25.3.27', // url = base url + request url
    timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(config => {
        // do something before request is sent
        let token = localStorage.getItem('token')
        if (token !== null || token !== '') {
            config.headers['token'] = token
        }
        console.log('token', token);
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
            console.log(res.code)
            return res
        }
        router.push('/login')
        return res
    },
    error => {
        console.log('err' + error) // for debug
        Message({
            message: error.message,
            type: 'error',
            duration: 5 * 1000
        })
        return Promise.reject(error)
    }
)

export default service