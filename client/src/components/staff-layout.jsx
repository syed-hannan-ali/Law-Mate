import {
    Bell,
    Search,
    Settings,
    User,
    LogOut,
    BarChart3,
    Bot,
    Users,
    Building2,
    FileText,
    Calendar,
    Shield,
    FolderOpen,
    Receipt,
    CreditCard,
    CheckSquare,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/avatar";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@components/ui/dropdown-menu";
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarInset,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
    SidebarTrigger,
} from "@components/ui/sidebar";
import { Badge } from "@components/ui/badge";
import { useAuth } from "@hooks/useAuth";
import { Outlet } from "react-router-dom";

const navigationItems = [
    {
        title: "Overview",
        items: [{ title: "Dashboard", icon: BarChart3, key: "dashboard" }],
    },
    {
        title: "Management",
        items: [
            { title: "Cases", icon: FileText, key: "cases" },
            { title: "Appointments", icon: Calendar, key: "appointments" },
        ],
    },
    {
        title: "Operations",
        items: [
            { title: "Documents", icon: FolderOpen, key: "documents" },
            { title: "Tasks", icon: CheckSquare, key: "tasks" },
        ],
    },
    {
        title: "System",
        items: [{ title: "Audit Logs", icon: Shield, key: "audit" }],
    },
];

export function StaffLayout() {
    const navigate = useNavigate();
    const location = useLocation();

    const { user, handleLogout } = useAuth();
    const getUserInitials = (name) => {
        if (!name) return "U";
        return name
            .split(" ")
            .map((word) => word[0])
            .join("")
            .toUpperCase()
            .substring(0, 2);
    };
    const getDisplayName = () => {
        if (!user) return "User";
        return user.name || user.username || "User";
    };

    const getDisplayEmail = () => {
        if (!user) return "user@example.com";
        return user.email || "user@example.com";
    };

    const handleLogoutClick = () => {
        if (window.confirm("Are you sure you want to log out?")) {
            handleLogout();
        }
    };

    return (
        <SidebarProvider>
            <Sidebar className="border-r">
                <SidebarHeader className="border-b px-6 py-4">
                    <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                            <Shield className="h-4 w-4" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-lg font-semibold">
                                LawMate
                            </span>
                            <span className="text-xs text-muted-foreground">
                                Staff Dashboard
                            </span>
                        </div>
                    </div>
                </SidebarHeader>
                <SidebarContent>
                    {navigationItems.map((group) => (
                        <SidebarGroup key={group.title}>
                            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
                            <SidebarGroupContent>
                                <SidebarMenu>
                                    {group.items.map((item) => (
                                        <SidebarMenuItem key={item.key}>
                                            <SidebarMenuButton
                                                isActive={
                                                    location.pathname ===
                                                    `/staff/${item.key === "dashboard" ? "" : item.key}`
                                                }
                                                onClick={() =>
                                                    navigate(
                                                        `/staff/${item.key === "dashboard" ? "" : item.key}`,
                                                    )
                                                }
                                            >
                                                <item.icon className="h-4 w-4" />
                                                <span>{item.title}</span>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    ))}
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </SidebarGroup>
                    ))}
                </SidebarContent>
            </Sidebar>
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-4 border-b bg-background px-6">
                    <SidebarTrigger className="-ml-1" />
                    <div className="flex flex-1 items-center gap-4">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Search across platform..."
                                className="pl-9"
                            />
                        </div>
                        <div className="flex items-center gap-2 ml-auto">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="relative"
                            >
                                <Bell className="h-4 w-4" />
                                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-1 text-xs">
                                    1
                                </Badge>
                            </Button>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        className="relative h-8 w-8 rounded-full"
                                    >
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage
                                                src={
                                                    user?.avatar ||
                                                    user?.profilePicture
                                                }
                                                alt={getDisplayName()}
                                            />
                                            <AvatarFallback>
                                                {getUserInitials(
                                                    getDisplayName(),
                                                )}
                                            </AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    className="w-56"
                                    align="end"
                                    forceMount
                                >
                                    <DropdownMenuLabel className="font-normal">
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-sm font-medium leading-none">
                                                {getDisplayName()}
                                            </p>
                                            <p className="text-xs leading-none text-muted-foreground">
                                                {getDisplayEmail()}
                                            </p>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        onClick={() => navigate("profile")}
                                    >
                                        <User className="mr-2 h-4 w-4" />
                                        <span>Profile</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() => navigate("chat")}
                                    >
                                        <Bot className="mr-2 h-4 w-4" />
                                        <span>Chatbot</span>
                                    </DropdownMenuItem>

                                    <DropdownMenuItem>
                                        <Settings className="mr-2 h-4 w-4" />
                                        <span>Settings</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        onClick={handleLogoutClick}
                                        className="text-red-600 focus:text-red-600 focus:bg-red-50"
                                    >
                                        <LogOut className="mr-2 h-4 w-4" />
                                        <span>Log out</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </header>
                <main className="flex-1 space-y-4 p-6">
                    <Outlet />
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}
