import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "@hooks/useAuth";

export default function OAuthSuccess() {
    const [searchParams] = useSearchParams();
    const { handleOAuthSuccess } = useAuth();

    useEffect(() => {
        const user = searchParams.get("user");
        const token = searchParams.get("token");

        if (user && token) {
            handleOAuthSuccess(user, token);
        }
    }, []);

    return (
        <div className="flex min-h-screen items-center justify-center">
            <p className="text-lg">Signing you in...</p>
        </div>
    );
}
