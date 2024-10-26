import axios from "./axiosInstance";

const get = (url) =>
  axios.get(url).then((response) => response?.data);

const post = (url, body) =>
  axios.post(url, body).then((response) => response?.data?.data);



const apiEngine = {
  get,
  post,
};

export default apiEngine;