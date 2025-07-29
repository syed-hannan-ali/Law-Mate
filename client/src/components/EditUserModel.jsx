import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@components/ui/dialog";
import { Input } from "@components/ui/input";
import { Button } from "@components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@components/ui/select";
import { useState, useEffect } from "react";

// Predefined roles
const roles = ["admin", "lawyer", "client", "paralegal"];

export default function EditUserModal({
    open,
    onClose,
    user,
    onSave,
    firms = [],
}) {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        role: "",
        firm: null,
    });

    useEffect(() => {
        if (user) {
            setFormData({
                username: user.username || "",
                email: user.email || "",
                role: user.role || "",
                firm: user.firm?._id || null,
            });
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit User</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        placeholder="Full Name"
                    />
                    <Input
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Email"
                    />

                    {/* Role Select */}
                    <Select
                        value={formData.role}
                        onValueChange={(val) =>
                            setFormData((prev) => ({ ...prev, role: val }))
                        }
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select Role" />
                        </SelectTrigger>
                        <SelectContent>
                            {roles.map((r) => (
                                <SelectItem key={r} value={r}>
                                    {r.charAt(0).toUpperCase() + r.slice(1)}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {/* Firm Select */}
                    <Select
                        value={formData.firm}
                        onValueChange={(val) =>
                            setFormData((prev) => ({ ...prev, firm: val }))
                        }
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select Law Firm" />
                        </SelectTrigger>
                        <SelectContent>
                            {firms.map((firm) => (
                                <SelectItem key={firm._id} value={firm._id}>
                                    {firm.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Button type="submit" className="w-full">
                        Save Changes
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
