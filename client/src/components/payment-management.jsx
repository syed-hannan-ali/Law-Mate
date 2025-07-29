import { useState } from "react";
import {
    Search,
    CreditCard,
    DollarSign,
    TrendingUp,
    Calendar,
    MoreHorizontal,
    Eye,
    Download,
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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@components/ui/dropdown-menu";
import { Badge } from "@components/ui/badge";
import { Button } from "@components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@components/ui/select";

const payments = [
    {
        id: "PAY-001",
        amount: "$2,500.00",
        payer: "Robert Johnson",
        payee: "Wilson Law Group",
        method: "Credit Card",
        status: "Completed",
        date: "2024-01-15",
        invoiceId: "INV-001",
        transactionId: "txn_1234567890",
    },
    {
        id: "PAY-002",
        amount: "$1,800.00",
        payer: "Mary Smith",
        payee: "Davis & Associates",
        method: "Bank Transfer",
        status: "Processing",
        date: "2024-01-14",
        invoiceId: "INV-002",
        transactionId: "txn_0987654321",
    },
    {
        id: "PAY-003",
        amount: "$5,200.00",
        payer: "TechCorp Inc.",
        payee: "Brown Legal",
        method: "Wire Transfer",
        status: "Failed",
        date: "2024-01-13",
        invoiceId: "INV-003",
        transactionId: "txn_1122334455",
    },
    {
        id: "PAY-004",
        amount: "$3,750.00",
        payer: "Global Industries",
        payee: "Johnson & Partners",
        method: "ACH",
        status: "Pending",
        date: "2024-01-12",
        invoiceId: "INV-004",
        transactionId: "txn_5566778899",
    },
];

const statusColors = {
    Completed: "default",
    Processing: "secondary",
    Failed: "destructive",
    Pending: "outline",
};

const methodColors = {
    "Credit Card": "default",
    "Bank Transfer": "secondary",
    "Wire Transfer": "outline",
    ACH: "secondary",
};

export function PaymentManagement() {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [methodFilter, setMethodFilter] = useState("all");

    const filteredPayments = payments.filter((payment) => {
        const matchesSearch =
            payment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            payment.payer.toLowerCase().includes(searchTerm.toLowerCase()) ||
            payment.payee.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus =
            statusFilter === "all" ||
            payment.status.toLowerCase() === statusFilter;
        const matchesMethod =
            methodFilter === "all" ||
            payment.method.toLowerCase().replace(" ", "") === methodFilter;

        return matchesSearch && matchesStatus && matchesMethod;
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Payment Management
                    </h1>
                    <p className="text-muted-foreground">
                        Track all payments and transactions across the platform
                    </p>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Payments
                        </CardTitle>
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">2,847</div>
                        <p className="text-xs text-muted-foreground">
                            +12% from last month
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Revenue This Month
                        </CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">$1.8M</div>
                        <p className="text-xs text-muted-foreground">
                            +15% from last month
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Success Rate
                        </CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">94.2%</div>
                        <p className="text-xs text-muted-foreground">
                            Payment success rate
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Avg. Payment Time
                        </CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">2.3 days</div>
                        <p className="text-xs text-muted-foreground">
                            From invoice to payment
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Recent Payments</CardTitle>
                    <div className="flex items-center space-x-2">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Search payments..."
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
                                <SelectItem value="completed">
                                    Completed
                                </SelectItem>
                                <SelectItem value="processing">
                                    Processing
                                </SelectItem>
                                <SelectItem value="failed">Failed</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select
                            value={methodFilter}
                            onValueChange={setMethodFilter}
                        >
                            <SelectTrigger className="w-[160px]">
                                <SelectValue placeholder="Method" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Methods</SelectItem>
                                <SelectItem value="creditcard">
                                    Credit Card
                                </SelectItem>
                                <SelectItem value="banktransfer">
                                    Bank Transfer
                                </SelectItem>
                                <SelectItem value="wiretransfer">
                                    Wire Transfer
                                </SelectItem>
                                <SelectItem value="ach">ACH</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Payment ID</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Payer</TableHead>
                                <TableHead>Payee</TableHead>
                                <TableHead>Method</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead className="text-right">
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredPayments.map((payment) => (
                                <TableRow key={payment.id}>
                                    <TableCell className="font-medium">
                                        {payment.id}
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        {payment.amount}
                                    </TableCell>
                                    <TableCell>{payment.payer}</TableCell>
                                    <TableCell>{payment.payee}</TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={
                                                methodColors[payment.method]
                                            }
                                        >
                                            {payment.method}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={
                                                statusColors[payment.status]
                                            }
                                        >
                                            {payment.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{payment.date}</TableCell>
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
                                                    <Download className="mr-2 h-4 w-4" />
                                                    Download Receipt
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
