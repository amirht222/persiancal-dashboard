import axios from "axios";
const base_url = import.meta.env.VITE_BASE_URL;

const instance = axios.create({
  baseURL: base_url + "/",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

instance.interceptors.request.use(
  function (config) {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response.status === 401) {
      // localStorage.clear();
      // window.location.pathname = "/login";
    }
    return Promise.reject(error);
  }
);

export default instance;
