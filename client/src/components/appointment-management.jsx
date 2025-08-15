// "use client"

import { useState, useEffect } from "react";
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
import axiosInstance from "@config/axios";
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
import { ScheduleAppointmentDialog } from "@components/schedule-appointment-dialog";
import { toast } from "sonner";

const statusColors = {
    Scheduled: "default",
    Confirmed: "secondary",
    Pending: "outline",
    Cancelled: "destructive",
    Completed: "secondary",
};

export function AppointmentManagement() {
    const [searchTerm, setSearchTerm] = useState("");
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showScheduleDialog, setShowScheduleDialog] = useState(false);

    // Fetch appointments from backend
    const fetchAppointments = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get('/appointments');
            setAppointments(response.data);
            setError(null);
        } catch (err) {
            console.error('Error fetching appointments:', err);
            toast.error('Failed to load appointments');
        } finally {
            setLoading(false);
        }
    };

    // Create new appointment
    const handleCreateAppointment = async (appointmentData) => {
        try {
            const response = await axiosInstance.post('/appointments', appointmentData);
            toast.success('Appointment created successfully');
            setAppointments(prev => [...prev, response.data]);
            console.log('Appointment created successfully:', response.data);
        } catch (err) {
            console.error('Error creating appointment:', err);
            toast.error('Failed to create appointment');
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, []);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const filteredAppointments = appointments.filter(
        (appointment) =>
            appointment.title
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            (appointment.participants &&
                appointment.participants.some(
                    (p) =>
                        p.name
                            .toLowerCase()
                            .includes(searchTerm.toLowerCase()) ||
                        p.email
                            .toLowerCase()
                            .includes(searchTerm.toLowerCase()),
                )),
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
                <Button onClick={() => setShowScheduleDialog(true)}>
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
                    {loading ? (
                        <div className="flex items-center justify-center py-8">
                            <div className="text-muted-foreground">
                                Loading appointments...
                            </div>
                        </div>
                    ) : error ? (
                        <div className="flex items-center justify-center py-8">
                            <div className="text-red-500">Error: {error}</div>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Appointment</TableHead>
                                    <TableHead>Participants</TableHead>
                                    <TableHead>Date & Time</TableHead>
                                    <TableHead>Duration</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">
                                        Actions
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredAppointments.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={6}
                                            className="text-center py-8"
                                        >
                                            No appointments found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredAppointments.map(
                                        (appointment, index) => (
                                            <TableRow
                                                key={appointment._id || index}
                                            >
                                                <TableCell className="font-medium">
                                                    <div>
                                                        <div className="font-medium">
                                                            {appointment.title}
                                                        </div>
                                                        <div className="text-sm text-muted-foreground">
                                                            {
                                                                appointment.description
                                                            }
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center -space-x-3">
                                                        {appointment.participants && appointment.participants.length > 0 ? (
                                                            appointment.participants.map((participant, idx) => (
                                                                <Avatar
                                                                    key={idx}
                                                                    className="h-8 w-8 ring-2 ring-blue"
                                                                    title={`${participant.name} (${participant.email})`}
                                                                >
                                                                    <AvatarImage
                                                                        src="/placeholder.svg"
                                                                        alt={participant.name}
                                                                    />
                                                                    <AvatarFallback>
                                                                        {participant.name
                                                                            ?.split(" ")
                                                                            .map((n) => n[0])
                                                                            .join("")
                                                                            .slice(0, 2)}
                                                                    </AvatarFallback>
                                                                </Avatar>
                                                            ))
                                                        ) : (
                                                            <span className="text-muted-foreground">
                                                                No participants
                                                            </span>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div>
                                                        <div className="font-medium">
                                                            {formatDate(
                                                                appointment.date,
                                                            )}
                                                        </div>
                                                        <div className="text-sm text-muted-foreground">
                                                            {formatTime(
                                                                appointment.date,
                                                            )}
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline">
                                                        {appointment.duration}{" "}
                                                        min
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant={
                                                            statusColors[
                                                                appointment.status ||
                                                                    "Scheduled"
                                                            ]
                                                        }
                                                    >
                                                        {appointment.status ||
                                                            "Scheduled"}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger
                                                            asChild
                                                        >
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
                                                                Edit
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem>
                                                                <User className="mr-2 h-4 w-4" />
                                                                View Details
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
                                        ),
                                    )
                                )}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            <ScheduleAppointmentDialog 
                open={showScheduleDialog}
                onClose={() => setShowScheduleDialog(false)}
                onSubmit={handleCreateAppointment}
            />
        </div>
    );
}
