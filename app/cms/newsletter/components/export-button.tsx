'use client';

import { getAllSubscribersForExport } from "@/app/actions/cms/newsletter";
import { useState } from "react";
import { useToast } from "@/components/toast/use-toast";

export function ExportSubscribersButton() {
    const [isExporting, setIsExporting] = useState(false);
    const { showToast } = useToast();

    const handleExport = async () => {
        setIsExporting(true);
        try {
            const subscribers = await getAllSubscribersForExport();

            // Simple CSV Generation
            const headers = ["Email", "Status", "Joined Date", "Linked User"];
            const rows = subscribers.map(sub => [
                sub.email,
                sub.isSubscribed ? "Active" : "Unsubscribed",
                new Date(sub.createdAt).toISOString().split('T')[0],
                sub.user?.name || "N/A"
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
            link.setAttribute("download", `subscribers_export_${new Date().toISOString().split('T')[0]}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            showToast("Subscribers exported successfully", "success");
        } catch (error) {
            console.error(error);
            showToast("Failed to export subscribers", "error");
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
