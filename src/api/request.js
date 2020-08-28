/**
 * 封装axios请求
 * */
import axios from 'axios';

// 请求默认地址
const baseURL = 'https://api.imjad.cn/pixiv/';

// 设置axios请求的默认参数
axios.defaults.baseURL = baseURL;
axios.defaults.timeout = 10000;
axios.defaults.headers.post['Content-Type'] = 'application/json';

export const  get = async (url, params) => {
    try {
        const res = await axios.get(url, {params});
        return new Promise((resolve, reject) => {
            let data = res.data;
            if (typeof data === 'object') {
                resolve(data);
            } else {
                reject(data);
            }
        })
    }catch (ex) {
        console.error(ex);
    }
};

export const post = async (url, data) => {
  try {
    const res = await axios.post(url, data).data;
    return new Promise((resolve, reject) => {
        let data = res.data;
        if (typeof data === 'object') {
            resolve(data);
        } else {
            reject(data);
        }
    })
  } catch (ex) {
    console.error(ex);
  }
};
