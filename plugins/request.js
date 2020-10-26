import axios from 'axios';

export const request = axios.create({
  baseURL: 'https://conduit.productionready.io/',
});

export default ({ store = {} }) => {
  // 添加请求拦截器
  request.interceptors.request.use((config) => {
    const { state: { user } = {} } = store;
    if (user) {
      const { token } = user;
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  }, (error) => Promise.reject(error));
};
