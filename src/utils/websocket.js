import ElementUI from 'element-ui';
import {reqUrl} from './request.js';

function initWebSocket() {
    const wsUrl = 'ws://' + reqUrl + "/websocket";
    this.socket = new WebSocket(wsUrl, [localStorage.getItem('token')])//这里面的this都指向vue
    this.socket.onerror = webSocketOnError;
    this.socket.onmessage = webSocketOnMessage;
    this.socket.onclose = closeWebsocket;
    return this.socket;
}

function webSocketOnError(e) {
    ElementUI.Notification({
        title: '',
        message: "WebSocket连接发生错误" + e,
        type: 'error',
        duration: 0,
    });
}

function webSocketOnMessage(e) {
    console.log(e)
    ElementUI.Notification({
        title: '',
        message: e.data,
        type: 'success',
        duration: 3000,
    });
}

function closeWebsocket() {
    console.log('连接已关闭...')
}

function close() {
    this.socket.close() // 关闭 websocket
    this.socket.onclose = function (e) {
        console.log(e)//监听关闭事件
        console.log('关闭')
    }
}

function webSocketSend(agentData) {
    this.socket.send(agentData);
}

export default {
    initWebSocket, close
}
