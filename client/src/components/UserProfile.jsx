import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { Badge } from "@components/ui/badge";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { Avatar, AvatarFallback } from "@components/ui/avatar";
import {
    User,
    Mail,
    Phone,
    MapPin,
    Building,
    Shield,
    Clock,
    Edit,
    Settings,
    Save,
    X,
} from "lucide-react";

import { toast } from "sonner";

import axios from "@config/axios";

// Mock user data based on your Mongoose schema
const mockUser = {
    _id: "507f1f77bcf86cd799439011",
    username: "john_doe",
    email: "john.doe@lawfirm.com",
    firm: {
        _id: "507f1f77bcf86cd799439012",
        name: "Smith & Associates Law Firm",
    },
    role: "lawyer",
    contactInfo: {
        phone: "+1 (555) 123-4567",
        address: "123 Legal Street, Law City, LC 12345",
    },
    permissions: ["view_cases", "edit_documents", "manage_clients"],
    isActive: true,
    isDeleted: false,
    lastLoginAt: new Date("2024-01-15T10:30:00Z"),
    createdBy: {
        _id: "507f1f77bcf86cd799439013",
        username: "admin_user",
    },
    updatedBy: {
        _id: "507f1f77bcf86cd799439014",
        username: "hr_manager",
    },
    createdAt: new Date("2023-06-15T09:00:00Z"),
    updatedAt: new Date("2024-01-10T14:20:00Z"),
};

const getRoleColor = (role) => {
    const colors = {
        lawyer: "bg-blue-100 text-blue-800 border-blue-200",
        client: "bg-green-100 text-green-800 border-green-200",
        admin: "bg-red-100 text-red-800 border-red-200",
        paralegal: "bg-purple-100 text-purple-800 border-purple-200",
    };
    return colors[role] || "bg-gray-100 text-gray-800 border-gray-200";
};

function formatDate(dateString) {
    console.log("Formatting date:", dateString); // Debug
    if (!dateString) return "N/A";

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid Date";

    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}

const getInitials = (name) => {
    if (!name) return "??";
    return name
        .split("_")
        .map((part) => part.charAt(0).toUpperCase())
        .join("")
        .slice(0, 2);
};

