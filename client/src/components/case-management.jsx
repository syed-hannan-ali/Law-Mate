// "use client"

import { useState } from "react";
import {
    Plus,
    Search,
    FileText,
    Clock,
    CheckCircle,
    AlertCircle,
    MoreHorizontal,
    Edit,
    Eye,
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

const cases = [
    {
        id: "CASE-001",
        title: "Johnson vs. State Insurance",
        type: "Personal Injury",
        client: "Robert Johnson",
        lawyer: "Sarah Wilson",
        firm: "Wilson Law Group",
        status: "In Progress",
        priority: "High",
        createdDate: "2024-01-10",
        lastUpdate: "2024-01-15",
    },
    {
        id: "CASE-002",
        title: "Smith Property Dispute",
        type: "Real Estate",
        client: "Mary Smith",
        lawyer: "John Davis",
        firm: "Davis & Associates",
        status: "Open",
        priority: "Medium",
        createdDate: "2024-01-12",
        lastUpdate: "2024-01-14",
    },
    {
        id: "CASE-003",
        title: "Corporate Merger Review",
        type: "Corporate Law",
        client: "TechCorp Inc.",
        lawyer: "Emily Brown",
        firm: "Brown Legal",
        status: "Resolved",
        priority: "Low",
        createdDate: "2023-12-15",
        lastUpdate: "2024-01-08",
    },
];

const statusColors = {
    Open: "default",
    "In Progress": "secondary",
    Resolved: "outline",
};

const priorityColors = {
    High: "destructive",
    Medium: "default",
    Low: "secondary",
};

export function CaseManagement() {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [typeFilter, setTypeFilter] = useState("all");

    const filteredCases = cases.filter((caseItem) => {
        const matchesSearch =
            caseItem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            caseItem.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
            caseItem.id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus =
            statusFilter === "all" ||
            caseItem.status.toLowerCase().replace(" ", "") === statusFilter;
        const matchesType =
            typeFilter === "all" ||
            caseItem.type.toLowerCase().replace(" ", "") === typeFilter;

        return matchesSearch && matchesStatus && matchesType;
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Case Management
                    </h1>
                    <p className="text-muted-foreground">
                        Monitor and manage all legal cases across the platform
                    </p>
                </div>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Case
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Cases
                        </CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">5,672</div>
                        <p className="text-xs text-muted-foreground">
                            +23% from last month
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Open Cases
                        </CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">2,341</div>
                        <p className="text-xs text-muted-foreground">
                            41.3% of total
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            In Progress
                        </CardTitle>
                        <AlertCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">1,892</div>
                        <p className="text-xs text-muted-foreground">
                            33.4% of total
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Resolved
                        </CardTitle>
                        <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">1,439</div>
                        <p className="text-xs text-muted-foreground">
                            25.3% of total
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Cases</CardTitle>
                    <div className="flex items-center space-x-2">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Search cases..."
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
                                <SelectItem value="open">Open</SelectItem>
                                <SelectItem value="inprogress">
                                    In Progress
                                </SelectItem>
                                <SelectItem value="resolved">
                                    Resolved
                                </SelectItem>
                            </SelectContent>
                        </Select>
                        <Select
                            value={typeFilter}
                            onValueChange={setTypeFilter}
                        >
                            <SelectTrigger className="w-[160px]">
                                <SelectValue placeholder="Case Type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Types</SelectItem>
                                <SelectItem value="personalinjury">
                                    Personal Injury
                                </SelectItem>
                                <SelectItem value="realestate">
                                    Real Estate
                                </SelectItem>
                                <SelectItem value="corporatelaw">
                                    Corporate Law
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Case ID</TableHead>
                                <TableHead>Title</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Client</TableHead>
                                <TableHead>Lawyer</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Priority</TableHead>
                                <TableHead>Last Update</TableHead>
                                <TableHead className="text-right">
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredCases.map((caseItem) => (
                                <TableRow key={caseItem.id}>
                                    <TableCell className="font-medium">
                                        {caseItem.id}
                                    </TableCell>
                                    <TableCell>
                                        <div>
                                            <div className="font-medium">
                                                {caseItem.title}
                                            </div>
                                            <div className="text-sm text-muted-foreground">
                                                {caseItem.firm}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">
                                            {caseItem.type}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{caseItem.client}</TableCell>
                                    <TableCell>{caseItem.lawyer}</TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={
                                                statusColors[caseItem.status]
                                            }
                                        >
                                            {caseItem.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={
                                                priorityColors[
                                                    caseItem.priority
                                                ]
                                            }
                                        >
                                            {caseItem.priority}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{caseItem.lastUpdate}</TableCell>
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
                                                    <Eye className="mr-2 h-4 w-4" />
                                                    View Details
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <Edit className="mr-2 h-4 w-4" />
                                                    Edit Case
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem>
                                                    Update Status
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    Assign Lawyer
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
