// hooks/useAuth.js - Custom hook for auth operations
import useAuthStore from "../stores/authStore";
import { useNavigate } from "react-router-dom";

export const useAuth = () => {
    const navigate = useNavigate();
    const {
        user,
        token,
        isAuthenticated,
        isLoading,
        error,
        login,
        signup,
        loginWithOAuth,
        logout,
        clearError,
    } = useAuthStore();

    const handleLogin = async (email, password) => {
        const result = await login(email, password);
        if (result.success) {
            navigate("/admin");
        }
        return result;
    };

    const handleSignup = async (name, email, password) => {
        const result = await signup(name, email, password);
        if (result.success) {
            navigate("/login");
        }
        return result;
    };

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const handleOAuthSuccess = (userData, tokenData) => {
        loginWithOAuth(userData, tokenData);
        const oauthData = localStorage.getItem("auth-storage"); // Replace with actual key name
        let user = null;

        if (oauthData) {  
            const parsedData = JSON.parse(oauthData);
            user = parsedData?.state?.user;
        }
        console.log("OAuth user data:", user);
        if (user.role === "admin") navigate("/admin");
        else if (user.role === "lawyer" || user.role === "paralegal")
            navigate("/staff");
        else navigate("/client");
    };

    return {
        user,
        token,
        isAuthenticated,
        isLoading,
        error,
        handleLogin,
        handleSignup,
        handleLogout,
        handleOAuthSuccess,
        clearError,
    };
};
