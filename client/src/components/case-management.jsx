import { useState, useEffect } from "react";
import {
    Plus,
    Search,
    FileText,
    Clock,
    CheckCircle,
    AlertCircle,
    MoreHorizontal,
    Edit,
    Trash2,
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
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@components/ui/dialog";

import { getAllCases, deleteCase, getUsers } from "@services/case-service";
import CaseForm from "@components/Case-Form";
import { useNavigate } from "react-router-dom";

const statusColors = {
    open: "default  ",
    "in-progress": "destructive",
    closed: "outline",
};

export function CaseManagement() {
    const [cases, setCases] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingCase, setEditingCase] = useState(null);

    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    const [clientList, setClientList] = useState([]);
    const [staffList, setStaffList] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        fetchCases();
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await getUsers();
            // console.log(res.data);
            const List1 = [];
            const List2 = [];

            res.data.forEach((user) => {
                if (user.role === "client") {
                    List1.push(user);
                } else if (
                    user.role === "lawyer" ||
                    user.role === "paralegal"
                ) {
                    List2.push(user);
                }
                setClientList(List1);
                setStaffList(List2);
            });
        } catch (err) {
            console.log("Failed to fetch users in case management: ", err);
        }
    };

    const fetchCases = async () => {
        try {
            const res = await getAllCases();
            console.log(res.data);
            setCases(res.data);
        } catch (err) {
            console.error("Failed to fetch cases:", err);
        }
    };

    const statusCounts = cases.reduce(
        (acc, caseItem) => {
            const status = caseItem.status?.toLowerCase(); // normalize to lowercase
            if (status === "open") acc.open += 1;
            else if (status === "in-progress") acc.inProgress += 1;
            else if (status === "closed") acc.closed += 1;
            return acc;
        },
        { open: 0, inProgress: 0, closed: 0 },
    );

    const filteredCases = cases.filter((caseItem) => {
        const matchesSearch =
            caseItem.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            caseItem.client?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            caseItem._id?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus =
            statusFilter === "all" ||
            caseItem.status.toLowerCase().replace(" ", "") === statusFilter;

        return matchesSearch && matchesStatus;
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
                <Button
                    onClick={() => {
                        setEditingCase(null);
                        setShowForm(true);
                    }}
                >
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
                        <div className="text-2xl font-bold">{cases.length}</div>
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
                        <div className="text-2xl font-bold">
                            {statusCounts.open}
                        </div>
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
                        <div className="text-2xl font-bold">
                            {statusCounts.inProgress}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Closed
                        </CardTitle>
                        <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {statusCounts.closed}
                        </div>
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
                                <SelectItem value="in-progress">
                                    In Progress
                                </SelectItem>
                                <SelectItem value="closed">closed</SelectItem>
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
                                <TableHead>Client</TableHead>
                                <TableHead>Lawyer</TableHead>
                                <TableHead>Status</TableHead>
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
                                        {caseItem._id.slice(-6).toUpperCase()}
                                    </TableCell>
                                    <TableCell>{caseItem.title}</TableCell>
                                    <TableCell>
                                        {caseItem.client?.username || "N/A"}
                                    </TableCell>
                                    <TableCell>
                                        {caseItem.assignedStaff?.[0]
                                            ?.username || "Unassigned"}
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={
                                                statusColors[caseItem.status] ||
                                                "outline"
                                            }
                                        >
                                            {caseItem.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {new Date(
                                            caseItem.updatedAt,
                                        ).toLocaleDateString()}
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

                                                <DropdownMenuItem
                                                    onClick={() => {
                                                        setEditingCase(
                                                            caseItem,
                                                        );
                                                        setShowForm(true);
                                                    }}
                                                >
                                                    <Edit className="mr-2 h-4 w-4" />
                                                    Edit Case
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() =>
                                                        navigate(
                                                            `${caseItem._id}`,
                                                        )
                                                    }
                                                >
                                                    <Eye className="mr-2 h-4 w-4" />
                                                    View Full Case
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => {
                                                        deleteCase(
                                                            caseItem._id,
                                                        );
                                                        fetchCases();
                                                    }}
                                                    className="text-red-600"
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Delete Firm
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
            <Dialog open={showForm} onOpenChange={setShowForm}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>
                            {editingCase ? "Edit Case" : "Add new case"}
                        </DialogTitle>
                        <DialogDescription>
                            {editingCase
                                ? "Update case details"
                                : "Fill in the details to register a new Case."}
                        </DialogDescription>
                    </DialogHeader>

                    <CaseForm
                        mode={editingCase ? "edit" : "add"}
                        caseData={editingCase}
                        clients={clientList}
                        staff={staffList}
                        onSuccess={() => {
                            fetchCases();
                            setShowForm(false);
                        }}
                        onClose={() => setShowForm(false)}
                    />
                </DialogContent>
            </Dialog>
        </div>
    );
}
