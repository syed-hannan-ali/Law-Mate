import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@components/ui/dialog";

const CaseViewModal = ({ show, onClose, caseData }) => {
    if (!show || !caseData) return null;

    return (
        <Dialog open={show} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{caseData.title}</DialogTitle>
                </DialogHeader>

                <div className="space-y-2 text-sm text-muted-foreground">
                    <p>
                        <strong>Description:</strong> {caseData.description || "N/A"}
                    </p>
                    <p>
                        <strong>Status:</strong> {caseData.status || "N/A"}
                    </p>
                    <p>
                        <strong>Client:</strong> {caseData.client?.username || "N/A"}
                    </p>
                    <p>
                        <strong>Assigned Staff:</strong>{" "}
                        {caseData.assignedStaff?.length
                            ? caseData.assignedStaff.map((s) => s.username).join(", ")
                            : "None"}
                    </p>
                    <p>
                        <strong>Tags:</strong>{" "}
                        {caseData.tags?.length ? caseData.tags.join(", ") : "None"}
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default CaseViewModal;
