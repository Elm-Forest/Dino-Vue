const token_key='token';

function getToken() {
    return localStorage.getItem(token_key);
}

function setToken(token) {
    localStorage.setItem(token_key, token);
}

function removeToken() {
    localStorage.removeItem(token_key)
}