"use client";

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCaseById, getTimelinesByCase } from "@services/case-service";
import { Badge } from "@components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { Clock, AlertCircle, CheckCircle } from "lucide-react";
import { User, Users, Plus, MessageCircle } from "lucide-react";
import { Button } from "@components/ui/button";
import { ChatModal } from "@components/chat-model";

const statusIcons = {
    open: <Clock className="inline mr-1" />,
    "in-progress": <AlertCircle className="inline mr-1" />,
    closed: <CheckCircle className="inline mr-1" />,
};

const statusColors = {
    open: "green ",
    "in-progress": "yellow",
    closed: "grey",
};

const typeColors = {
    note: "blue",
    update: "teal",
    deadline: "red",
};

const roleColors = {
    lawyer: "blue",
    paralegal: "purple",
    client: "green",
    admin: "red",
};

export function CaseDetails() {
    const { id } = useParams();
    const [caseData, setCaseData] = useState(null);
    const [timelines, setTimelines] = useState([]);
    const [isChatOpen, setIsChatOpen] = useState(false);

    useEffect(() => {
        fetchCase();
        fetchTimeline();
    }, [id]);

    const fetchCase = async () => {
        try {
            const res = await getCaseById(id);
            setCaseData(res.data);
        } catch (err) {
            console.error("Failed to fetch case details", err);
        }
    };

    const fetchTimeline = async () => {
        try {
            const res = await getTimelinesByCase(id);
            setTimelines(res.data);
        } catch (err) {
            console.error("Failed to fetch timeline", err);
        }
    };

    const handleOpenChat = () => {
        setIsChatOpen(true);
    };

    if (!caseData) return <p>Loading case details...</p>;

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between mt-4">
                <div className="text-3xl font-bold">{caseData.title}</div>

                <div className="flex gap-2">
                    <Button variant="outline" onClick={handleOpenChat}>
                        <MessageCircle className="mr-2 h-4 w-4" />
                        Chat
                    </Button>
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Timeline
                    </Button>
                </div>
            </div>
            <p className="text-muted-foreground">{caseData.description}</p>

            <div className="flex items-center gap-2">
                {statusIcons[caseData.status]}
                <Badge variant={statusColors[caseData.status]}>
                    {caseData.status}
                </Badge>
            </div>

            <Card className="mt-6">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-xl font-semibold flex items-center gap-2">
                        <User className="h-5 w-5 text-muted-foreground" />
                        Client Information
                    </CardTitle>
                </CardHeader>

                <CardContent className="text-sm text-muted-foreground">
                    {caseData.client ? (
                        <div className="space-y-1">
                            <p>
                                <span className="font-medium text-foreground">
                                    Name:
                                </span>{" "}
                                {caseData.client.username}
                            </p>
                            <p>
                                <span className="font-medium text-foreground">
                                    Email:
                                </span>{" "}
                                {caseData.client.email || "Not provided"}
                            </p>
                        </div>
                    ) : (
                        <p className="italic">
                            No client assigned to this case.
                        </p>
                    )}
                </CardContent>
            </Card>

            <Card className="mt-6">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-xl font-semibold flex items-center gap-2">
                        <Users className="h-5 w-5 text-muted-foreground" />
                        Assigned Staff
                    </CardTitle>
                </CardHeader>

                <CardContent className="text-sm text-muted-foreground">
                    {caseData.assignedStaff.length === 0 ? (
                        <p className="italic">No staff assigned yet.</p>
                    ) : (
                        <ul className="space-y-1">
                            {caseData.assignedStaff.map((user) => (
                                <li key={user._id} className="space-y-1">
                                    <div className="text-base font-medium text-foreground">
                                        {user.username}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge variant={roleColors[user.role]}>
                                            {user.role}
                                        </Badge>
                                        <span className="text-xs text-muted-foreground">
                                            {user.email || "No email"}
                                        </span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </CardContent>
            </Card>

            <div className="space-y-4">
                <h2 className="text-xl font-semibold mt-6">Case Timeline</h2>

                {timelines.length === 0 ? (
                    <p className="text-muted-foreground">
                        No timeline entries yet.
                    </p>
                ) : (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        {timelines.map((entry) => (
                            <Card key={entry._id} className="border shadow-sm">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        <Badge
                                            variant={
                                                typeColors[entry.type] ||
                                                "outline"
                                            }
                                        >
                                            {entry.type.toUpperCase()}
                                        </Badge>
                                    </CardTitle>
                                    <p className="text-xs text-muted-foreground">
                                        {new Date(
                                            entry.createdAt,
                                        ).toLocaleDateString()}
                                    </p>
                                </CardHeader>

                                <CardContent className="space-y-1 text-sm text-muted-foreground">
                                    <p>{entry.description}</p>

                                    {entry.dueDate && (
                                        <p className="text-xs text-red-500 font-medium">
                                            Deadline:{" "}
                                            {new Date(
                                                entry.dueDate,
                                            ).toLocaleDateString()}
                                        </p>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            <ChatModal
                isOpen={isChatOpen}
                onClose={() => setIsChatOpen(false)}
                caseId={id}
                assignedStaff={caseData.assignedStaff || []}
            />
        </div>
    );
}
