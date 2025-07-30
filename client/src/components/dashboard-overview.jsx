import {
    Building2,
    Users,
    FileText,
    DollarSign,
    FolderOpen,
    UserCheck,
    Calendar,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { Badge } from "@components/ui/badge";

const metrics = [
    {
        title: "Total Lawyers",
        value: "1,834",
        change: "+8%",
        changeType: "positive",
        icon: Users,
        description: "Registered lawyers",
    },
    {
        title: "Total Cases",
        value: "5,672",
        change: "+23%",
        changeType: "positive",
        icon: FileText,
        description: "Active cases",
    },
    {
        title: "Total Revenue",
        value: "$2.4M",
        change: "+15%",
        changeType: "positive",
        icon: DollarSign,
        description: "This month",
    },
    {
        title: "Total Documents",
        value: "23,456",
        change: "+18%",
        changeType: "positive",
        icon: FolderOpen,
        description: "Uploaded documents",
    },
    {
        title: "Total Clients",
        value: "8,921",
        change: "+11%",
        changeType: "positive",
        icon: UserCheck,
        description: "Registered clients",
    },
    {
        title: "Appointments Today",
        value: "156",
        change: "+5%",
        changeType: "positive",
        icon: Calendar,
        description: "Scheduled today",
    },
];

export function DashboardOverview() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">
                    Dashboard Overview
                </h1>
                <p className="text-muted-foreground">
                    Welcome back! Here's what's happening with your LawMate
                    platform today.
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {metrics.map((metric) => (
                    <Card
                        key={metric.title}
                        className="hover:shadow-md transition-shadow"
                    >
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {metric.title}
                            </CardTitle>
                            <metric.icon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {metric.value}
                            </div>
                            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                                <Badge
                                    variant={
                                        metric.changeType === "positive"
                                            ? "default"
                                            : "destructive"
                                    }
                                    className="text-xs"
                                >
                                    {metric.change}
                                </Badge>
                                <span>{metric.description}</span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center space-x-4">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <div className="flex-1 space-y-1">
                                <p className="text-sm font-medium">
                                    New law firm registered
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    Smith & Associates joined the platform
                                </p>
                            </div>
                            <div className="text-xs text-muted-foreground">
                                2 min ago
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <div className="flex-1 space-y-1">
                                <p className="text-sm font-medium">
                                    Case status updated
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    Johnson vs. State moved to "In Progress"
                                </p>
                            </div>
                            <div className="text-xs text-muted-foreground">
                                5 min ago
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                            <div className="flex-1 space-y-1">
                                <p className="text-sm font-medium">
                                    Payment received
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    $2,500 payment from Wilson Law Group
                                </p>
                            </div>
                            <div className="text-xs text-muted-foreground">
                                10 min ago
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                            <div className="flex-1 space-y-1">
                                <p className="text-sm font-medium">
                                    Document uploaded
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    Contract.pdf added to Case #1234
                                </p>
                            </div>
                            <div className="text-xs text-muted-foreground">
                                15 min ago
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <button className="w-full text-left p-3 rounded-lg border hover:bg-accent transition-colors">
                            <div className="font-medium">Add New Law Firm</div>
                            <div className="text-sm text-muted-foreground">
                                Register a new firm on the platform
                            </div>
                        </button>
                        <button className="w-full text-left p-3 rounded-lg border hover:bg-accent transition-colors">
                            <div className="font-medium">
                                Review Pending Cases
                            </div>
                            <div className="text-sm text-muted-foreground">
                                12 cases awaiting approval
                            </div>
                        </button>
                        <button className="w-full text-left p-3 rounded-lg border hover:bg-accent transition-colors">
                            <div className="font-medium">Generate Reports</div>
                            <div className="text-sm text-muted-foreground">
                                Create monthly analytics report
                            </div>
                        </button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
