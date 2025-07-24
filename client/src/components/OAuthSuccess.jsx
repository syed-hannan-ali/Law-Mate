import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function OAuthSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const user = searchParams.get("user");
    if (user) {
      localStorage.setItem("user", user);
      navigate("/dashboard");
    }
  }, [searchParams , navigate]);

  return <p>Signing you in...</p>;
}
