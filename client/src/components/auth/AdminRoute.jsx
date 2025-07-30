import { Navigate } from "react-router-dom";

export default function AdminRoute({ children }) {
    const user = JSON.parse(localStorage.getItem("user")); // or from context/store

    if (!user || user.role !== "admin") {
        return <Navigate to="/" replace />;
    }

    return children;
}
