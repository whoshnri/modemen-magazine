import { getUserById, updateUserRole, updateUserSubscription } from "@/app/actions/cms/users";
import { notFound } from "next/navigation";
import Link from "next/link";
import { UserRoleSelect } from "./components/role-select"; 
import { UserPlanSelect } from "./components/plan-select"; 

export default async function EditUserPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const user = await getUserById(id);

    if (!user) {
        notFound();
    }

    return (
        <div className="space-y-8 max-w-4xl">
            <div className="flex items-center justify-between pb-8 border-b border-white/10">
                <h2 className="text-3xl font-bold tracking-widest text-white">EDIT USER</h2>
                <Link
                    href="/cms/users"
                    className="text-xs font-bold tracking-widest text-muted-foreground hover:text-white transition-colors uppercase"
                >
                    ← Back to List
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-8">
                    <div className="space-y-2">
                        <label className="text-xs font-bold tracking-widest text-gold-primary uppercase">Full Name</label>
                        <div className="p-4 bg-white/5 border border-white/10 text-white font-bold">{user.name || "N/A"}</div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold tracking-widest text-gold-primary uppercase">Email Address</label>
                        <div className="p-4 bg-white/5 border border-white/10 text-white">{user.email}</div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold tracking-widest text-gold-primary uppercase">User ID</label>
                        <div className="p-4 bg-white/5 border border-white/10 text-muted-foreground text-xs font-mono">{user.id}</div>
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="space-y-4 border border-white/10 p-6 bg-[#0a0a0a]">
                        <h3 className="text-xl font-bold tracking-widest text-white mb-4">PERMISSIONS & PLAN</h3>

                        <div className="space-y-2">
                            <label className="text-xs font-bold tracking-widest text-muted-foreground uppercase">Role</label>
                            <UserRoleSelect userId={user.id} currentRole={user.role} />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold tracking-widest text-muted-foreground uppercase">Subscription Plan</label>
                            <UserPlanSelect userId={user.id} currentPlan={user.subscriptionPlan} />
                        </div>
                    </div>

                    <div className="space-y-4 border border-white/10 p-6 bg-[#0a0a0a]">
                        <h3 className="text-xl font-bold tracking-widest text-white mb-4">ACTIVITY SUMMARY</h3>
                        <div className="flex justify-between items-center py-2 border-b border-white/10">
                            <span className="text-sm text-muted-foreground">Orders</span>
                            <span className="font-bold text-white">{user.orders.length}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-white/10">
                            <span className="text-sm text-muted-foreground">Addresses</span>
                            <span className="font-bold text-white">{user.addresses.length}</span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                            <span className="text-sm text-muted-foreground">Newsletter</span>
                            <span className={`font-bold ${user.newsletterSubscription?.isSubscribed ? 'text-green-500' : 'text-red-500'}`}>
                                {user.newsletterSubscription?.isSubscribed ? 'Subscribed' : 'Not Subscribed'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
