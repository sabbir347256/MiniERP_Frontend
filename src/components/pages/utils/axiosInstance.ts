import axios from "axios";
import config from "./config";

const axiosInstance = axios.create({
  baseURL: `${config.backendUrl}`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;