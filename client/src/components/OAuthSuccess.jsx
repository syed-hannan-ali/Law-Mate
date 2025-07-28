import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function OAuthSuccess() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        const user = searchParams.get("user");
        const token = searchParams.get("token");

        if (user && token) {
            localStorage.setItem("user", user);
            localStorage.setItem("token", token);
            navigate("/");
        }
    }, [searchParams, navigate]);

    return <p>Signing you in...</p>;
}
