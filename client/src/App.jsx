import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";
import { useEffect } from "react";
import useAuthStore from "@stores/authStore";
import Login from "@components/auth/Login";
import Signup from "@components/auth/Signup";
import OAuthSuccess from "@components/auth/OAuthSuccess";
import ProtectedRoute from "@components/common/ProtectedRoute";
import LegalLandingPage from "@components/LegalLandingPage";
import AdminPage from "@pages/AdminPage";
import Unauthorized from "@components/unauthorized";
import LawyerParalegalPage from "@pages/LawyerParalegalPage";
import ClientPage from "@pages/ClientPage";
import { Toaster } from "sonner";

export default function App() {
    const initializeAuth = useAuthStore((state) => state.initializeAuth);

    useEffect(() => {
        initializeAuth();
    }, [initializeAuth]);

    return (
        <>
            <Router>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<LegalLandingPage />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/oauth-success" element={<OAuthSuccess />} />
                    <Route path="/unauthorized" element={<Unauthorized />} />
                    <Route path="/admin/*" element={<AdminPage />} />
                    <Route path="/staff/*" element={<LawyerParalegalPage />} />
                    <Route path="/client/*" element={<ClientPage />} />
                </Routes>
            </Router>
            <Toaster position="top-right" richColors closeButton />
        </>
    );
}
