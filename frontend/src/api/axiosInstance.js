import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://mindscribe.praiseafk.tech",
  timeout: 5000, // Request timeout (in ms)
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${localStorage.getItem("access_token")}`,
  },
});

export default axiosInstance;