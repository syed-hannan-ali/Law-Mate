import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Shield, Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuth } from "@hooks/useAuth";
import useAuthStore from "@stores/authStore";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@components/ui/card";
import { Alert, AlertDescription } from "@components/ui/alert";
import { Separator } from "@components/ui/separator";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const { handleLogin, isLoading, error, clearError } = useAuth();
    const navigate = useNavigate();

    const formSubmitHandler = async (e) => {
        e.preventDefault();

        const result = await handleLogin(email, password);

        if (result.success) {
            // Clear form
            setEmail("");
            setPassword("");

            if (result.success) {
                // Clear form
                setEmail("");
                setPassword("");

                console.log("Login successful:", result.data);

                const userRole = result.data.user.role;
                const firmHasActiveSubscription =
                    result.data.user.hasActiveSubscription;

                    console.log(result.data.user);

                console.log("User role:", userRole);
                console.log(
                    "Firm has active subscription:",
                    firmHasActiveSubscription,
                );

                if (
                    !firmHasActiveSubscription &&
                    (userRole === "lawyer" || userRole === "paralegal")
                ) {
                    // Only staff & admin get asked to subscribe
                    console.log("Redirecting to subscription page");
                    navigate("/subscribe");
                } else {
                    switch (userRole) {
                        case "admin":
                            navigate("/admin");
                            break;
                        case "lawyer":
                        case "paralegal":
                            navigate("/staff");
                            break;
                        case "client":
                            navigate("/client");
                            break;
                        default:
                            // If the role is unknown or not handled, navigate to a default page
                            navigate("/unauthorize");
                            break;
                    }
                }
            }
        }
        // Error handling is managed by the store
    };

    // Clear error when user starts typing
    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        if (error) clearError();
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        if (error) clearError();
    };

    const handleGoogleLogin = () => {
        window.location.href = "http://localhost:3000/api/auth/google";
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1 text-center">
                    <div className="flex justify-center mb-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                            <Shield className="h-6 w-6" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold">
                        Welcome back
                    </CardTitle>
                    <CardDescription>
                        Sign in to your LawMate account to continue
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {error && (
                        <Alert variant="destructive">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    <form onSubmit={formSubmitHandler} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email address</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                required
                                autoComplete="email"
                                value={email}
                                onChange={handleEmailChange}
                                disabled={isLoading}
                                placeholder="Enter your email"
                                className="w-full"
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">Password</Label>
                                <Link
                                    to="#"
                                    className="text-sm text-primary hover:underline"
                                >
                                    Forgot password?
                                </Link>
                            </div>
                            <div className="relative">
                                <Input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    autoComplete="current-password"
                                    value={password}
                                    onChange={handlePasswordChange}
                                    disabled={isLoading}
                                    placeholder="Enter your password"
                                    className="w-full pr-10"
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    disabled={isLoading}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4 text-gray-400" />
                                    ) : (
                                        <Eye className="h-4 w-4 text-gray-400" />
                                    )}
                                </Button>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Signing in...
                                </>
                            ) : (
                                "Sign in"
                            )}
                        </Button>
                    </form>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <Separator className="w-full" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">
                                Or continue with
                            </span>
                        </div>
                    </div>

                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleGoogleLogin}
                        disabled={isLoading}
                        className="w-full bg-transparent"
                    >
                        <img
                            src="https://www.svgrepo.com/show/475656/google-color.svg"
                            alt="Google"
                            className="mr-2 h-4 w-4"
                        />
                        Sign in with Google
                    </Button>

                    <div className="text-center text-sm text-muted-foreground">
                        Don't have an account?{" "}
                        <Link
                            to="/signup"
                            className="font-medium text-primary hover:underline"
                        >
                            Sign up
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
