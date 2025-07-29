import { Home, ArrowLeft, Mail } from "lucide-react";
import { Button } from "@components/ui/button";
import { Card, CardContent } from "@components/ui/card";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardContent className="pt-6">
                    <div className="text-center space-y-6">
                        {/* 404 Illustration */}
                        <div className="mx-auto w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center">
                            <span className="text-4xl font-bold text-primary">
                                404
                            </span>
                        </div>

                        {/* Error Message */}
                        <div className="space-y-2">
                            <h1 className="text-2xl font-bold text-gray-900">
                                Page not found
                            </h1>
                            <p className="text-gray-600">
                                Sorry, we couldn't find the page you're looking
                                for. The page might have been moved, deleted, or
                                you entered the wrong URL.
                            </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-3">
                            <Button asChild className="w-full">
                                <a href="/">
                                    <Home className="mr-2 h-4 w-4" />
                                    Go back home
                                </a>
                            </Button>
                            <Button
                                variant="outline"
                                asChild
                                className="w-full bg-transparent"
                            >
                                <a href="javascript:history.back()">
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Go back
                                </a>
                            </Button>
                        </div>

                        {/* Support Link */}
                        <div className="pt-4 border-t">
                            <p className="text-sm text-gray-500 mb-2">
                                Need help?
                            </p>
                            <Button variant="ghost" size="sm" asChild>
                                <a href="#contact">
                                    <Mail className="mr-2 h-4 w-4" />
                                    Contact support
                                </a>
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
