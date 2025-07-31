import axios from "axios";
import { toast } from "sonner";

const axiosInstance = axios.create({
    baseURL: "http://localhost:3000/api",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

async function getNewAccessToken() {
    try {
        const response = await axios.post(
            "http://localhost:3000/api/auth/refresh-token", // ✅ adjust if needed
            {}, // no body needed if refresh token is in cookie
            {
                withCredentials: true, // ⬅️ tells browser to send cookies
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        const newAccessToken = response.data.accessToken;
        console.log("✅ New access token received:", newAccessToken);

        // You can now store this new token (e.g. in localStorage or context)
        localStorage.setItem("auth-storage", JSON.stringify({
            state: {
                token: newAccessToken,
            }
        }));

        return newAccessToken;

    } catch (error) {
        console.error("❌ Failed to refresh token:", error.response?.data || error.message);
        throw error;
    }
}


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
    },
);

// Optional: interceptors
axiosInstance.interceptors.response.use(
    (response) => console.log("Axios Response:", response) || response,
    async error => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const newAccessToken = await getNewAccessToken();

                // Retry original request with new token
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return axiosInstance(originalRequest);

            } catch (err) {
                // Handle failure: logout or redirect
                toast.error("Session expired. Please log in again.");
                localStorage.removeItem("auth-storage");
                return Promise.reject(err);
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
