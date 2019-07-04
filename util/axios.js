const axios = require('axios')

const TIME_OUT = 20000;

// 用于存储 取消请求的标志位
let pending = [];

axios.defaults.timeout = TIME_OUT;
const CancelToken = axios.CancelToken;

const removePending = (config) => {
  if (pending.length === 0) return
  for (let p in pending) {
    if (pending[p].u === `${config.url}&${config.method}`) {
      pending[p].f() // 取消请求
      pending.splice(p, 1)
    }
  }
}

axios.interceptors.request.use(
  (config) => {
    removePending(config)
    config.cancelToken = new CancelToken(c => {
      pending.push({ u:`${config.url}&${config.method}`, f: c });  
    })
    return config
  },
  (err) => {
    Promise.reject(err)
  }
)

axios.interceptors.response.use(
  response => {
    console.log(response);
    removePending(response.config) // 删除成功后的请求
    if (response.status >= 200 && response.status < 310) {
      return response;
    }
  },
  error => {
    return Promise.reject(error);
  }
);
module.exports = axios;
