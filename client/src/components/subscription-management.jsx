import {
    Plus,
    CreditCard,
    Edit,
    Trash2,
    MoreHorizontal
} from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@components/ui/dialog";

import { toast } from "sonner";
import SubscriptionForm from "@components/Subscription-Form";
import {
    getAllPlans,
    deletePlan
} from "@services/subscription-service";

export function SubscriptionManagement() {
    const [plans, setPlans] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingPlan, setEditingPlan] = useState(null);

    useEffect(() => {
        fetchPlans();
    }, []);

    const fetchPlans = async () => {
        try {
            const res = await getAllPlans();
            setPlans(res.data);
        } catch (err) {
            toast.error("Failed to load subscription plans");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this plan?")) return;

        try {
            await deletePlan(id);
            toast.success("Subscription plan deleted successfully");
            setPlans((prev) => prev.filter((p) => p._id !== id));
        } catch (err) {
            toast.error("Failed to delete plan");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Subscription Plans
                    </h1>
                    <p className="text-muted-foreground">
                        Manage all available subscription plans for firms
                    </p>
                </div>
                <Button
                    onClick={() => {
                        setEditingPlan(null);
                        setShowForm(true);
                    }}
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Plan
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {plans.map((plan) => (
                    <Card key={plan._id}>
                        <CardHeader className="flex flex-row justify-between items-start space-y-0 pb-2">
                            <CardTitle className="text-lg font-semibold">
                                {plan.name}
                            </CardTitle>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                        <span className="sr-only">Open menu</span>
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                    <DropdownMenuItem
                                        onClick={() => {
                                            setEditingPlan(plan);
                                            setShowForm(true);
                                        }}
                                    >
                                        <Edit className="mr-2 h-4 w-4" />
                                        Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        onClick={() => handleDelete(plan._id)}
                                        className="text-red-600"
                                    >
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Delete
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">${(plan.price / 100).toFixed(2)}</div>
                            <p className="text-sm text-muted-foreground">
                                Duration: {plan.durationInDays} days
                            </p>
                            <ul className="mt-2 list-disc list-inside text-sm">
                                {plan.features.map((f, i) => (
                                    <li key={i}>
                                        {f.key}: {String(f.value)}
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Dialog open={showForm} onOpenChange={setShowForm}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>
                            {editingPlan ? "Edit Subscription Plan" : "Add Subscription Plan"}
                        </DialogTitle>
                        <DialogDescription>
                            {editingPlan
                                ? "Update the details of the subscription plan."
                                : "Fill in the details to create a new plan."}
                        </DialogDescription>
                    </DialogHeader>

                    <SubscriptionForm
                        mode={editingPlan ? "edit" : "add"}
                        plan={editingPlan}
                        onSuccess={() => {
                            fetchPlans();
                            setShowForm(false);
                        }}
                        onClose={() => setShowForm(false)}
                    />
                </DialogContent>
            </Dialog>
        </div>
    );
}