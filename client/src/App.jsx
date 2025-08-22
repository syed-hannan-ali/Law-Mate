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
import LegalLandingPage from "@components/LegalLandingPage";
import AdminPage from "@pages/AdminPage";
import Unauthorized from "@components/unauthorized";
import LawyerParalegalPage from "@pages/LawyerParalegalPage";
import ClientPage from "@pages/ClientPage";
import SubscriptionPage from "@components/SubscriptionPage";
import { Toaster } from "sonner";
import PaymentSuccess from "@components/paymentSuccess";
import BillingHistory from "@components/billing-history";
export default function App() {
    const dev = true;

    const initializeAuth = useAuthStore((state) => state.initializeAuth);

    useEffect(() => {
        initializeAuth();
    }, [initializeAuth]);

    if (!dev) {
        return <BillingHistory />;
    }

    return (
        <>
            <Router>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<LegalLandingPage />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/oauth-success" element={<OAuthSuccess />} />
                    <Route path="/subscribe" element={<SubscriptionPage />} />
                    <Route
                        path="/subscription/success"
                        element={<PaymentSuccess />}
                    />

                    {/* Protected Routes */}
                    <Route path="/unauthorized" element={<Unauthorized />} />
                    <Route path="/admin/*" element={<AdminPage />} />
                    <Route path="/staff/*" element={<LawyerParalegalPage />} />
                    <Route path="/client/*" element={<ClientPage />} />
                    {/* <Route path="/chat" element={<ChatPage />} /> */}
                </Routes>
            </Router>
            <Toaster position="top-right" richColors closeButton />
        </>
    );
}
