
import { useState, useEffect } from "react";
import dashboardImage from "@assets/admin-dashboard.png";
import {
    ArrowRight,
    Shield,
    FileText,
    Users,
    Clock,
    CheckCircle,
    Star,
} from "lucide-react";
import Header from "@components/header";
import { Button } from "@components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@components/ui/card";
import { Badge } from "@components/ui/badge";

const features = [
    {
        name: "Secure Document Storage",
        description:
            "Bank-level encryption for all your legal documents with automated backup and version control.",
        icon: FileText,
    },
    {
        name: "Case Management",
        description:
            "Track case progress, deadlines, and milestones with automated notifications and reminders.",
        icon: Shield,
    },
    {
        name: "Team Collaboration",
        description:
            "Seamless collaboration tools for lawyers, paralegals, and clients with role-based access.",
        icon: Users,
    },
    {
        name: "Time Tracking",
        description:
            "Accurate time tracking and billing with detailed reports and client invoicing integration.",
        icon: Clock,
    },
];

const testimonials = [
    {
        name: "Sarah Johnson",
        role: "Partner at Johnson & Associates",
        content:
            "LawMate has transformed how we manage our cases. The document organization alone has saved us hours every week.",
        rating: 5,
    },
    {
        name: "Michael Chen",
        role: "Solo Practitioner",
        content:
            "As a solo lawyer, LawMate gives me the tools of a large firm. The client portal is a game-changer.",
        rating: 5,
    },
];

export default function LegalLandingPage() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    return (
        <div className="bg-white">
            <Header user={user} setUser={setUser} />

            {/* Hero Section */}
            <main className="relative isolate">
                {/* Background gradient */}
                <div
                    aria-hidden="true"
                    className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
                >
                    <div
                        className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#6366f1] to-[#8b5cf6] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
                        style={{
                            clipPath:
                                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
                        }}
                    />
                </div>

                <div className="mx-auto max-w-7xl px-6 pb-24 pt-10 sm:pb-32 lg:flex lg:px-8 lg:py-40">
                    <div className="mx-auto max-w-2xl flex-shrink-0 lg:mx-0 lg:max-w-xl lg:pt-8">
                        <div className="mt-24 sm:mt-32 lg:mt-16">
                            <Badge
                                variant="outline"
                                className="inline-flex items-center space-x-2 text-sm"
                            >
                                <span>✨ New features available</span>
                            </Badge>
                        </div>
                        <h1 className="mt-10 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                            Legal Case & Document Management{" "}
                            <span className="text-primary">Simplified</span>
                        </h1>
                        <p className="mt-6 text-lg leading-8 text-gray-600">
                            Streamline your legal workflows with secure document
                            storage, automated case tracking, and team
                            collaboration — all in one place. Built specifically
                            for modern law firms.
                        </p>
                        <div className="mt-10 flex items-center gap-x-6">
                            <Button size="lg" asChild>
                                <a href="/signup">
                                    Get Started Free
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </a>
                            </Button>
                            <Button variant="ghost" size="lg" asChild>
                                <a href="#features">
                                    Explore Features
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </a>
                            </Button>
                        </div>
                        <div className="mt-10 flex items-center gap-x-6 text-sm text-gray-500">
                            <div className="flex items-center gap-x-2">
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                <span>Free 14-day trial</span>
                            </div>
                            <div className="flex items-center gap-x-2">
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                <span>No credit card required</span>
                            </div>
                        </div>
                    </div>
                    <div className="mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:ml-10 lg:mr-0 lg:mt-0 lg:max-w-none lg:flex-none xl:ml-32">
                        <div className="max-w-3xl flex-none sm:max-w-5xl lg:max-w-none">
                            <img
                                alt="App screenshot"
                                src={dashboardImage}
                                width={800}
                                height={600}
                                className="w-[53rem] rounded-md bg-white/5 shadow-2xl ring-1 ring-white/10"
                            />
                        </div>
                    </div>
                </div>
            </main>

            {/* Features Section */}
            <section id="features" className="py-24 sm:py-32">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl text-center">
                        <h2 className="text-base font-semibold leading-7 text-primary">
                            Everything you need
                        </h2>
                        <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                            Powerful tools for modern law firms
                        </p>
                        <p className="mt-6 text-lg leading-8 text-gray-600">
                            From case management to client communication,
                            LawMate provides all the tools you need to run your
                            practice efficiently.
                        </p>
                    </div>
                    <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
                        <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-2">
                            {features.map((feature) => (
                                <Card
                                    key={feature.name}
                                    className="hover:shadow-lg transition-shadow duration-300"
                                >
                                    <CardHeader>
                                        <div className="flex items-center gap-x-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                                                <feature.icon
                                                    className="h-6 w-6"
                                                    aria-hidden="true"
                                                />
                                            </div>
                                            <CardTitle className="text-base font-semibold leading-7 text-gray-900">
                                                {feature.name}
                                            </CardTitle>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <CardDescription className="text-base leading-7 text-gray-600">
                                            {feature.description}
                                        </CardDescription>
                                    </CardContent>
                                </Card>
                            ))}
                        </dl>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="bg-gray-50 py-24 sm:py-32">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl text-center">
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                            Trusted by legal professionals
                        </h2>
                        <p className="mt-6 text-lg leading-8 text-gray-600">
                            See what lawyers are saying about LawMate
                        </p>
                    </div>
                    <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-2">
                        {testimonials.map((testimonial, index) => (
                            <Card key={index} className="bg-white">
                                <CardContent className="pt-6">
                                    <div className="flex items-center gap-1 mb-4">
                                        {[...Array(testimonial.rating)].map(
                                            (_, i) => (
                                                <Star
                                                    key={i}
                                                    className="h-4 w-4 fill-yellow-400 text-yellow-400"
                                                />
                                            ),
                                        )}
                                    </div>
                                    <blockquote className="text-lg leading-8 text-gray-900">
                                        "{testimonial.content}"
                                    </blockquote>
                                    <div className="mt-6 flex items-center gap-x-4">
                                        <div className="h-10 w-10 rounded-full bg-gray-200" />
                                        <div>
                                            <div className="font-semibold text-gray-900">
                                                {testimonial.name}
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                {testimonial.role}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 sm:py-32">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl text-center">
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                            Ready to transform your practice?
                        </h2>
                        <p className="mt-6 text-lg leading-8 text-gray-600">
                            Join thousands of legal professionals who trust
                            LawMate to manage their cases and documents.
                        </p>
                        <div className="mt-10 flex items-center justify-center gap-x-6">
                            <Button size="lg" asChild>
                                <a href="/signup">Start Free Trial</a>
                            </Button>
                            <Button variant="outline" size="lg" asChild>
                                <a href="#contact">Contact Sales</a>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
