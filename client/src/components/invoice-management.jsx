// "use client"

import { useState } from "react";
import {
    Plus,
    Search,
    Receipt,
    DollarSign,
    Clock,
    CheckCircle,
    MoreHorizontal,
    Eye,
    Edit,
    Send,
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

const invoices = [
    {
        id: "INV-001",
        client: "Robert Johnson",
        firm: "Wilson Law Group",
        amount: "$2,500.00",
        status: "Paid",
        dueDate: "2024-01-20",
        issueDate: "2024-01-05",
        case: "CASE-001",
        description: "Legal consultation and case preparation",
    },
    {
        id: "INV-002",
        client: "Mary Smith",
        firm: "Davis & Associates",
        amount: "$1,800.00",
        status: "Unpaid",
        dueDate: "2024-01-25",
        issueDate: "2024-01-10",
        case: "CASE-002",
        description: "Property dispute legal services",
    },
    {
        id: "INV-003",
        client: "TechCorp Inc.",
        firm: "Brown Legal",
        amount: "$5,200.00",
        status: "Overdue",
        dueDate: "2024-01-15",
        issueDate: "2023-12-30",
        case: "CASE-003",
        description: "Corporate merger legal review",
    },
    {
        id: "INV-004",
        client: "Global Industries",
        firm: "Johnson & Partners",
        amount: "$3,750.00",
        status: "Pending",
        dueDate: "2024-01-30",
        issueDate: "2024-01-12",
        case: "CASE-004",
        description: "Contract negotiation services",
    },
];

const statusColors = {
    Paid: "default",
    Unpaid: "secondary",
    Overdue: "destructive",
    Pending: "outline",
};

export function InvoiceManagement() {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    const filteredInvoices = invoices.filter((invoice) => {
        const matchesSearch =
            invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            invoice.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
            invoice.firm.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus =
            statusFilter === "all" ||
            invoice.status.toLowerCase() === statusFilter;

        return matchesSearch && matchesStatus;
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Invoice Management
                    </h1>
                    <p className="text-muted-foreground">
                        Track and manage all invoices across the platform
                    </p>
                </div>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Invoice
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Invoices
                        </CardTitle>
                        <Receipt className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">1,247</div>
                        <p className="text-xs text-muted-foreground">
                            +8% from last month
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Revenue
                        </CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">$2.4M</div>
                        <p className="text-xs text-muted-foreground">
                            This month
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Pending Payment
                        </CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">$156K</div>
                        <p className="text-xs text-muted-foreground">
                            89 invoices
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Paid This Month
                        </CardTitle>
                        <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">$1.8M</div>
                        <p className="text-xs text-muted-foreground">
                            75% collection rate
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Invoices</CardTitle>
                    <div className="flex items-center space-x-2">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Search invoices..."
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
                                <SelectItem value="paid">Paid</SelectItem>
                                <SelectItem value="unpaid">Unpaid</SelectItem>
                                <SelectItem value="overdue">Overdue</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Invoice ID</TableHead>
                                <TableHead>Client</TableHead>
                                <TableHead>Firm</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Issue Date</TableHead>
                                <TableHead>Due Date</TableHead>
                                <TableHead className="text-right">
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredInvoices.map((invoice) => (
                                <TableRow key={invoice.id}>
                                    <TableCell className="font-medium">
                                        {invoice.id}
                                    </TableCell>
                                    <TableCell>
                                        <div>
                                            <div className="font-medium">
                                                {invoice.client}
                                            </div>
                                            <div className="text-sm text-muted-foreground">
                                                {invoice.case}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>{invoice.firm}</TableCell>
                                    <TableCell className="font-medium">
                                        {invoice.amount}
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={
                                                statusColors[invoice.status]
                                            }
                                        >
                                            {invoice.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{invoice.issueDate}</TableCell>
                                    <TableCell>{invoice.dueDate}</TableCell>
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
                                                    Edit Invoice
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <Send className="mr-2 h-4 w-4" />
                                                    Send Reminder
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem>
                                                    Mark as Paid
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
