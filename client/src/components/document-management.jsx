// "use client"

import { useState } from "react";
import {
    Upload,
    Search,
    FileText,
    Download,
    Trash2,
    Eye,
    MoreHorizontal,
    FolderOpen,
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

const documents = [
    {
        id: 1,
        name: "Contract_Agreement_v3.pdf",
        type: "PDF",
        size: "2.4 MB",
        uploadedBy: "Sarah Wilson",
        uploadDate: "2024-01-15",
        case: "CASE-001",
        firm: "Wilson Law Group",
        category: "Contract",
    },
    {
        id: 2,
        name: "Evidence_Photos.zip",
        type: "ZIP",
        size: "15.7 MB",
        uploadedBy: "John Davis",
        uploadDate: "2024-01-14",
        case: "CASE-002",
        firm: "Davis & Associates",
        category: "Evidence",
    },
    {
        id: 3,
        name: "Client_Statement.docx",
        type: "DOCX",
        size: "156 KB",
        uploadedBy: "Emily Brown",
        uploadDate: "2024-01-13",
        case: "CASE-003",
        firm: "Brown Legal",
        category: "Statement",
    },
    {
        id: 4,
        name: "Legal_Brief_Final.pdf",
        type: "PDF",
        size: "892 KB",
        uploadedBy: "Michael Johnson",
        uploadDate: "2024-01-12",
        case: "CASE-004",
        firm: "Johnson & Partners",
        category: "Brief",
    },
];

const typeColors = {
    PDF: "default",
    DOCX: "secondary",
    ZIP: "outline",
    JPG: "secondary",
    PNG: "secondary",
};

export function DocumentManagement() {
    const [searchTerm, setSearchTerm] = useState("");
    const [typeFilter, setTypeFilter] = useState("all");
    const [categoryFilter, setCategoryFilter] = useState("all");

    const filteredDocuments = documents.filter((doc) => {
        const matchesSearch =
            doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doc.uploadedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doc.case.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType =
            typeFilter === "all" || doc.type.toLowerCase() === typeFilter;
        const matchesCategory =
            categoryFilter === "all" ||
            doc.category.toLowerCase() === categoryFilter;

        return matchesSearch && matchesType && matchesCategory;
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Document Management
                    </h1>
                    <p className="text-muted-foreground">
                        Manage all legal documents across the platform
                    </p>
                </div>
                <Button>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Document
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Documents
                        </CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">23,456</div>
                        <p className="text-xs text-muted-foreground">
                            +18% from last month
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Storage Used
                        </CardTitle>
                        <FolderOpen className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">847 GB</div>
                        <p className="text-xs text-muted-foreground">
                            of 1 TB limit
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Uploaded Today
                        </CardTitle>
                        <Upload className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">127</div>
                        <p className="text-xs text-muted-foreground">
                            New documents
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Downloads
                        </CardTitle>
                        <Download className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">1,892</div>
                        <p className="text-xs text-muted-foreground">
                            This week
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Documents</CardTitle>
                    <div className="flex items-center space-x-2">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Search documents..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                        <Select
                            value={typeFilter}
                            onValueChange={setTypeFilter}
                        >
                            <SelectTrigger className="w-[120px]">
                                <SelectValue placeholder="Type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Types</SelectItem>
                                <SelectItem value="pdf">PDF</SelectItem>
                                <SelectItem value="docx">DOCX</SelectItem>
                                <SelectItem value="zip">ZIP</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select
                            value={categoryFilter}
                            onValueChange={setCategoryFilter}
                        >
                            <SelectTrigger className="w-[140px]">
                                <SelectValue placeholder="Category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">
                                    All Categories
                                </SelectItem>
                                <SelectItem value="contract">
                                    Contract
                                </SelectItem>
                                <SelectItem value="evidence">
                                    Evidence
                                </SelectItem>
                                <SelectItem value="statement">
                                    Statement
                                </SelectItem>
                                <SelectItem value="brief">Brief</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Document Name</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Size</TableHead>
                                <TableHead>Case</TableHead>
                                <TableHead>Uploaded By</TableHead>
                                <TableHead>Upload Date</TableHead>
                                <TableHead className="text-right">
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredDocuments.map((doc) => (
                                <TableRow key={doc.id}>
                                    <TableCell className="font-medium">
                                        <div className="flex items-center space-x-2">
                                            <FileText className="h-4 w-4 text-muted-foreground" />
                                            <div>
                                                <div className="font-medium">
                                                    {doc.name}
                                                </div>
                                                <div className="text-sm text-muted-foreground">
                                                    {doc.category}
                                                </div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={typeColors[doc.type]}>
                                            {doc.type}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{doc.size}</TableCell>
                                    <TableCell>
                                        <div>
                                            <div className="font-medium">
                                                {doc.case}
                                            </div>
                                            <div className="text-sm text-muted-foreground">
                                                {doc.firm}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>{doc.uploadedBy}</TableCell>
                                    <TableCell>{doc.uploadDate}</TableCell>
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
                                                    View
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <Download className="mr-2 h-4 w-4" />
                                                    Download
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem className="text-red-600">
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Delete
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
