'use client';

import { updateUserRole } from "@/app/actions/cms/users";
import { Role } from "@prisma/client";
import { useTransition } from "react";
import { useToast } from "@/components/toast/use-toast";

export function RoleSelect({ id, currentRole, currentUserId }: { id: string, currentRole: Role, currentUserId?: string }) {
    const [isPending, startTransition] = useTransition();
    const { showToast } = useToast();

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newRole = e.target.value as Role;

        if (id === currentUserId && newRole !== 'ADMIN') {
            if (!confirm("Warning: You are about to remove your own Admin privileges. You will lose access to the CMS immediately.")) {
                return;
            }
        }

        startTransition(async () => {
            const result = await updateUserRole(id, newRole);
            if (result.error) {
                showToast(result.error, 'error');
            } else {
                showToast('User role updated', 'success');
            }
        });
    }

    return (
        <div className="relative">
            <select
                value={currentRole}
                onChange={handleChange}
                disabled={isPending}
                className={`appearance-none bg-transparent border text-xs font-bold uppercase tracking-widest px-3 py-1 pr-6 focus:outline-none transition-colors disabled:opacity-50 ${currentRole === 'ADMIN'
                        ? 'border-gold-primary text-gold-primary'
                        : 'border-white/20 text-muted-foreground'
                    }`}
            >
                {Object.values(Role).map(role => (
                    <option key={role} value={role} className="bg-black">{role}</option>
                ))}
            </select>
        </div>
    )
}
