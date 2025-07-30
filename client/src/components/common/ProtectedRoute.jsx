import { Navigate } from 'react-router-dom';
import useAuthStore from "@stores/authStore";

export default function ProtectedRoute({ children }) {
     const user = useAuthStore((state) => state.user);

     console.log(user);

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (user.role !== "admin") {
        return <Navigate to="/" replace />;
    }

    return children;
}