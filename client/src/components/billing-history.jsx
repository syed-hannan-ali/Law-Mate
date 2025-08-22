import { useEffect, useState } from "react";
import axios from "@config/axios";
import { Button } from "@components/ui/button";

export default function BillingHistory() {
    const [bills, setBills] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const response = await axios.get("/billings/my-bills");
            setBills(response.data);
        };
        fetchData();
    }, []);

    const downloadInvoice = async (billId) => {
        try {
            const response = await axios.get(`/billings/invoice/${billId}`, {
                responseType: "blob",
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `invoice-${billId}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error("Error downloading invoice:", error);
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-xl font-bold mb-4">Billing History</h2>
            <div className="space-y-4">
                {bills.map((bill) => (
                    <div
                        key={bill._id}
                        className="border p-4 rounded-lg shadow-sm"
                    >
                        <h3 className="font-semibold">{bill.case.title}</h3>
                        <p>Due: {new Date(bill.dueDate).toDateString()}</p>
                        <p>Total: ${bill.total}</p>
                        <Button
                            variant="outline"
                            className="mt-2"
                            onClick={() => downloadInvoice(bill._id)}
                        >
                            Download Invoice
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    );
}
