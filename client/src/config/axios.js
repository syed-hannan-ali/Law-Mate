
import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

axiosInstance.interceptors.request.use(
    (config) => {
        const persistedState = localStorage.getItem("auth-storage");
        if (persistedState) {
            const { token } = JSON.parse(persistedState).state || {};
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
                console.log("✅ Axios Token Attached:", token);
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Optional: interceptors
axiosInstance.interceptors.response.use(
  (response) => console.log('Axios Response:', response) || response,
  (error) => {
    // Handle errors globally
    console.error('Axios Error:', error.response?.data || error.message)
    return Promise.reject(error)
  }
)

export default axiosInstance
