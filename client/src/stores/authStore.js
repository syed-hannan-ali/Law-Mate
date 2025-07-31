// stores/authStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "@config/axios";

const useAuthStore = create(
    persist(
        (set, get) => ({
            // State
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,

            // Actions
            login: async (email, password) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await axios.post(
                        "/auth/login",
                        { email, password },
                        {
                            withCredentials: true,
                        },
                    );
                    const { user, token } = response.data;

                    set({
                        user,
                        token,
                        isAuthenticated: true,
                        isLoading: false,
                        error: null,
                    });

                    return { success: true, data: response.data };
                } catch (error) {
                    const errorMessage =
                        error.response?.data?.error || "Login failed";
                    set({
                        user: null,
                        token: null,
                        isAuthenticated: false,
                        isLoading: false,
                        error: errorMessage,
                    });
                    return { success: false, error: errorMessage };
                }
            },

            signup: async (name, email, password) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await axios.post("/auth/signup", {
                        username: name,
                        email,
                        password,
                    });

                    // Don't auto-login after signup, just return success
                    set({
                        isLoading: false,
                        error: null,
                    });

                    return { success: true, data: response.data };
                } catch (error) {
                    const errorMessage =
                        error.response?.data?.error || "Signup failed";
                    set({
                        isLoading: false,
                        error: errorMessage,
                    });
                    return { success: false, error: errorMessage };
                }
            },

            loginWithOAuth: (userData, tokenData) => {
                set({
                    user: JSON.parse(userData),
                    token: tokenData,
                    isAuthenticated: true,
                    isLoading: false,
                    error: null,
                });
            },

            logout: () => {
                set({
                    user: null,
                    token: null,
                    isAuthenticated: false,
                    isLoading: false,
                    error: null,
                });
            },

            clearError: () => {
                set({ error: null });
            },

            // Initialize auth state from storage (useful for app startup)
            initializeAuth: () => {
                const state = get();
                if (state.user && state.token) {
                    set({ isAuthenticated: true });
                }
            },
        }),
        {
            name: "auth-storage",
            partialize: (state) => ({
                user: state.user,
                token: state.token,
                isAuthenticated: state.isAuthenticated,
            }),
        },
    ),
);

export default useAuthStore;
