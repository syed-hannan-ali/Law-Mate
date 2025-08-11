// components/FirmForm.jsx
import { useState, useEffect } from "react";
import { Input } from "@components/ui/input";
import { Button } from "@components/ui/button";
import { toast } from "sonner";
import axios from "@config/axios";
import { getAllPlans } from "@services/subscription-service";


export default function FirmForm({ firm = null, onSuccess }) {
    const [plans, setPlans] = useState([]);

    const [formData, setFormData] = useState({
        name: "",
        address: "",
        email: "",
        phone: "",
        owner: null, // Assuming owner is set elsewhere, e.g., from context or props
    });

    useEffect(() => {
        async function fetchPlans() {
            const res = await getAllPlans();
            setPlans(res.data);
        }
        fetchPlans();
        console.log("Plans are : " , plans)
    }, []);

    useEffect(() => {
        if (firm) setFormData(firm);
    }, [firm]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (firm) {
                // Edit
                await axios.put(`/firms/${firm._id}`, formData);
                toast.success("Firm updated!");
            } else {
                // Add
                await axios.post("/firms", formData);
                toast.success("Firm created!");
            }

            onSuccess?.(); // Refresh list or close modal
        } catch (error) {
            toast.error(error.response?.data?.error || "Something went wrong");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Input
                name="name"
                placeholder="Firm Name"
                value={formData.name}
                onChange={handleChange}
                required
            />
            <Input
                name="address"
                placeholder="Address"
                value={formData.address}
                onChange={handleChange}
            />
            <Input
                name="email"
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
            />
            <Input
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
            />
            <select
                name="subscriptionPlan"
                value={formData.subscriptionPlan || ""}
                onChange={handleChange}
                className="w-full border p-2 rounded-md"
            >
                <option value="">Select a plan</option>
                {plans.map((plan) => (
                    <option key={plan._id} value={plan._id}>
                        {plan.name} (${plan.price / 100}) -{" "}
                        {plan.durationInDays} days
                    </option>
                ))}
            </select>
            <Button type="submit">{firm ? "Update Firm" : "Add Firm"}</Button>
        </form>
    );
}
