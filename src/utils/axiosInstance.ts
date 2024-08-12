import axios from "axios";
import { BASE_URL } from "../constants";

const instance = axios.create({
  baseURL: BASE_URL + "/",
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
