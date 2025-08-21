"use client";

import { useState, useEffect } from "react";
import {
    Play,
    Square,
    Clock,
    Calendar,
    Building,
    Laptop,
    BookOpen,
    Plus,
    X,
} from "lucide-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@components/ui/card";
import { Button } from "@components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@components/ui/select";
import { Input } from "@components/ui/input";
import { Textarea } from "@components/ui/textarea";
import { Checkbox } from "@components/ui/checkbox";
import { Badge } from "@components/ui/badge";
import { Label } from "@components/ui/label";

import { getAllCases } from "@services/case-service";
import { getAllTasks } from "@services/task-service";
import axios from "@config/axios";

const activityTypes = [
    { _id: "research", name: "Legal Research", icon: BookOpen },
    { _id: "drafting", name: "Document Drafting", icon: Laptop },
    { _id: "court", name: "Court Appearance", icon: Building },
    { _id: "meeting", name: "Client Meeting", icon: Calendar },
    { _id: "other", name: "Other", icon: Clock },
];

const TimeTracker = () => {
    const [cases, setCases] = useState([]);
    const [tasks, setTasks] = useState([]);

    const [isTracking, setIsTracking] = useState(false);
    const [startTime, setStartTime] = useState(null);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [selectedCase, setSelectedCase] = useState("");
    const [selectedTask, setSelectedTask] = useState("");
    const [activityType, setActivityType] = useState("research");
    const [description, setDescription] = useState("");
    const [isBillable, setIsBillable] = useState(true);
    const [timeEntries, setTimeEntries] = useState([]);
    const [showManualEntry, setShowManualEntry] = useState(false);
    const [manualHours, setManualHours] = useState(0);
    const [manualMinutes, setManualMinutes] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            console.log("Fetching cases...");
            try {
                const fetchCases = await getAllCases();
                setCases(fetchCases.data);
            } catch (err) {
                console.error("Error fetching cases:", err);
            }
            console.log("Fetching tasks...");
            try {
                const fetchTasks = await getAllTasks();
                setTasks(fetchTasks.data);
            } catch (err) {
                console.error("Error fetching tasks:", err);
            }

            try {
                const fetchEntries = await axios.get("/track-time");
                setTimeEntries(fetchEntries.data);
            } catch (err) {
                console.error("Error fetching time entries:", err);
            }
        };

        fetchData();
    }, []);

    // Timer logic
    useEffect(() => {
        let interval = null;
        if (isTracking) {
            interval = setInterval(() => {
                setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
            }, 1000);
        } else if (!isTracking && elapsedTime !== 0) {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isTracking, elapsedTime, startTime]);

    const startTimer = () => {
        setIsTracking(true);
        setStartTime(Date.now());
    };

    const stopTimer = () => {
        setIsTracking(false);
        // Save the time entry
        const hours = elapsedTime / 3600;
        if (hours > 0) {
            const newEntry = {
                id: Date.now(),
                case: cases.find((c) => c._id == selectedCase),
                task: tasks.find((t) => t._id == selectedTask),
                activityType,
                description,
                hours,
                isBillable,
                date: new Date().toISOString(),
                type: "automatic",
            };
            axios
                .post("/track-time", newEntry)
                .then((response) => {
                    console.log("Time entry added:", response.data);
                    setTimeEntries([response.data, ...timeEntries]);
                })
                .catch((error) => {
                    console.error("Error adding manual time entry:", error);
                });
        }
        setElapsedTime(0);
    };

    const addManualEntry = () => {
        const totalHours = manualHours + manualMinutes / 60;
        if (totalHours > 0) {
            const newEntry = {
                id: Date.now(),
                case: cases.find((c) => c._id == selectedCase),
                task: tasks.find((t) => t._id == selectedTask),
                activityType,
                description,
                hours: totalHours,
                isBillable,
                date: new Date().toISOString(),
                type: "manual",
            };

            axios
                .post("/track-time", newEntry)
                .then((response) => {
                    console.log("Manual time entry added:", response.data);
                    setTimeEntries([response.data, ...timeEntries]);
                })
                .catch((error) => {
                    console.error("Error adding manual time entry:", error);
                });

            setShowManualEntry(false);
            setManualHours(0);
            setManualMinutes(0);
        }
    };

    const formatTime = (seconds) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    const getTotalBillableHours = () => {
        return timeEntries
            .filter((entry) => entry.isBillable)
            .reduce((total, entry) => total + entry.hours, 0)
            .toFixed(2);
    };

    if (!cases || !tasks) {
        return <div>Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-background p-6">
            <div className="max-w-6xl mx-auto space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl">
                            Time Tracking
                        </CardTitle>
                        <CardDescription>
                            Track your time across cases and tasks with
                            precision
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Timer Section */}
                        <Card className="bg-primary/5 border-primary/20">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-lg">
                                        Track Time
                                    </CardTitle>
                                    <div className="text-3xl font-mono font-bold text-primary">
                                        {formatTime(elapsedTime)}
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="case-select">
                                            Case
                                        </Label>
                                        <Select
                                            value={selectedCase}
                                            onValueChange={setSelectedCase}
                                        >
                                            <SelectTrigger id="case-select">
                                                <SelectValue placeholder="Select a case" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {cases.map((caseItem) => (
                                                    <SelectItem
                                                        key={caseItem._id}
                                                        value={caseItem._id.toString()}
                                                    >
                                                        {caseItem.title}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="task-select">
                                            Task
                                        </Label>
                                        <Select
                                            value={selectedTask}
                                            onValueChange={setSelectedTask}
                                            disabled={!selectedCase}
                                        >
                                            <SelectTrigger id="task-select">
                                                <SelectValue placeholder="Select a task" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {tasks
                                                    .filter(
                                                        (task) =>
                                                            task.case?._id ==
                                                            selectedCase,
                                                    )
                                                    .map((task) => (
                                                        <SelectItem
                                                            key={task._id}
                                                            value={task._id.toString()}
                                                        >
                                                            {task.title}
                                                        </SelectItem>
                                                    ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="activity-select">
                                            Activity Type
                                        </Label>
                                        <Select
                                            value={activityType}
                                            onValueChange={setActivityType}
                                        >
                                            <SelectTrigger id="activity-select">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {activityTypes.map((type) => (
                                                    <SelectItem
                                                        key={type.id}
                                                        value={type.id}
                                                    >
                                                        {type.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="flex items-end">
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="billable"
                                                checked={isBillable}
                                                onCheckedChange={setIsBillable}
                                            />
                                            <Label htmlFor="billable">
                                                Billable hours
                                            </Label>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description">
                                        Description
                                    </Label>
                                    <Textarea
                                        id="description"
                                        placeholder="Describe the work performed..."
                                        value={description}
                                        onChange={(e) =>
                                            setDescription(e.target.value)
                                        }
                                        rows={2}
                                    />
                                </div>

                                <div className="flex flex-wrap gap-3">
                                    {!isTracking ? (
                                        <Button
                                            onClick={startTimer}
                                            disabled={
                                                !selectedCase || !selectedTask
                                            }
                                            size="lg"
                                        >
                                            <Play className="h-5 w-5 mr-2" />
                                            Start Tracking
                                        </Button>
                                    ) : (
                                        <Button
                                            onClick={stopTimer}
                                            variant="destructive"
                                            size="lg"
                                        >
                                            <Square className="h-5 w-5 mr-2" />
                                            Stop & Save
                                        </Button>
                                    )}

                                    <Button
                                        onClick={() =>
                                            setShowManualEntry(!showManualEntry)
                                        }
                                        variant="outline"
                                        size="lg"
                                    >
                                        <Clock className="h-5 w-5 mr-2" />
                                        Manual Entry
                                    </Button>
                                </div>

                                {/* Manual Entry Form */}
                                {showManualEntry && (
                                    <Card className="bg-muted/50">
                                        <CardHeader className="pb-3">
                                            <div className="flex justify-between items-center">
                                                <CardTitle className="text-base">
                                                    Add Manual Time Entry
                                                </CardTitle>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() =>
                                                        setShowManualEntry(
                                                            false,
                                                        )
                                                    }
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="flex flex-wrap items-end gap-3">
                                                <div className="space-y-2">
                                                    <Label htmlFor="manual-hours">
                                                        Hours
                                                    </Label>
                                                    <Input
                                                        id="manual-hours"
                                                        type="number"
                                                        min="0"
                                                        className="w-20"
                                                        value={manualHours}
                                                        onChange={(e) =>
                                                            setManualHours(
                                                                Number.parseInt(
                                                                    e.target
                                                                        .value,
                                                                ) || 0,
                                                            )
                                                        }
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="manual-minutes">
                                                        Minutes
                                                    </Label>
                                                    <Input
                                                        id="manual-minutes"
                                                        type="number"
                                                        min="0"
                                                        max="59"
                                                        className="w-20"
                                                        value={manualMinutes}
                                                        onChange={(e) =>
                                                            setManualMinutes(
                                                                Number.parseInt(
                                                                    e.target
                                                                        .value,
                                                                ) || 0,
                                                            )
                                                        }
                                                    />
                                                </div>
                                                <Button
                                                    onClick={addManualEntry}
                                                >
                                                    <Plus className="h-4 w-4 mr-1" />
                                                    Add Entry
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}
                            </CardContent>
                        </Card>

                        {/* Summary */}
                        <Card className="bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800">
                            <CardContent className="pt-6">
                                <div className="flex justify-between items-center">
                                    <CardTitle className="text-base font-medium">
                                        Today's Billable Hours
                                    </CardTitle>
                                    <span className="text-2xl font-bold text-green-700 dark:text-green-400">
                                        {getTotalBillableHours()} hours
                                    </span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Time Entries List */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-lg">
                                    Recent Time Entries
                                </CardTitle>
                            </div>

                            {timeEntries.length === 0 ? (
                                <Card>
                                    <CardContent className="text-center py-12">
                                        <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                                        <p className="text-muted-foreground">
                                            No time entries yet. Start tracking
                                            your time!
                                        </p>
                                    </CardContent>
                                </Card>
                            ) : (
                                <div className="space-y-3">
                                    {timeEntries.map((entry) => {
                                        const ActivityIcon =
                                            activityTypes.find(
                                                (t) =>
                                                    t._id ===
                                                    entry.activityType,
                                            )?.icon || Clock;
                                        return (
                                            <Card key={entry._id}>
                                                <CardContent className="pt-6">
                                                    <div className="flex justify-between items-start">
                                                        <div className="flex items-start space-x-3">
                                                            <ActivityIcon className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                                                            <div className="space-y-1">
                                                                <h3 className="font-medium">
                                                                    {
                                                                        entry
                                                                            .case
                                                                            ?.title
                                                                    }{" "}
                                                                    (
                                                                    {
                                                                        entry
                                                                            .task
                                                                            ?.title
                                                                    }
                                                                    )
                                                                </h3>
                                                                <p className="text-sm text-muted-foreground">
                                                                    {
                                                                        entry.description
                                                                    }
                                                                </p>
                                                                <div className="flex items-center gap-2">
                                                                    <Badge
                                                                        variant={
                                                                            entry.isBillable
                                                                                ? "default"
                                                                                : "secondary"
                                                                        }
                                                                    >
                                                                        {entry.isBillable
                                                                            ? "Billable"
                                                                            : "Non-billable"}
                                                                    </Badge>
                                                                    <span className="text-xs text-muted-foreground">
                                                                        {new Date(
                                                                            entry.date,
                                                                        ).toLocaleDateString()}{" "}
                                                                        •{" "}
                                                                        {entry.type ===
                                                                        "manual"
                                                                            ? "Manual entry"
                                                                            : "Auto-tracked"}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <span className="font-semibold text-primary">
                                                                {entry.hours.toFixed(
                                                                    2,
                                                                )}{" "}
                                                                hours
                                                            </span>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default TimeTracker;
