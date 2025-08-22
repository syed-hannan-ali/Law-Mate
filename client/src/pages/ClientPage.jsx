import { Routes, Route } from "react-router-dom";
import { DashboardOverview } from "@components/dashboard-overview";
import { CaseManagement } from "@components/case-management";
import { AppointmentManagement } from "@components/appointment-management";
import { DocumentManagement } from "@components/document-management";
import { TaskManagement } from "@components/task-management";
import { StaffLayout } from "@components/staff-layout";
import { CaseDetails } from "@components/CaseDetail";
import { ClientLayout } from "@components/client-layout";
import UserProfile from "@components/UserProfile";
import BillingHistory from "@components/billing-history";

export default function lawyerParalegalPage() {
    return (
        <Routes>
            <Route path="/" element={<ClientLayout />}>
                <Route index element={<DashboardOverview />} />
                <Route path="cases" element={<CaseManagement />} />
                <Route path="/profile" element={<UserProfile />} />
                <Route path="/billing-history" element={<BillingHistory />} />
                <Route path="/cases/:id" element={<CaseDetails />} />
                <Route
                    path="appointments"
                    element={<AppointmentManagement />}
                />
                <Route path="documents" element={<DocumentManagement />} />
                <Route path="tasks" element={<TaskManagement />} />
                {/* Optional fallback */}
                <Route path="*" element={<DashboardOverview />} />
            </Route>
        </Routes>
    );
}
