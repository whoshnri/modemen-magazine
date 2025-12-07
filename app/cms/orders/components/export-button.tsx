'use client';

import { getAllOrdersForExport } from "@/app/actions/cms/orders";
import { useState } from "react";
import { useToast } from "@/components/toast/use-toast";

export function ExportOrdersButton() {
    const [isExporting, setIsExporting] = useState(false);
    const { showToast } = useToast();

    const handleExport = async () => {
        setIsExporting(true);
        try {
            const orders = await getAllOrdersForExport();

            // Simple CSV Generation
            const headers = ["Order ID", "Date", "Customer Name", "Customer Email", "Status", "Total", "Items Count", "Shipping City"];
            const rows = orders.map(order => [
                order.orderId,
                new Date(order.createdAt).toISOString().split('T')[0],
                order.user.name || "Guest",
                order.user.email,
                order.status,
                order.total.toFixed(2),
                order.items.length,
                order.shippingAddress?.city || "N/A"
            ]);

            const csvContent = [
                headers.join(","),
                ...rows.map(row => row.join(","))
            ].join("\n");

            // Download Trigger
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement("a");
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", `orders_export_${new Date().toISOString().split('T')[0]}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            showToast("Orders exported successfully", "success");
        } catch (error) {
            console.error(error);
            showToast("Failed to export orders", "error");
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <button
            onClick={handleExport}
            disabled={isExporting}
            className="px-6 py-3 border border-gold-primary text-gold-primary font-bold text-xs uppercase tracking-widest hover:bg-gold-primary hover:text-black transition-colors disabled:opacity-50"
        >
            {isExporting ? 'EXPORTING...' : 'EXPORT CSV'}
        </button>
    );
}
