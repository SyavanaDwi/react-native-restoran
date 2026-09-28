import axios from "axios";
import * as SecureStore from "expo-secure-store";

const api = axios.create({
  // baseURL: "http://192.168.1.13:3000/api", //wifi kosan
  baseURL: "http://192.168.18.70:3000/api", //wifi dumbways
  // baseURL: "http://192.168.1.29:3000/api", //wifi rumah
});

api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync("token");

  if (token) {
    config.headers.Authorization = `bearer ${token}`;
  }
  return config;
});

export default api;
