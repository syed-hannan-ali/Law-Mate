// "use client"

import { useState } from "react";
import {
    Plus,
    Search,
    Building2,
    Users,
    FileText,
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
import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/avatar";

const firms = [
    {
        id: 1,
        name: "Smith & Associates",
        logo: "/placeholder.svg?height=40&width=40",
        size: "Large",
        lawyers: 25,
        cases: 156,
        contact: "john.smith@smithlaw.com",
        phone: "+1 (555) 123-4567",
        status: "Active",
        joinDate: "2023-01-15",
    },
    {
        id: 2,
        name: "Johnson Legal",
        logo: "/placeholder.svg?height=40&width=40",
        size: "Medium",
        lawyers: 12,
        cases: 89,
        contact: "info@johnsonlegal.com",
        phone: "+1 (555) 234-5678",
        status: "Active",
        joinDate: "2023-03-22",
    },
    {
        id: 3,
        name: "Wilson Law Group",
        logo: "/placeholder.svg?height=40&width=40",
        size: "Small",
        lawyers: 5,
        cases: 34,
        contact: "contact@wilsonlaw.com",
        phone: "+1 (555) 345-6789",
        status: "Pending",
        joinDate: "2024-01-10",
    },
];

export function FirmManagement() {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredFirms = firms.filter(
        (firm) =>
            firm.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            firm.contact.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Firm Management
                    </h1>
                    <p className="text-muted-foreground">
                        Manage all registered law firms on the platform
                    </p>
                </div>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Firm
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Firms
                        </CardTitle>
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">247</div>
                        <p className="text-xs text-muted-foreground">
                            +12% from last month
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Active Firms
                        </CardTitle>
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">234</div>
                        <p className="text-xs text-muted-foreground">
                            94.7% of total
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Pending Review
                        </CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">13</div>
                        <p className="text-xs text-muted-foreground">
                            Awaiting approval
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Avg. Lawyers/Firm
                        </CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">7.4</div>
                        <p className="text-xs text-muted-foreground">
                            Per firm
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Law Firms</CardTitle>
                    <div className="flex items-center space-x-2">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Search firms..."
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
                                <TableHead>Firm</TableHead>
                                <TableHead>Size</TableHead>
                                <TableHead>Lawyers</TableHead>
                                <TableHead>Active Cases</TableHead>
                                <TableHead>Contact</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredFirms.map((firm) => (
                                <TableRow key={firm.id}>
                                    <TableCell className="font-medium">
                                        <div className="flex items-center space-x-3">
                                            <Avatar className="h-10 w-10">
                                                <AvatarImage
                                                    src={
                                                        firm.logo ||
                                                        "/placeholder.svg"
                                                    }
                                                    alt={firm.name}
                                                />
                                                <AvatarFallback>
                                                    {firm.name
                                                        .split(" ")
                                                        .map((n) => n[0])
                                                        .join("")}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <div className="font-medium">
                                                    {firm.name}
                                                </div>
                                                <div className="text-sm text-muted-foreground">
                                                    Joined {firm.joinDate}
                                                </div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">
                                            {firm.size}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{firm.lawyers}</TableCell>
                                    <TableCell>{firm.cases}</TableCell>
                                    <TableCell>
                                        <div>
                                            <div className="text-sm">
                                                {firm.contact}
                                            </div>
                                            <div className="text-sm text-muted-foreground">
                                                {firm.phone}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={
                                                firm.status === "Active"
                                                    ? "default"
                                                    : "secondary"
                                            }
                                        >
                                            {firm.status}
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
                                                    Edit Firm
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <Users className="mr-2 h-4 w-4" />
                                                    Manage Lawyers
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <FileText className="mr-2 h-4 w-4" />
                                                    View Cases
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem className="text-red-600">
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Delete Firm
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
