import axios from "axios";

const TIME_OUT = 2000000;

axios.defaults.timeout = TIME_OUT;

// axios.interceptors.request.use(
//     (config) => {

//     },
//     (err) => {
//         Promise.reject(err)
//     }
// )

axios.interceptors.response.use(
  response => {
    console.log(response);
    if (response.status >= 200 && response.status < 310) {
      return response;
    }
  },
  error => {
    return Promise.reject(error);
  }
);

export default axios;
