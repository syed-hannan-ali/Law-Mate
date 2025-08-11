// src/pages/PaymentSuccess.jsx

import axios from "@config/axios";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function PaymentSuccess() {
    const navigate = useNavigate();

    const plan = JSON.parse(localStorage.getItem("selectedPlan"));
    console.log("Selected plan:", plan);

    const sendPlan = async () => {
        try {
            const response = await axios.post("/stripe/success", { plan });
            console.log("Plan sent:", response.data);
            // Optionally, you can clear the local storage after sending the plan
            localStorage.removeItem("selectedPlan");
            navigate("/");
        } catch (error) {
            console.error("Error sending plan:", error);
        }
    };

    useEffect(() => {
        if (plan) {
            sendPlan();
        }
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
                <h1 className="text-2xl font-bold text-green-600 mb-4">
                    Payment Successful 🎉
                </h1>
            </div>
        </div>
    );
}
