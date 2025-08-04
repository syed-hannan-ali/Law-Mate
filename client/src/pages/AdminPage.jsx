import { Routes, Route } from "react-router-dom";
import { DashboardOverview } from "@components/dashboard-overview";
import { UserManagement } from "@components/user-management";
import { FirmManagement } from "@components/firm-management";
import { CaseManagement } from "@components/case-management";
import { AppointmentManagement } from "@components/appointment-management";
import { AuditLogs } from "@components/audit-logs";
import { DocumentManagement } from "@components/document-management";
import { InvoiceManagement } from "@components/invoice-management";
import { PaymentManagement } from "@components/payment-management";
import { TaskManagement } from "@components/task-management";
import { AdminLayout } from "@components/admin-layout";
import {CaseDetails} from "@components/CaseDetail";

export default function AdminDashboard() {
    return (
        <Routes>
            <Route path="/" element={<AdminLayout />}>
                <Route index element={<DashboardOverview />} />
                <Route path="users" element={<UserManagement />} />
                <Route path="firms" element={<FirmManagement />} />
                <Route path="cases" element={<CaseManagement />} />
                <Route path="/cases/:id" element={<CaseDetails />} />
                <Route      
                    path="appointments"
                    element={<AppointmentManagement />}
                />
                <Route path="audit" element={<AuditLogs />} />
                <Route path="documents" element={<DocumentManagement />} />
                <Route path="invoices" element={<InvoiceManagement />} />
                <Route path="payments" element={<PaymentManagement />} />
                <Route path="tasks" element={<TaskManagement />} />
                {/* Optional fallback */}
                <Route path="*" element={<DashboardOverview />} />
            </Route>
        </Routes>
    );
}
