import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCaseById, getTimelinesByCase } from "@services/case-service";
import { Badge } from "@components/ui/badge";
import { Clock, AlertCircle, CheckCircle } from "lucide-react";

const statusIcons = {
    open: <Clock className="inline mr-1" />,
    "in-progress": <AlertCircle className="inline mr-1" />,
    closed: <CheckCircle className="inline mr-1" />,
};

const statusColors = {
    open: "default",
    "in-progress": "destructive",
    closed: "outline",
};

export function CaseDetails() {
    const { id } = useParams();
    const [caseData, setCaseData] = useState(null);
    const [timelines, setTimelines] = useState([]);

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

    if (!caseData) return <p>Loading case details...</p>;

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-3xl font-bold">{caseData.title}</h1>
            <p className="text-muted-foreground">{caseData.description}</p>

            <div className="flex items-center gap-2">
                {statusIcons[caseData.status]}
                <Badge variant={statusColors[caseData.status]}>{caseData.status}</Badge>
            </div>

            <div>
                <h2 className="text-xl font-semibold mt-6">Client</h2>
                <p>{caseData.client?.username || "N/A"}</p>
            </div>

            <div>
                <h2 className="text-xl font-semibold mt-6">Assigned Staff</h2>
                <ul className="list-disc pl-4">
                    {caseData.assignedStaff?.map((s) => (
                        <li key={s._id}>{s.username}</li>
                    ))}
                </ul>
            </div>

            <div>
                <h2 className="text-xl font-semibold mt-6">Case Timeline</h2>
                {timelines.length === 0 ? (
                    <p className="text-muted-foreground">
                        No timeline entries yet.
                    </p>
                ) : (
                    <ul className="space-y-3 mt-3">
                        {timelines.map((entry) => (
                            <li key={entry._id} className="border p-3 rounded">
                                <strong>{entry.type.toUpperCase()}</strong>:{" "}
                                {entry.description}
                                {entry.dueDate && (
                                    <div className="text-xs text-muted-foreground">
                                        Deadline:{" "}
                                        {new Date(
                                            entry.dueDate,
                                        ).toLocaleDateString()}
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
