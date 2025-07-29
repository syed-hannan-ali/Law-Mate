// "use client"

import { useState } from "react";
import {
    Plus,
    Search,
    Calendar,
    Clock,
    User,
    MoreHorizontal,
    Edit,
    X,
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
import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/avatar";

const appointments = [
    {
        id: 1,
        title: "Case Review Meeting",
        client: "Robert Johnson",
        lawyer: "Sarah Wilson",
        date: "2024-01-16",
        time: "10:00 AM",
        duration: "1 hour",
        status: "Scheduled",
        type: "In-Person",
        location: "Wilson Law Group Office",
    },
    {
        id: 2,
        title: "Initial Consultation",
        client: "Mary Smith",
        lawyer: "John Davis",
        date: "2024-01-16",
        time: "2:00 PM",
        duration: "30 minutes",
        status: "Confirmed",
        type: "Video Call",
        location: "Zoom Meeting",
    },
    {
        id: 3,
        title: "Contract Signing",
        client: "TechCorp Inc.",
        lawyer: "Emily Brown",
        date: "2024-01-17",
        time: "9:00 AM",
        duration: "45 minutes",
        status: "Pending",
        type: "In-Person",
        location: "Brown Legal Office",
    },
];

const statusColors = {
    Scheduled: "default",
    Confirmed: "secondary",
    Pending: "outline",
    Cancelled: "destructive",
    Completed: "secondary",
};

export function AppointmentManagement() {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredAppointments = appointments.filter(
        (appointment) =>
            appointment.title
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            appointment.client
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            appointment.lawyer.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Appointment Management
                    </h1>
                    <p className="text-muted-foreground">
                        Manage all appointments and consultations across the
                        platform
                    </p>
                </div>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Schedule Appointment
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Today's Appointments
                        </CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">156</div>
                        <p className="text-xs text-muted-foreground">
                            +5% from yesterday
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            This Week
                        </CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">892</div>
                        <p className="text-xs text-muted-foreground">
                            Scheduled appointments
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Pending Confirmation
                        </CardTitle>
                        <User className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">23</div>
                        <p className="text-xs text-muted-foreground">
                            Awaiting client response
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Completion Rate
                        </CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">94.2%</div>
                        <p className="text-xs text-muted-foreground">
                            This month
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Upcoming Appointments</CardTitle>
                    <div className="flex items-center space-x-2">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Search appointments..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Appointment</TableHead>
                                <TableHead>Client</TableHead>
                                <TableHead>Lawyer</TableHead>
                                <TableHead>Date & Time</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredAppointments.map((appointment) => (
                                <TableRow key={appointment.id}>
                                    <TableCell className="font-medium">
                                        <div>
                                            <div className="font-medium">
                                                {appointment.title}
                                            </div>
                                            <div className="text-sm text-muted-foreground">
                                                {appointment.duration} •{" "}
                                                {appointment.location}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center space-x-2">
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage
                                                    src="/placeholder.svg?height=32&width=32"
                                                    alt={appointment.client}
                                                />
                                                <AvatarFallback>
                                                    {appointment.client
                                                        .split(" ")
                                                        .map((n) => n[0])
                                                        .join("")}
                                                </AvatarFallback>
                                            </Avatar>
                                            <span>{appointment.client}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>{appointment.lawyer}</TableCell>
                                    <TableCell>
                                        <div>
                                            <div className="font-medium">
                                                {appointment.date}
                                            </div>
                                            <div className="text-sm text-muted-foreground">
                                                {appointment.time}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">
                                            {appointment.type}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={
                                                statusColors[appointment.status]
                                            }
                                        >
                                            {appointment.status}
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
                                                    Reschedule
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <User className="mr-2 h-4 w-4" />
                                                    Assign Lawyer
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem className="text-red-600">
                                                    <X className="mr-2 h-4 w-4" />
                                                    Cancel
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
