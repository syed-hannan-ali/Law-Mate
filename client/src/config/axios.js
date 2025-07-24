
import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Optional: interceptors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle errors globally
    console.error('Axios Error:', error.response?.data || error.message)
    return Promise.reject(error)
  }
)

export default axiosInstance
