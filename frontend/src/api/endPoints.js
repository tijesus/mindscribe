const API_BASE_URL = 'https://mindscribe.praiseafk.tech';

export const AUTH_ENDPOINTS = {
    LOGIN: `${API_BASE_URL}/auth/login`,
    SIGNUP: `${API_BASE_URL}/auth/signup`,
    LOGOUT: `${API_BASE_URL}/auth/logout`,
    FORGOT_PASSWORD: `${API_BASE_URL}/auth/forgot-password`,
    RESET_PASSWORD: `${API_BASE_URL}/auth/reset-password`,
};

export const POSTS_ENDPOINTS = {
    GET_ALL: (page, limit) => `${API_BASE_URL}/posts/?page=${page}&limit=${limit}`, // Function-based for pagination
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
