import { useEffect, useState } from "react";
import { Input } from "@components/ui/input";
import { Button } from "@components/ui/button";
import { Label } from "@components/ui/label";
import { toast } from "sonner";
import { createPlan, updatePlan } from "@services/subscription-service";

export default function SubscriptionForm({ mode, plan, onSuccess, onClose }) {
    const [formData, setFormData] = useState({
        name: "",
        price: "",
        durationInDays: "",
        stripeId: "",
        features: [],
    });
    const [featureKey, setFeatureKey] = useState("");
    const [featureValue, setFeatureValue] = useState("");

    useEffect(() => {
        if (mode === "edit" && plan) {
            setFormData({
                name: plan.name,
                price: plan.price,
                durationInDays: plan.durationInDays,
                stripeId: plan.stripeId,
                features: plan.features || [],
            });
        }
    }, [mode, plan]);

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const addFeature = () => {
        if (!featureKey) return;
        const parsedValue =
            featureValue === "true" || featureValue === "false"
                ? featureValue === "true"
                : isNaN(Number(featureValue))
                  ? featureValue
                  : Number(featureValue);

        setFormData((prev) => ({
            ...prev,
            features: [
                ...prev.features,
                { key: featureKey, value: parsedValue },
            ],
        }));
        setFeatureKey("");
        setFeatureValue("");
    };

    const removeFeature = (index) => {
        setFormData((prev) => ({
            ...prev,
            features: prev.features.filter((_, i) => i !== index),
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Form Data:", formData);
        try {
            if (mode === "edit") {
                await updatePlan(plan._id, formData);
                toast.success("Plan updated successfully");
            } else {
                await createPlan(formData);
                toast.success("Plan created successfully");
            }
            onSuccess();
        } catch (err) {
            toast.error("Failed to save plan");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <Label>Name</Label>
                <Input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <Label>Price (in cents)</Label>
                <Input
                    name="price"
                    type="number"
                    value={formData.price}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <Label>Duration (days)</Label>
                <Input
                    name="durationInDays"
                    type="number"
                    value={formData.durationInDays}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <Label>Stripe ID</Label>
                <Input
                    name="stripeId"
                    value={formData.stripeId}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <Label>Add Feature</Label>
                <div className="flex gap-2">
                    <Input
                        placeholder="key"
                        value={featureKey}
                        onChange={(e) => setFeatureKey(e.target.value)}
                    />
                    <Input
                        placeholder="value"
                        value={featureValue}
                        onChange={(e) => setFeatureValue(e.target.value)}
                    />
                    <Button type="button" onClick={addFeature}>
                        Add
                    </Button>
                </div>
            </div>
            <div className="space-y-1">
                {formData.features.map((f, i) => (
                    <div
                        key={i}
                        className="flex justify-between items-center border rounded p-2"
                    >
                        <span>
                            {f.key}: {String(f.value)}
                        </span>
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFeature(i)}
                        >
                            Remove
                        </Button>
                    </div>
                ))}
            </div>
            <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={onClose}>
                    Cancel
                </Button>
                <Button type="submit">
                    {mode === "edit" ? "Update" : "Create"}
                </Button>
            </div>
        </form>
    );
}
