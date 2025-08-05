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
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@components/ui/dialog";

import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/avatar";
import { useEffect, useState } from "react";
import { getAllFirms, deleteFirm, getStaffCount } from "@services/firm-service";
import { toast } from "sonner";
import FirmForm from "@components/Firm-Form";

// const firms = [
//     {
//         id: 1,
//         name: "Smith & Associates",
//         logo: "/placeholder.svg?height=40&width=40",
//         size: "Large",
//         lawyers: 25,
//         cases: 156,
//         contact: "john.smith@smithlaw.com",
//         phone: "+1 (555) 123-4567",
//         status: "Active",
//         joinDate: "2023-01-15",
//     }];

export function FirmManagement() {
    const [searchTerm, setSearchTerm] = useState("");
    const [firms, setFirms] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingFirm, setEditingFirm] = useState(null);
    const [firmUserCounts, setFirmUserCounts] = useState({});

    useEffect(() => {
        fetchFirms();
    }, []);

    const fetchFirms = async () => {
        try {
            const res = await getAllFirms();
            const firmsData = res.data;
            setFirms(firmsData);

            const counts = await Promise.all(
                firmsData.map(async (firm) => {
                    try {
                        const countRes = await getStaffCount(firm._id);
                        return { firmId: firm._id, count: countRes.data.count };
                    } catch (err) {
                        console.error(
                            `Error fetching count for firm ${firm._id}`,
                            err,
                        );
                        return { firmId: firm._id, count: 0 };
                    }
                }),
            );

            const countsMap = counts.reduce((acc, { firmId, count }) => {
                acc[firmId] = count;
                return acc;
            }, {});

            setFirmUserCounts(countsMap);
        } catch (err) {
            toast.error("Failed to load firms.");
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this firm?"))
            return;

        try {
            await deleteFirm(id);
            toast.success("Firm deleted successfully");
            setFirms((prev) => prev.filter((f) => f._id !== id));
        } catch (err) {
            toast.error("Failed to delete firm");
        }
    };

    const filteredFirms = firms.filter(
        (firm) =>
            firm?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            firm?.contact?.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    const countAvg = () => {
        const counts = Object.values(firmUserCounts);
        const totalStaff = counts.reduce((sum, count) => sum + count, 0);
        const avgStaff =
            counts.length > 0 ? (totalStaff / counts.length).toFixed(1) : "0";
        return avgStaff;
    };

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
                <Button
                    onClick={() => {
                        setEditingFirm(null);
                        setShowForm(true);
                    }}
                >
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
                        <div className="text-2xl font-bold">{firms.length}</div>
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
                            Avg. Staff/Firm
                        </CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{countAvg()}</div>
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
                                <TableHead>Staff</TableHead>
                                <TableHead>Active Cases</TableHead>
                                <TableHead>Contact</TableHead>
                                <TableHead>Subscription Plan</TableHead>
                                <TableHead>Created at</TableHead>
                                <TableHead className="text-right">
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredFirms.map((firm) => (
                                <TableRow key={firm._id}>
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
                                            </div>
                                        </div>
                                    </TableCell>

                                    <TableCell>
                                        {firmUserCounts[firm._id] ??
                                            "Loading..."}
                                    </TableCell>
                                    <TableCell>
                                        {firm.cases?.length || 0}
                                    </TableCell>

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
                                        {firm.subscription?.plan?.name || "—"}
                                    </TableCell>
                                    <TableCell>
                                        <div>
                                            <div className="text-sm">
                                                {new Date(
                                                    firm.createdAt,
                                                ).toLocaleDateString()}
                                            </div>
                                        </div>
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
                                                        console.log(firm);
                                                        setEditingFirm(firm);
                                                        setShowForm(true);
                                                    }}
                                                >
                                                    <Edit className="mr-2 h-4 w-4" />
                                                    Edit Firm
                                                </DropdownMenuItem>

                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    onClick={() =>
                                                        handleDelete(firm._id)
                                                    }
                                                    className="text-red-600"
                                                >
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
            <Dialog open={showForm} onOpenChange={setShowForm}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>
                            {editingFirm ? "Edit Firm" : "Add Firm"}
                        </DialogTitle>
                        <DialogDescription>
                            {editingFirm
                                ? "Update firm details like name, address, email, and phone."
                                : "Fill in the details to register a new law firm."}
                        </DialogDescription>
                    </DialogHeader>

                    <FirmForm
                        mode={editingFirm ? "edit" : "add"}
                        firm={editingFirm}
                        onSuccess={() => {
                            fetchFirms();
                            setShowForm(false);
                        }}
                        onClose={() => setShowForm(false)}
                    />
                </DialogContent>
            </Dialog>
        </div>
    );
}
