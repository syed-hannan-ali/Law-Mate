import { useState, useEffect } from "react";
import { Input } from "@components/ui/input";
import { Textarea } from "@components/ui/textarea";
import { Button } from "@components/ui/button";
import StaffMultiSelect from "@components/ui/multi-select-checkbox";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@components/ui/select";
import { toast } from "sonner";
import axios from "@config/axios";

const statusOptions = ["open", "in-progress", "closed"];

export default function CaseForm({
    caseData = null,
    onSuccess,
    clients = [],
    staff = [],
}) {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        status: "open",
        client: null,
        assignedStaff: [],
    });

    useEffect(() => {
        if (caseData) {
            setFormData({
                ...caseData,
                status: caseData.status,
                client: caseData.client,
                assignedStaff: caseData.assignedStaff?.map((s) => s._id) || [],
            });
        }
    }, [caseData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (caseData) {
                console.log(formData);
                await axios.put(`/cases/${caseData._id}`, formData);
                toast.success("Case updated!");
            } else {
                console.log(formData);
                await axios.post("/cases", formData);
                toast.success("Case created!");
            }

            onSuccess?.();
        } catch (error) {
            toast.error(error.response?.data?.error || "Something went wrong");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Input
                name="title"
                placeholder="Case Title"
                value={formData.title}
                onChange={handleChange}
                required
            />
            <Textarea
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleChange}
            />

            <Select
                value={formData.status}
                onValueChange={(val) =>
                    setFormData((prev) => ({ ...prev, status: val }))
                }
            >
                <SelectTrigger>
                    <SelectValue placeholder="Select a status" />
                </SelectTrigger>
                <SelectContent>
                    {statusOptions.map((status) => (
                        <SelectItem key={status} value={status}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Select
                value={formData.client?.username}
                onValueChange={(val) =>
                    setFormData((prev) => ({ ...prev, client: val }))
                }
                className="w-full border rounded px-3 py-2"
                required
            >
                <SelectTrigger>
                    <SelectValue placeholder="Select a Client" />
                </SelectTrigger>
                <SelectContent>
                    {clients.map((client) => (
                        <SelectItem key={client._id} value={client._id}>
                            {client.username}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <StaffMultiSelect
                staff={staff}
                selectedStaff={formData.assignedStaff}
                setSelectedStaff={(ids) =>
                    setFormData((prev) => ({ ...prev, assignedStaff: ids }))
                }
            />

            <Button type="submit">
                {caseData ? "Update Case" : "Add Case"}
            </Button>
        </form>
    );
}
