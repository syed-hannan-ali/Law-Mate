import { useState } from "react";
import { AdminLayout } from "@components/admin-layout";
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

export default function AdminDashboard() {
    const [activeSection, setActiveSection] = useState("dashboard");

    const renderContent = () => {
        switch (activeSection) {
            case "dashboard":
                return <DashboardOverview />;
            case "users":
                return <UserManagement />;
            case "firms":
                return <FirmManagement />;
            case "cases":
                return <CaseManagement />;
            case "appointments":
                return <AppointmentManagement />;
            case "audit":
                return <AuditLogs />;
            case "documents":
                return <DocumentManagement />;
            case "invoices":
                return <InvoiceManagement />;
            case "payments":
                return <PaymentManagement />;
            case "tasks":
                return <TaskManagement />;
            default:
                return <DashboardOverview />;
        }
    };

    return (
        <AdminLayout
            activeSection={activeSection}
            setActiveSection={setActiveSection}
        >
            {renderContent()}
        </AdminLayout>
    );
}
