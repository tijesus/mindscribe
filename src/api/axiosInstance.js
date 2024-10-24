import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://mindscribe.praiseafk.tech/api",
  timeout: 5000, // Request timeout (in ms)
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;