import { useEffect, useState } from "react";
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
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogTrigger,
} from "@components/ui/dialog";
import { Label } from "@components/ui/label";
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
import axios from "@config/axios";
import { toast } from "sonner";

export function DocumentManagement() {
    // Sample data matching your backend structure
    const [documents, setDocuments] = useState([]);
    const [open, setOpen] = useState(false);
    const [cases, setCases] = useState([]);
    const [formData, setFormData] = useState({
        title: "",
        file: null,
        caseId: "",
    });

    const [searchTerm, setSearchTerm] = useState("");
    const [typeFilter, setTypeFilter] = useState("all");
    const [dropdownOpen, setDropdownOpen] = useState(null);

    useEffect(() => {
        fetchDocuments();
        fetchCases();
    }, []);

    const fetchCases = async () => {
        try {
            const res = await axios.get("/cases"); // Adjust API route
            setCases(res.data);
        } catch (err) {
            toast.error("Failed to load cases");
        }
    };

    // Fetch documents from the backend (mocked for this example)
    const fetchDocuments = async () => {
        try {
            const response = await axios.get("/documents");
            setDocuments(response.data);
        } catch (error) {
            console.error("Error fetching documents:", error);
            toast.error("Failed to load documents. Please try again later.");
        }
    };

    // Helper function to get file extension from mimeType or originalName
    const getFileType = (doc) => {
        if (doc.mimeType) {
            const mimeMap = {
                "application/pdf": "PDF",
                "application/zip": "ZIP",
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
                    "DOCX",
                "application/msword": "DOC",
                "image/png": "PNG",
                "image/jpeg": "JPG",
                "image/jpg": "JPG",
            };
            return (
                mimeMap[doc.mimeType] ||
                doc.mimeType.split("/")[1].toUpperCase()
            );
        }

        const extension = doc.originalName.split(".").pop().toUpperCase();
        return extension || "FILE";
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, file: e.target.files[0] });
    };

    // Helper function to format file size
    const formatFileSize = (bytes) => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
    };

    // Helper function to format date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        });
    };

    // Helper function to get badge color for file type
    const getTypeColor = (type) => {
        const colorMap = {
            PDF: "red",
            DOCX: "blue",
            DOC: "blue",
            ZIP: "yellow",
            PNG: "green",
            JPG: "sky",
            JPEG: "sky",
        };
        return colorMap[type] || "secondary";
    };

    // Filter documents based on search and type
    const filteredDocuments = documents.filter((doc) => {
        const matchesSearch =
            doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doc.originalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doc.uploadedBy.email
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            (doc.case?.title &&
                doc.case.title
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()));

        const docType = getFileType(doc).toLowerCase();
        const matchesType = typeFilter === "all" || docType === typeFilter;

        return matchesSearch && matchesType && !doc.isDeleted;
    });

    // Get unique file types for filter dropdown
    const uniqueTypes = [...new Set(documents.map((doc) => getFileType(doc)))];

    // Calculate statistics
    const totalDocuments = documents.filter((doc) => !doc.isDeleted).length;
    const totalStorage = documents
        .filter((doc) => !doc.isDeleted)
        .reduce((sum, doc) => sum + doc.sizeInBytes, 0);

    // Documents uploaded today (for demo, we'll use recent documents)
    const today = new Date();
    const todayStart = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
    );
    const documentsToday = documents.filter(
        (doc) => !doc.isDeleted && new Date(doc.createdAt) >= todayStart,
    ).length;

    const handleDropdownToggle = (docId) => {
        setDropdownOpen(dropdownOpen === docId ? null : docId);
    };

    const handleViewDocument = (doc) => {
        window.open(doc.fileUrl, "_blank");
        setDropdownOpen(null);
    };

    const handleSubmit = async () => {
        if (!formData.title || !formData.file || !formData.caseId) {
            toast.error("Please fill all fields");
            return;
        }

        const data = new FormData();
        data.append("title", formData.title);
        data.append("file", formData.file);
        data.append("caseId", formData.caseId);

        try {
            await axios.post("/documents", data, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            toast.success("Document uploaded successfully");
            fetchDocuments();
            setOpen(false);
            setFormData({ title: "", file: null, caseId: "" });
        } catch (err) {
            toast.error("Failed to upload document");
        }
    };

    const handleDownloadDocument = (doc) => {
        const link = document.createElement("a");
        link.href = doc.fileUrl;
        link.download = doc.originalName;
        link.target = "_blank";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setDropdownOpen(null);
    };

    const handleDeleteDocument = async (docId) => {
        // In a real app, you would make an API call here
        try {
            const response = await axios.delete(`/documents/${docId}`);
            console.log("Document deleted:", response.status);
            if (response.status == 200) {
                toast.success("Document deleted successfully.");
                setDocuments((prevDocs) =>
                    prevDocs.filter((doc) => doc._id !== docId),
                );
            }
        } catch (error) {
            console.error("Error deleting document:", error);
            toast.error("Failed to delete document. Please try again later.");
        }
        setDropdownOpen(null);
    };

    if (documents == null) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-muted-foreground">
                    Loading documents...
                </div>
            </div>
        );
    }

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
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Upload className="mr-2 h-4 w-4" />
                            Upload Document
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Upload Document</DialogTitle>
                        </DialogHeader>

                        <div className="space-y-4">
                            <div>
                                <Label>Title</Label>
                                <Input
                                    value={formData.title}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            title: e.target.value,
                                        })
                                    }
                                />
                            </div>

                            <div>
                                <Label>File</Label>
                                <Input
                                    type="file"
                                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                    onChange={handleFileChange}
                                />
                            </div>

                            <div>
                                <Label>Case</Label>
                                <Select
                                    value={formData.caseId}
                                    onValueChange={(value) =>
                                        setFormData({
                                            ...formData,
                                            caseId: value,
                                        })
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select case" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {cases.map((c) => (
                                            <SelectItem
                                                key={c._id}
                                                value={c._id}
                                            >
                                                {c.title}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <DialogFooter>
                            <Button onClick={handleSubmit}>Submit</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Statistics Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Documents
                        </CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {totalDocuments.toLocaleString()}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Active documents in system
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
                        <div className="text-2xl font-bold">
                            {formatFileSize(totalStorage)}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Total file storage
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
                        <div className="text-2xl font-bold">
                            {documentsToday}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            New documents today
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Cases
                        </CardTitle>
                        <Eye className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {
                                [
                                    ...new Set(
                                        documents
                                            .map((doc) => doc.case?._id)
                                            .filter(Boolean),
                                    ),
                                ].length
                            }
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Active cases with documents
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Documents Table */}
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
                                {uniqueTypes.map((type) => (
                                    <SelectItem
                                        key={type}
                                        value={type.toLowerCase()}
                                    >
                                        {type}
                                    </SelectItem>
                                ))}
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
                            {filteredDocuments.map((doc) => {
                                const fileType = getFileType(doc);
                                return (
                                    <TableRow key={doc._id}>
                                        <TableCell className="font-medium">
                                            <div className="flex items-center space-x-2">
                                                <FileText className="h-4 w-4 text-muted-foreground" />
                                                <div>
                                                    <div className="font-medium">
                                                        {doc.title}
                                                    </div>
                                                    <div className="text-sm text-muted-foreground">
                                                        {doc.originalName}
                                                    </div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={getTypeColor(fileType)}
                                            >
                                                {fileType}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {formatFileSize(doc.sizeInBytes)}
                                        </TableCell>
                                        <TableCell>
                                            <div>
                                                <div className="font-medium">
                                                    {doc.case?.title ||
                                                        "No Case"}
                                                </div>
                                                <div className="text-sm text-muted-foreground">
                                                    {doc.case?._id}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {doc.uploadedBy.email}
                                        </TableCell>
                                        <TableCell>
                                            {formatDate(doc.createdAt)}
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
                                                        onClick={() =>
                                                            handleViewDocument(
                                                                doc,
                                                            )
                                                        }
                                                    >
                                                        <Eye className="mr-2 h-4 w-4" />
                                                        View
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() =>
                                                            handleDownloadDocument(
                                                                doc,
                                                            )
                                                        }
                                                    >
                                                        <Download className="mr-2 h-4 w-4" />
                                                        Download
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        className="text-destructive"
                                                        onClick={() =>
                                                            handleDeleteDocument(
                                                                doc._id,
                                                            )
                                                        }
                                                    >
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                    {filteredDocuments.length === 0 && (
                        <div className="text-center py-12">
                            <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                            <h3 className="mt-2 text-sm font-medium">
                                No documents found
                            </h3>
                            <p className="mt-1 text-sm text-muted-foreground">
                                {searchTerm || typeFilter !== "all"
                                    ? "Try adjusting your search criteria."
                                    : "Get started by uploading your first document."}
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
