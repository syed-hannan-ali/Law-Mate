// "use client"

import { useState } from "react";
import {
    Search,
    Shield,
    User,
    FileText,
    Trash2,
    Edit,
    Plus,
} from "lucide-react";
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
import { Badge } from "@components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/avatar";

const auditLogs = [
    {
        id: 1,
        timestamp: "2024-01-15 14:30:25",
        user: "Super Admin",
        userEmail: "admin@lawmate.com",
        action: "User Created",
        target: "john.smith@smithlaw.com",
        details: "New lawyer account created for Smith & Associates",
        ipAddress: "192.168.1.100",
        userAgent: "Chrome 120.0.0.0",
    },
    {
        id: 2,
        timestamp: "2024-01-15 14:25:12",
        user: "Sarah Wilson",
        userEmail: "sarah@wilsonlaw.com",
        action: "Case Updated",
        target: "CASE-001",
        details: "Case status changed from 'Open' to 'In Progress'",
        ipAddress: "192.168.1.101",
        userAgent: "Firefox 121.0.0.0",
    },
    {
        id: 3,
        timestamp: "2024-01-15 14:20:45",
        user: "John Davis",
        userEmail: "john@davislaw.com",
        action: "Document Deleted",
        target: "contract_v2.pdf",
        details: "Document removed from Case #CASE-002",
        ipAddress: "192.168.1.102",
        userAgent: "Safari 17.2.1",
    },
    {
        id: 4,
        timestamp: "2024-01-15 14:15:33",
        user: "Emily Brown",
        userEmail: "emily@brownlegal.com",
        action: "Firm Updated",
        target: "Brown Legal",
        details: "Firm contact information updated",
        ipAddress: "192.168.1.103",
        userAgent: "Chrome 120.0.0.0",
    },
    {
        id: 5,
        timestamp: "2024-01-15 14:10:18",
        user: "Super Admin",
        userEmail: "admin@lawmate.com",
        action: "User Deactivated",
        target: "inactive@example.com",
        details: "User account deactivated due to inactivity",
        ipAddress: "192.168.1.100",
        userAgent: "Chrome 120.0.0.0",
    },
];

const actionIcons = {
    "User Created": Plus,
    "User Updated": Edit,
    "User Deactivated": User,
    "Case Updated": FileText,
    "Case Created": Plus,
    "Document Deleted": Trash2,
    "Document Uploaded": Plus,
    "Firm Updated": Edit,
    "Firm Created": Plus,
};

const actionColors = {
    "User Created": "default",
    "User Updated": "secondary",
    "User Deactivated": "destructive",
    "Case Updated": "default",
    "Case Created": "default",
    "Document Deleted": "destructive",
    "Document Uploaded": "default",
    "Firm Updated": "secondary",
    "Firm Created": "default",
};

export function AuditLogs() {
    const [searchTerm, setSearchTerm] = useState("");
    const [actionFilter, setActionFilter] = useState("all");
    const [userFilter, setUserFilter] = useState("all");

    const filteredLogs = auditLogs.filter((log) => {
        const matchesSearch =
            log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.target.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.details.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesAction =
            actionFilter === "all" ||
            log.action.toLowerCase().replace(" ", "") === actionFilter;
        const matchesUser =
            userFilter === "all" ||
            log.user.toLowerCase().replace(" ", "") === userFilter;

        return matchesSearch && matchesAction && matchesUser;
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Audit Logs
                    </h1>
                    <p className="text-muted-foreground">
                        Track all platform-level activities and changes
                    </p>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Activities
                        </CardTitle>
                        <Shield className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">12,456</div>
                        <p className="text-xs text-muted-foreground">
                            All time
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Today's Activities
                        </CardTitle>
                        <Shield className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">89</div>
                        <p className="text-xs text-muted-foreground">
                            +12% from yesterday
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Active Users
                        </CardTitle>
                        <User className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">234</div>
                        <p className="text-xs text-muted-foreground">
                            Last 24 hours
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Critical Actions
                        </CardTitle>
                        <Shield className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">7</div>
                        <p className="text-xs text-muted-foreground">
                            Requiring attention
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Activity Log</CardTitle>
                    <div className="flex items-center space-x-2">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Search activities..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                        <Select
                            value={actionFilter}
                            onValueChange={setActionFilter}
                        >
                            <SelectTrigger className="w-[160px]">
                                <SelectValue placeholder="Action Type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Actions</SelectItem>
                                <SelectItem value="usercreated">
                                    User Created
                                </SelectItem>
                                <SelectItem value="userupdated">
                                    User Updated
                                </SelectItem>
                                <SelectItem value="caseupdated">
                                    Case Updated
                                </SelectItem>
                                <SelectItem value="documentdeleted">
                                    Document Deleted
                                </SelectItem>
                            </SelectContent>
                        </Select>
                        <Select
                            value={userFilter}
                            onValueChange={setUserFilter}
                        >
                            <SelectTrigger className="w-[160px]">
                                <SelectValue placeholder="User" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Users</SelectItem>
                                <SelectItem value="superadmin">
                                    Super Admin
                                </SelectItem>
                                <SelectItem value="sarahwilson">
                                    Sarah Wilson
                                </SelectItem>
                                <SelectItem value="johndavis">
                                    John Davis
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Timestamp</TableHead>
                                <TableHead>User</TableHead>
                                <TableHead>Action</TableHead>
                                <TableHead>Target</TableHead>
                                <TableHead>Details</TableHead>
                                <TableHead>IP Address</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredLogs.map((log) => {
                                const ActionIcon =
                                    actionIcons[log.action] || Shield;
                                return (
                                    <TableRow key={log.id}>
                                        <TableCell className="font-mono text-sm">
                                            {log.timestamp}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center space-x-2">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarImage
                                                        src="/placeholder.svg?height=32&width=32"
                                                        alt={log.user}
                                                    />
                                                    <AvatarFallback>
                                                        {log.user
                                                            .split(" ")
                                                            .map((n) => n[0])
                                                            .join("")}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <div className="font-medium">
                                                        {log.user}
                                                    </div>
                                                    <div className="text-sm text-muted-foreground">
                                                        {log.userEmail}
                                                    </div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center space-x-2">
                                                <ActionIcon className="h-4 w-4" />
                                                <Badge
                                                    variant={
                                                        actionColors[log.action]
                                                    }
                                                >
                                                    {log.action}
                                                </Badge>
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-mono text-sm">
                                            {log.target}
                                        </TableCell>
                                        <TableCell className="max-w-md">
                                            <div
                                                className="truncate"
                                                title={log.details}
                                            >
                                                {log.details}
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-mono text-sm">
                                            {log.ipAddress}
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
