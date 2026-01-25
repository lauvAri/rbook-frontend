import axios from "axios";

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080/api",
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});

// 请求拦截器：自动附加用户 token
axiosInstance.interceptors.request.use(
    (config) => {
        // 从 localStorage 获取持久化的用户状态
        const userStorage = localStorage.getItem('user-storage');
        if (userStorage) {
            try {
                const { state } = JSON.parse(userStorage);
                if (state?.token) {
                    config.headers.Authorization = `Bearer ${state.token}`;
                }
            } catch {
                // 忽略解析错误
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 响应拦截器：处理 401 未授权
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // 清除本地存储的用户状态
            localStorage.removeItem('user-storage');
            // 可选：重定向到登录页
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;