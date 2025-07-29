import { useState } from "react";
import {
    Plus,
    Search,
    CheckSquare,
    Clock,
    AlertTriangle,
    User,
    MoreHorizontal,
    Edit,
    Trash2,
} from "lucide-react";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@components/ui/dropdown-menu";
import { Badge } from "@components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/avatar";

const tasks = [
    {
        id: 1,
        title: "Verify new law firm registration",
        description:
            "Review and approve Smith & Associates registration documents",
        assignedTo: "Super Admin",
        priority: "High",
        status: "To-do",
        dueDate: "2024-01-18",
        createdDate: "2024-01-15",
        category: "Verification",
    },
    {
        id: 2,
        title: "Review uploaded contract document",
        description: "Check contract_v3.pdf for compliance and accuracy",
        assignedTo: "Legal Reviewer",
        priority: "Medium",
        status: "In Progress",
        dueDate: "2024-01-20",
        createdDate: "2024-01-14",
        category: "Document Review",
    },
    {
        id: 3,
        title: "Process payment dispute",
        description: "Investigate payment issue for Invoice INV-003",
        assignedTo: "Finance Team",
        priority: "High",
        status: "To-do",
        dueDate: "2024-01-17",
        createdDate: "2024-01-15",
        category: "Finance",
    },
    {
        id: 4,
        title: "Update platform documentation",
        description: "Add new features to user manual and help center",
        assignedTo: "Technical Writer",
        priority: "Low",
        status: "Done",
        dueDate: "2024-01-16",
        createdDate: "2024-01-10",
        category: "Documentation",
    },
];

const statusColors = {
    "To-do": "outline",
    "In Progress": "secondary",
    Done: "default",
};

const priorityColors = {
    High: "destructive",
    Medium: "default",
    Low: "secondary",
};

export function TaskManagement() {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [priorityFilter, setPriorityFilter] = useState("all");

    const filteredTasks = tasks.filter((task) => {
        const matchesSearch =
            task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            task.assignedTo.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus =
            statusFilter === "all" ||
            task.status.toLowerCase().replace(" ", "").replace("-", "") ===
                statusFilter;
        const matchesPriority =
            priorityFilter === "all" ||
            task.priority.toLowerCase() === priorityFilter;

        return matchesSearch && matchesStatus && matchesPriority;
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Task Management
                    </h1>
                    <p className="text-muted-foreground">
                        Manage internal tasks and assignments across the
                        platform
                    </p>
                </div>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Task
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Tasks
                        </CardTitle>
                        <CheckSquare className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">247</div>
                        <p className="text-xs text-muted-foreground">
                            +12 new this week
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            In Progress
                        </CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">89</div>
                        <p className="text-xs text-muted-foreground">
                            36% of total
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            High Priority
                        </CardTitle>
                        <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">23</div>
                        <p className="text-xs text-muted-foreground">
                            Require attention
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Completion Rate
                        </CardTitle>
                        <CheckSquare className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">87%</div>
                        <p className="text-xs text-muted-foreground">
                            This month
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Tasks</CardTitle>
                    <div className="flex items-center space-x-2">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Search tasks..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                        <Select
                            value={statusFilter}
                            onValueChange={setStatusFilter}
                        >
                            <SelectTrigger className="w-[140px]">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="todo">To-do</SelectItem>
                                <SelectItem value="inprogress">
                                    In Progress
                                </SelectItem>
                                <SelectItem value="done">Done</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select
                            value={priorityFilter}
                            onValueChange={setPriorityFilter}
                        >
                            <SelectTrigger className="w-[140px]">
                                <SelectValue placeholder="Priority" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">
                                    All Priority
                                </SelectItem>
                                <SelectItem value="high">High</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="low">Low</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Task</TableHead>
                                <TableHead>Assigned To</TableHead>
                                <TableHead>Priority</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Due Date</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead className="text-right">
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredTasks.map((task) => (
                                <TableRow key={task.id}>
                                    <TableCell className="font-medium">
                                        <div>
                                            <div className="font-medium">
                                                {task.title}
                                            </div>
                                            <div className="text-sm text-muted-foreground max-w-md truncate">
                                                {task.description}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center space-x-2">
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage
                                                    src="/placeholder.svg?height=32&width=32"
                                                    alt={task.assignedTo}
                                                />
                                                <AvatarFallback>
                                                    {task.assignedTo
                                                        .split(" ")
                                                        .map((n) => n[0])
                                                        .join("")}
                                                </AvatarFallback>
                                            </Avatar>
                                            <span>{task.assignedTo}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={
                                                priorityColors[task.priority]
                                            }
                                        >
                                            {task.priority}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={statusColors[task.status]}
                                        >
                                            {task.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{task.dueDate}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline">
                                            {task.category}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    className="h-8 w-8 p-0"
                                                >
                                                    <span className="sr-only">
                                                        Open menu
                                                    </span>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>
                                                    Actions
                                                </DropdownMenuLabel>
                                                <DropdownMenuItem>
                                                    <Edit className="mr-2 h-4 w-4" />
                                                    Edit Task
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <User className="mr-2 h-4 w-4" />
                                                    Reassign
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem>
                                                    Update Status
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="text-red-600">
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Delete Task
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
