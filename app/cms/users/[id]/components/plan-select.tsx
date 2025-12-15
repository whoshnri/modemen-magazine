"use client";

import { useState, useTransition } from "react";
// import { $Enums } from "@/lib/generated/prisma/client";
import { updateUserSubscription } from "@/app/actions/cms/users";
import { useToast } from "@/components/toast/use-toast";

const PLANS = ["FREE", "PREMIUM", "VIP"];

export function UserPlanSelect({ userId, currentPlan }: { userId: string, currentPlan: any }) {
    const [plan, setPlan] = useState(currentPlan);
    const [isPending, startTransition] = useTransition();
    const { showToast } = useToast();

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newPlan = e.target.value;
        setPlan(newPlan);
        startTransition(async () => {
            const result = await updateUserSubscription(userId, newPlan as any);
            if (result.success) {
                showToast("Subscription plan updated", "success");
            } else {
                showToast(result.error || "Failed", "error");
                setPlan(currentPlan); // Revert
            }
        });
    };

    return (
        <select
            value={plan}
            onChange={handleChange}
            disabled={isPending}
            className="w-full bg-[#050505] border border-white/10 text-white p-3 text-sm focus:border-gold-primary outline-none uppercase tracking-widest disabled:opacity-50"
        >
            {PLANS.map((p) => (
                <option key={p} value={p}>{p}</option>
            ))}
        </select>
    );
}
