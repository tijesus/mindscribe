const API_BASE_URL = 'https://mindscribe.praiseafk.tech';

// Auth Endpoints
export const AUTH_ENDPOINTS = {
    LOGIN: `${API_BASE_URL}/auth/login`,
    SIGNUP: `${API_BASE_URL}/auth/signup`,
    LOGOUT: `${API_BASE_URL}/auth/logout`,
    FORGOT_PASSWORD: `${API_BASE_URL}/auth/forgot-password`,
    RESET_PASSWORD: `${API_BASE_URL}/auth/reset-password`,
};

// Post Endpoints with Functions for Dynamic URLs
export const POSTS_ENDPOINTS = {
    GET_ALL: (page = 1, limit = 10) => `${API_BASE_URL}/posts/?page=${page}&limit=${limit}`,
    GET_ONE: (id) => `${API_BASE_URL}/posts/${id}`,
    CREATE: `${API_BASE_URL}/posts`,
    UPDATE: (id) => `${API_BASE_URL}/posts/${id}`,
    DELETE: (id) => `${API_BASE_URL}/posts/${id}`,
    GET_USER_POSTS: `${API_BASE_URL}/posts/my_post`,
    CHECK_IF_LIKED: (id) => `${API_BASE_URL}/posts/isliked/${id}`,
    UPLOAD_MEDIA: `${API_BASE_URL}/posts/upload_media`,
    LIKE: (id) => `${API_BASE_URL}/posts/${id}/likes`,
    UNLIKE: (id) => `${API_BASE_URL}/posts/${id}/likes`,
    GET_LIKES: (postId) => `${API_BASE_URL}/posts/${postId}/likes`,
    CREATE_COMMENT: (postId) => `${API_BASE_URL}/posts/${postId}/comments`,
    UPDATE_COMMENT: (postId) => `${API_BASE_URL}/posts/${postId}/comments`,
    GET_COMMENTS: (postId) => `${API_BASE_URL}/posts/${postId}/comments`,
    DELETE_COMMENT: (postId) => `${API_BASE_URL}/posts/${postId}/comments`,
    ADD_BOOKMARK: (postId) => `${API_BASE_URL}/posts/${postId}/bookmarks`,
    REMOVE_BOOKMARK: (postId) => `${API_BASE_URL}/posts/${postId}/bookmarks`,
    GET_BOOKMARKS: (postId) => `${API_BASE_URL}/posts/${postId}/bookmarks`,
};

const endpoints = {
    AUTH_ENDPOINTS,
    POSTS_ENDPOINTS,
};

export default endpoints;
