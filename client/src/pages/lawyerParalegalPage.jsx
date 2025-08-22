import { Routes, Route } from "react-router-dom";
import { DashboardOverview } from "@components/dashboard-overview";
import { CaseManagement } from "@components/case-management";
import { AppointmentManagement } from "@components/appointment-management";
import { DocumentManagement } from "@components/document-management";
import { TaskManagement } from "@components/task-management";
import { StaffLayout } from "@components/staff-layout";
import { CaseDetails } from "@components/CaseDetail";
import ChatPage from "@components/chat-interface";
import UserProfile from "@components/UserProfile";
import TimeTracker from "@components/TimeTracker";
import BillingDashboard from "@components/staff-billing";

export default function lawyerParalegalPage() {
    return (
        <Routes>
            <Route path="/" element={<StaffLayout />}>
                <Route index element={<DashboardOverview />} />
                <Route path="cases" element={<CaseManagement />} />
                <Route path="/profile" element={<UserProfile />} />
                <Route path="/chat" element={<ChatPage />} />
                <Route path="/billing" element={<BillingDashboard />} />
                <Route path="/cases/:id" element={<CaseDetails />} />
                <Route
                    path="appointments"
                    element={<AppointmentManagement />}
                />
                <Route path="documents" element={<DocumentManagement />} />
                <Route path="tasks" element={<TaskManagement />} />
                <Route path="time-tracking" element={<TimeTracker />} />
                {/* Optional fallback */}
                <Route path="*" element={<DashboardOverview />} />
            </Route>
        </Routes>
    );
}
