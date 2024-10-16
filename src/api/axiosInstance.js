import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://countriesnow.space/api", // Replace with your API's base URL
  timeout: 5000, // Request timeout (in ms)
  headers: {
    "Content-Type": "application/json",
    // You can add more default headers here if needed
  },
});

export default axiosInstance;