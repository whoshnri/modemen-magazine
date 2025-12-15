"use client";

import { useState, useTransition } from "react";
// import { $Enums } from "@/lib/generated/prisma/client"; // Removed to avoid browser issues
import { updateUserRole } from "@/app/actions/cms/users";
import { useToast } from "@/components/toast/use-toast";

const ROLES = ["USER", "ADMIN"];

// Use string type for prop to avoid import dependency, or assume it matches
export function UserRoleSelect({ userId, currentRole }: { userId: string, currentRole: any }) {
    const [role, setRole] = useState(currentRole);
    const [isPending, startTransition] = useTransition();
    const { showToast } = useToast();

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newRole = e.target.value;
        setRole(newRole);
        startTransition(async () => {
            const result = await updateUserRole(userId, newRole as any);
            if (result.success) {
                showToast("User role updated", "success");
            } else {
                showToast(result.error || "Failed", "error");
                setRole(currentRole); // Revert
            }
        });
    };

    return (
        <select
            value={role}
            onChange={handleChange}
            disabled={isPending}
            className="w-full bg-[#050505] border border-white/10 text-white p-3 text-sm focus:border-gold-primary outline-none uppercase tracking-widest disabled:opacity-50"
        >
            {ROLES.map((r) => (
                <option key={r} value={r}>{r}</option>
            ))}
        </select>
    );
}
