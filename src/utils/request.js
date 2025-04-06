import axios from "axios";
import { showFailToast } from "vant";
import { removeToken, getToken } from '@/utils/token-util';

const baseConfig = {
    baseURL: import.meta.env.VITE_API_NAME === 'dev' || 'test' ? import.meta.env.VITE_API_URL : window.location.origin,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json'
    }
};

// axios 实例
const instance = axios.create(baseConfig);

// 请求拦截
instance.interceptors.request.use(
    config => {
        // 添加token到header
        const token = getToken();
        if (token && config.headers) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    err => Promise.reject(err)
);

// 响应拦截
instance.interceptors.response.use(
    (res) => {
        if (res.data?.status === 401) {
            // token错误
            removeToken()
        } else if (res.data?.status !== 200) {
            showFailToast(data.err);
            return Promise.reject(res.data);
        }
        return res
    },
    (error) => {
        console.log(error, '请求失败')
        let d = error;
        if (error.response && error.response.data) {
            d = error.response.data;
            const message = d.status;
            if (message === 401) {
                removeToken();
            } else {
                showFailToast(d.message);
            }
        }
        return Promise.reject(d);
    }
)

export default instance;
