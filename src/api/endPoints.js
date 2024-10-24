const API_BASE_URL = 'http://mindscribe.praiseafk.tech/';

export const AUTH_ENDPOINTS = {
    LOGIN: `${API_BASE_URL}/auth/login`,
    SIGNUP: `${API_BASE_URL}/auth/signup`,
    FORGOT_PASSWORD: `${API_BASE_URL}/auth/forgot-password`,
    RESET_PASSWORD: `${API_BASE_URL}/auth/reset-password`,
};

export const POSTS_ENDPOINTS = {
    GET_ALL: 'https://mindscribe.praiseafk.tech/posts/?page=1&limit=10',
    GET_ONE: (id) => `${API_BASE_URL}/posts/${id}`,
    CREATE: `${API_BASE_URL}/posts`,
    UPDATE: (id) => `${API_BASE_URL}/posts/${id}`,
    DELETE: (id) => `${API_BASE_URL}/posts/${id}`,
};

const endpoints = {
  AUTH_ENDPOINTS,
  POSTS_ENDPOINTS,
};

export default endpoints;