export default function UserProfile() {
    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({
        username: "",
        phone: "",
        address: "",
    });

    useEffect(() => {
        fetchUserData();
    }, []); // Fixed: removed user dependency to avoid infinite loop

    const fetchUserData = async () => {
        try {
            const response = await axios.get("/users/getProfile");
            console.log("Fetched user data:", response.data);
            setUser(response.data);
            // Initialize form with safe access to nested properties
            setEditForm({
                username: response.data?.username || "",
                phone: response.data?.contactInfo?.phone || "",
                address: response.data?.contactInfo?.address || "",
            });
        } catch (error) {
            console.error("Error fetching user data:", error);
            toast.error("Failed to load user profile. Please try again.");
        }
    };

    const handleEditClick = () => {
        // Safe access to nested properties
        setEditForm({
            username: user?.username || "",
            phone: user?.contactInfo?.phone || "",
            address: user?.contactInfo?.address || "",
        });
        setIsEditing(true);
    };

    const handleSave = async () => {
        // Update user state optimistically with safe property access
        setUser({
            ...user,
            username: editForm.username,
            contactInfo: {
                ...user?.contactInfo, // Safe spread of potentially undefined object
                phone: editForm.phone,
                address: editForm.address,
            },
        });
        setIsEditing(false);

        try {
            const response = await axios.put(`/users/${user._id}`, {
                username: editForm.username,
                contactInfo: {
                    phone: editForm.phone,
                    address: editForm.address,
                },
            });

            if (response.status === 200) {
                toast.success("User updated successfully");
                console.log("User updated successfully:", response.data);
                fetchUserData(); // Refresh user data after update
            }
        } catch (error) {
            console.error("Error updating user data:", error);
            if (error.response && error.response.data?.message) {
                toast.error(`${error.response.data.message}`);
            } else {
                toast.error("Failed to update user. Please try again.");
            }
            // Revert the optimistic update on error
            fetchUserData();
        }
    };

    const handleCancel = () => {
        // Safe access when canceling
        setEditForm({
            username: user?.username || "",
            phone: user?.contactInfo?.phone || "",
            address: user?.contactInfo?.address || "",
        });
        setIsEditing(false);
    };

    if (!user) {
        return <div className="p-6 text-gray-500">Loading profile...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                User Profile
                            </h1>
                            <p className="text-gray-600 mt-1">
                                Manage your account information and settings
                            </p>
                        </div>
                        <div className="flex gap-3">
                            {!isEditing ? (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleEditClick}
                                >
                                    <Edit className="w-4 h-4 mr-2" />
                                    Edit Profile
                                </Button>
                            ) : (
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleSave}
                                    >
                                        <Save className="w-4 h-4 mr-2" />
                                        Save
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleCancel}
                                    >
                                        <X className="w-4 h-4 mr-2" />
                                        Cancel
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Profile Card */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader className="pb-4">
                                <div className="flex items-center gap-4">
                                    <Avatar className="w-16 h-16">
                                        <AvatarFallback className="text-lg font-semibold">
                                            {user && getInitials(user.username)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        {isEditing ? (
                                            <div className="space-y-2">
                                                <Label htmlFor="username">
                                                    Username
                                                </Label>
                                                <Input
                                                    id="username"
                                                    value={editForm.username}
                                                    onChange={(e) =>
                                                        setEditForm({
                                                            ...editForm,
                                                            username:
                                                                e.target.value,
                                                        })
                                                    }
                                                    className="text-xl font-semibold"
                                                />
                                            </div>
                                        ) : (
                                            <CardTitle className="text-2xl">
                                                {user?.username ||
                                                    "Unknown User"}
                                            </CardTitle>
                                        )}
                                        <div className="flex items-center gap-2 mt-2">
                                            {user?.role && (
                                                <Badge
                                                    className={getRoleColor(
                                                        user.role,
                                                    )}
                                                >
                                                    {user.role
                                                        .charAt(0)
                                                        .toUpperCase() +
                                                        user.role.slice(1)}
                                                </Badge>
                                            )}
                                            <Badge
                                                variant={
                                                    user?.isActive
                                                        ? "default"
                                                        : "secondary"
                                                }
                                            >
                                                {user?.isActive
                                                    ? "Active"
                                                    : "Inactive"}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Contact Information */}
                                <div>
                                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                                        <User className="w-5 h-5" />
                                        Contact Information
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {/* Email - Always show if exists */}
                                        {user?.email && (
                                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                                <Mail className="w-5 h-5 text-gray-500" />
                                                <div>
                                                    <p className="text-sm text-gray-600">
                                                        Email
                                                    </p>
                                                    <p className="font-medium">
                                                        {user.email}
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                        {/* Phone - Show if exists or if editing */}
                                        {(user?.contactInfo?.phone ||
                                            isEditing) && (
                                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                                <Phone className="w-5 h-5 text-gray-500" />
                                                <div className="flex-1">
                                                    <p className="text-sm text-gray-600">
                                                        Phone
                                                    </p>
                                                    {isEditing ? (
                                                        <Input
                                                            value={
                                                                editForm.phone
                                                            }
                                                            onChange={(e) =>
                                                                setEditForm({
                                                                    ...editForm,
                                                                    phone: e
                                                                        .target
                                                                        .value,
                                                                })
                                                            }
                                                            className="mt-1"
                                                            placeholder="Enter phone number"
                                                        />
                                                    ) : (
                                                        <p className="font-medium">
                                                            {user?.contactInfo
                                                                ?.phone ||
                                                                "Not provided"}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Address - Show if exists or if editing */}
                                    {(user?.contactInfo?.address ||
                                        isEditing) && (
                                        <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg mt-4">
                                            <MapPin className="w-5 h-5 text-gray-500 mt-0.5" />
                                            <div className="flex-1">
                                                <p className="text-sm text-gray-600">
                                                    Address
                                                </p>
                                                {isEditing ? (
                                                    <Input
                                                        value={editForm.address}
                                                        onChange={(e) =>
                                                            setEditForm({
                                                                ...editForm,
                                                                address:
                                                                    e.target
                                                                        .value,
                                                            })
                                                        }
                                                        className="mt-1"
                                                        placeholder="Enter address"
                                                    />
                                                ) : (
                                                    <p className="font-medium">
                                                        {user?.contactInfo
                                                            ?.address ||
                                                            "Not provided"}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Firm Information */}
                                {user?.firm && (
                                    <div>
                                        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                                            <Building className="w-5 h-5" />
                                            Firm Information
                                        </h3>
                                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                            <Building className="w-5 h-5 text-gray-500" />
                                            <div>
                                                <p className="text-sm text-gray-600">
                                                    Law Firm
                                                </p>
                                                <p className="font-medium">
                                                    {user.firm.name}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Permissions */}
                                {user?.permissions &&
                                    user.permissions.length > 0 && (
                                        <div>
                                            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                                                <Shield className="w-5 h-5" />
                                                Permissions
                                            </h3>
                                            <div className="flex flex-wrap gap-2">
                                                {user.permissions.map(
                                                    (permission, index) => (
                                                        <Badge
                                                            key={index}
                                                            variant="outline"
                                                            className="text-xs"
                                                        >
                                                            {permission
                                                                .replace(
                                                                    /_/g,
                                                                    " ",
                                                                )
                                                                .replace(
                                                                    /\b\w/g,
                                                                    (l) =>
                                                                        l.toUpperCase(),
                                                                )}
                                                        </Badge>
                                                    ),
                                                )}
                                            </div>
                                        </div>
                                    )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Account Status */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">
                                    Account Status
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">
                                        Status
                                    </span>
                                    <Badge
                                        variant={
                                            user?.isActive
                                                ? "default"
                                                : "secondary"
                                        }
                                    >
                                        {user?.isActive ? "Active" : "Inactive"}
                                    </Badge>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">
                                        Account
                                    </span>
                                    <Badge
                                        variant={
                                            user?.isDeleted
                                                ? "destructive"
                                                : "default"
                                        }
                                    >
                                        {user?.isDeleted ? "Deleted" : "Active"}
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Activity Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Clock className="w-5 h-5" />
                                    Activity
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">
                                        Last Login
                                    </p>
                                    <p className="text-sm font-medium">
                                        {user?.lastLoginAt
                                            ? formatDate(user.lastLoginAt)
                                            : "Never"}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">
                                        Member Since
                                    </p>
                                    <p className="text-sm font-medium">
                                        {formatDate(user?.createdAt)}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">
                                        Last Updated
                                    </p>
                                    <p className="text-sm font-medium">
                                        {formatDate(user?.updatedAt)}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Management Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">
                                    Management
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {user?.createdBy && (
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">
                                            Created By
                                        </p>
                                        <p className="text-sm font-medium">
                                            {user.createdBy.username}
                                        </p>
                                    </div>
                                )}
                                {user?.updatedBy && (
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">
                                            Last Updated By
                                        </p>
                                        <p className="text-sm font-medium">
                                            {user.updatedBy.username}
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
