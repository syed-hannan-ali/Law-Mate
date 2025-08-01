import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@components/ui/dialog";
import { Input } from "@components/ui/input";
import { Textarea } from "@components/ui/textarea";
import { Button } from "@components/ui/button";
import { Label } from "@components/ui/label";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@components/ui/select";
import Calendar22 from "@components/ui/calendar-22";
import StaffMultiSelect from "@components/ui/multi-select-checkbox"; // You must build this or use a 3rd-party lib like react-select

export default function AddTaskDialog({
    open,
    onClose,
    onSubmit,
    cases = [],
    users = [],
}) {
    const [taskData, setTaskData] = useState({
        title: "",
        description: "",
        status: "pending",
        priority: "medium",
        dueDate: null,
        case: "",
        assignedTo: [],
    });

    const handleChange = (field, value) => {
        setTaskData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = () => {
        onSubmit(taskData);
        onClose();
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[650px] md:max-w-[720px] lg:max-w-[800px]">
                <DialogHeader>
                    <DialogTitle>Add New Task</DialogTitle>
                    <DialogDescription>
                        Assign a new task to staff or paralegals.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 mt-4">
                    <div>
                        <Label>Title</Label>
                        <Input
                            placeholder="Task title"
                            value={taskData.title}
                            onChange={(e) =>
                                handleChange("title", e.target.value)
                            }
                        />
                    </div>

                    <div>
                        <Label>Description</Label>
                        <Textarea
                            placeholder="Describe the task..."
                            value={taskData.description}
                            onChange={(e) =>
                                handleChange("description", e.target.value)
                            }
                        />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <Label>Status</Label>
                            <Select
                                value={taskData.status}
                                onValueChange={(value) =>
                                    handleChange("status", value)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="pending">
                                        Pending
                                    </SelectItem>
                                    <SelectItem value="in-progress">
                                        In Progress
                                    </SelectItem>
                                    <SelectItem value="completed">
                                        Completed
                                    </SelectItem>
                                    <SelectItem value="cancelled">
                                        Cancelled
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label>Priority</Label>
                            <Select
                                value={taskData.priority}
                                onValueChange={(value) =>
                                    handleChange("priority", value)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Priority" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="urgent">
                                        Urgent
                                    </SelectItem>
                                    <SelectItem value="high">High</SelectItem>
                                    <SelectItem value="medium">
                                        Medium
                                    </SelectItem>
                                    <SelectItem value="low">Low</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label>Due Date</Label>
                            <Calendar22
                                value={taskData.dueDate}
                                onChange={(newDate) =>
                                    setTaskData((prev) => ({
                                        ...prev,
                                        dueDate: newDate,
                                    }))
                                }
                                label="Due Date"
                            />
                        </div>
                    </div>

                    <div>
                        <Label>Case</Label>
                        <Select
                            value={taskData.case}
                            onValueChange={(value) =>
                                handleChange("case", value)
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select a case" />
                            </SelectTrigger>
                            <SelectContent>
                                {cases.map((c) => (
                                    <SelectItem key={c._id} value={c._id}>
                                        {c.title}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label>Assign To</Label>
                        <StaffMultiSelect
                            staff={users}
                            selectedStaff={taskData.assignedTo}
                            setSelectedStaff={(ids) =>
                                setTaskData((prev) => ({
                                    ...prev,
                                    assignedTo: ids,
                                }))
                            }
                        />
                    </div>

                    <Button className="w-full mt-4" onClick={handleSubmit}>
                        Add Task
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
