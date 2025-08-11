import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { getAllPlans } from "@services/subscription-service";
import { loadStripe } from "@stripe/stripe-js";
import { useNavigate } from "react-router-dom";

import axios from "@config/axios";
import Header from "./Header";

const SubscriptionPage = () => {
    const [loading, setLoading] = useState(null);
    const [plans, setPlans] = useState([]);
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const sessionId = searchParams.get("session_id");
        if (sessionId) {
            axios
                .post("/stripe/success", { sessionId })
                .then((res) => {
                    console.log("Subscription verified:", res.data);
                })
                .catch((err) => {
                    console.error("Error verifying subscription:", err);
                });
        }
    }, [searchParams]);

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const res = await getAllPlans();
                setPlans(res.data);
            } catch (err) {
                console.error("Failed to fetch subscription plans", err);
            }
        };
        fetchPlans();
    }, []);

    const handlePlanSelect = async (plan) => {
        setLoading(plan._id);
        const stripe = await loadStripe(
            "pk_test_51Rt6JHFHLlXcTBsrTXyMcgXiJQBaQTUJOKxR8iS5MDTjfEnSzo8LUuds1bwoTnUp7ezrTjaZCSwZj4zS0vH9Gpee00B8zkQ6Zv",
        );

        console.log("Initiating payment for plan:", plan);

        const headers = {
            "content-type": "application/json",
        };

        localStorage.setItem("selectedPlan", JSON.stringify(plan));

        const session = await axios.post(
            "/stripe/create-checkout-session",
            plan,
            {
                headers,
            },
        );

        const result = stripe.redirectToCheckout({
            sessionId: session.data.id,
        });

        console.log(result);

        if (result.error) {
            console.error("Stripe checkout error:", result.error.message);
        }
        setLoading(null);
    };

    const formatPrice = (price) => {
        return price === 0 ? "$0.00" : `$${price / 100}.00`;
    };

    const formatDuration = (durationInDays) => {
        if (durationInDays === 30) return "per month";
        if (durationInDays === 365) return "per year";
        return `per ${durationInDays} days`;
    };

    const formatFeatureText = (feature) => {
        const featureLabels = {
            users: "Users",
            cases: "Cases",
            storage: "Storage",
            support: "Support",
            templates: "Templates",
            analytics: "Analytics",
            api: "API Access",
            integrations: "Integrations",
            sla: "SLA Guarantee",
        };

        const label = featureLabels[feature.key] || feature.key;
        return `${label}: ${feature.value}`;
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <Header />
            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Hero Section */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Choose Your Perfect Plan
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Select the subscription plan that best fits your law
                        firm's needs. Upgrade or downgrade at any time with no
                        long-term commitments.
                    </p>
                </div>

                {/* Pricing Cards */}
                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {plans
                        .filter((plan) => plan.isActive)
                        .map((plan) => (
                            <div
                                key={plan._id}
                                className={`relative bg-white rounded-lg shadow-lg border-2 transition-all duration-200 hover:shadow-xl ${
                                    plan.popular
                                        ? "border-blue-500 transform scale-105"
                                        : "border-gray-200 hover:border-gray-300"
                                }`}
                            >
                                {plan.popular && (
                                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                        <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                                            Most Popular
                                        </span>
                                    </div>
                                )}

                                <div className="p-8">
                                    {/* Plan Header */}
                                    <div className="text-center mb-8">
                                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                            {plan.name}
                                        </h3>
                                        <div className="mb-4">
                                            <span className="text-4xl font-bold text-gray-900">
                                                {formatPrice(plan.price)}
                                            </span>
                                            <span className="text-gray-600 ml-2">
                                                {formatDuration(
                                                    plan.durationInDays,
                                                )}
                                            </span>
                                        </div>
                                        <p className="text-gray-600">
                                            {plan.description}
                                        </p>
                                    </div>

                                    {/* Features List */}
                                    <ul className="space-y-4 mb-8">
                                        {plan.features.map((feature) => (
                                            <li
                                                key={feature._id}
                                                className="flex items-start"
                                            >
                                                <svg
                                                    className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0 text-green-500"
                                                    fill="currentColor"
                                                    viewBox="0 0 20 20"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                                <span className="text-gray-700">
                                                    {formatFeatureText(feature)}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>

                                    {/* CTA Button */}
                                    <button
                                        onClick={() => handlePlanSelect(plan)}
                                        disabled={loading === plan._id}
                                        className={`w-full py-3 px-6 rounded-lg font-semibold text-center transition-all duration-200 ${
                                            plan.popular
                                                ? "bg-blue-600 text-white hover:bg-blue-700 focus:ring-4 focus:ring-blue-200"
                                                : "bg-gray-900 text-white hover:bg-gray-800 focus:ring-4 focus:ring-gray-200"
                                        } ${loading === plan._id ? "opacity-75 cursor-not-allowed" : "hover:transform hover:scale-105"}`}
                                    >
                                        {loading === plan._id ? (
                                            <div className="flex items-center justify-center">
                                                <svg
                                                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <circle
                                                        className="opacity-25"
                                                        cx="12"
                                                        cy="12"
                                                        r="10"
                                                        stroke="currentColor"
                                                        strokeWidth="4"
                                                    ></circle>
                                                    <path
                                                        className="opacity-75"
                                                        fill="currentColor"
                                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                    ></path>
                                                </svg>
                                                Processing...
                                            </div>
                                        ) : (
                                            `Choose ${plan.name}`
                                        )}
                                    </button>
                                </div>
                            </div>
                        ))}
                </div>

                {/* Additional Info */}
                <div className="text-center mt-16">
                    <div className="bg-white rounded-lg shadow-sm border p-8 max-w-4xl mx-auto">
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">
                            Why Choose LawMate?
                        </h3>
                        <div className="grid md:grid-cols-3 gap-8 text-left">
                            <div>
                                <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                                    <svg
                                        className="w-6 h-6 text-green-600"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                        ></path>
                                    </svg>
                                </div>
                                <h4 className="font-semibold text-gray-900 mb-2">
                                    Secure & Compliant
                                </h4>
                                <p className="text-gray-600">
                                    Bank-level security with full compliance for
                                    legal industry standards.
                                </p>
                            </div>
                            <div>
                                <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                                    <svg
                                        className="w-6 h-6 text-blue-600"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M13 10V3L4 14h7v7l9-11h-7z"
                                        ></path>
                                    </svg>
                                </div>
                                <h4 className="font-semibold text-gray-900 mb-2">
                                    Lightning Fast
                                </h4>
                                <p className="text-gray-600">
                                    Optimized performance to handle your busiest
                                    days without slowdown.
                                </p>
                            </div>
                            <div>
                                <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                                    <svg
                                        className="w-6 h-6 text-purple-600"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                        ></path>
                                    </svg>
                                </div>
                                <h4 className="font-semibold text-gray-900 mb-2">
                                    24/7 Support
                                </h4>
                                <p className="text-gray-600">
                                    Round-the-clock assistance from our legal
                                    technology experts.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="mt-16">
                    <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
                        Frequently Asked Questions
                    </h3>
                    <div className="max-w-3xl mx-auto space-y-6">
                        <div className="bg-white rounded-lg shadow-sm border p-6">
                            <h4 className="font-semibold text-gray-900 mb-2">
                                Can I change plans anytime?
                            </h4>
                            <p className="text-gray-600">
                                Yes, you can upgrade or downgrade your plan at
                                any time. Changes take effect immediately.
                            </p>
                        </div>
                        <div className="bg-white rounded-lg shadow-sm border p-6">
                            <h4 className="font-semibold text-gray-900 mb-2">
                                Is there a free trial?
                            </h4>
                            <p className="text-gray-600">
                                Our Basic plan is free forever. For Pro and
                                Enterprise plans, we offer a 14-day free trial.
                            </p>
                        </div>
                        <div className="bg-white rounded-lg shadow-sm border p-6">
                            <h4 className="font-semibold text-gray-900 mb-2">
                                What payment methods do you accept?
                            </h4>
                            <p className="text-gray-600">
                                We accept all major credit cards, PayPal, and
                                ACH transfers for annual subscriptions.
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-gray-900 text-white mt-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="text-center">
                        <div className="bg-white text-black px-3 py-1 rounded text-sm font-semibold inline-block mb-4">
                            LawMate
                        </div>
                        <p className="text-gray-400">
                            © 2025 LawMate. All rights reserved. Streamlining
                            legal workflows for modern law firms.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default SubscriptionPage;
