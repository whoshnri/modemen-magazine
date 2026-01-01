import { getUsers } from "@/app/actions/cms/users";
import Link from "next/link";
import { Edit } from "lucide-react";

export default async function UsersPage() {
    const { data: users } = await getUsers();

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 border-b border-white/10">
                <h2 className="text-2xl sm:text-3xl font-bold tracking-widest text-white">USERS</h2>
                <div className="bg-white/5 px-4 py-2 text-xs font-bold tracking-widest text-muted-foreground uppercase">
                    Total: {users?.length || 0}
                </div>
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-white/10 text-xs font-bold tracking-widest text-muted-foreground uppercase">
                            <th className="py-4 px-2">Name</th>
                            <th className="py-4 px-2">Email</th>
                            <th className="py-4 px-2">Role</th>
                            <th className="py-4 px-2">Plan</th>
                            <th className="py-4 px-2">Joined</th>
                            <th className="py-4 px-2">Action</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {users?.map((user) => (
                            <tr key={user.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                <td className="py-4 px-2 font-bold text-white">{user.name || "N/A"}</td>
                                <td className="py-4 px-2 text-muted-foreground">{user.email}</td>
                                <td className="py-4 px-2">
                                    <span className={`px-2 py-1 text-[10px] uppercase font-bold tracking-wider ${user.role === 'ADMIN' ? 'bg-gold-primary text-black-primary' : 'bg-white/10 text-white'
                                        }`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="py-4 px-2">
                                    <span className={`px-2 py-1 text-[10px] uppercase font-bold tracking-wider rounded-sm ${user.subscriptionPlan === 'PREMIUM' || user.subscriptionPlan === 'VIP'
                                        ? 'bg-gold-primary text-black-primary'
                                        : 'bg-white/10 text-muted-foreground'
                                        }`}>
                                        {user.subscriptionPlan}
                                    </span>
                                </td>
                                <td className="py-4 px-2 text-muted-foreground text-xs">
                                    {new Date(user.createdAt).toLocaleDateString()}
                                </td>
                                <td className="py-4 px-2">
                                    <Link href={`/cms/users/${user.id}`} className="text-gold-primary hover:text-white transition-colors">
                                        <Edit className="w-4 h-4" />
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-4">
                {users?.map((user) => (
                    <div key={user.id} className="border border-white/10 bg-[#0a0a0a] p-4 space-y-3">
                        <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-white mb-1">{user.name || "N/A"}</h3>
                                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                            </div>
                            <Link href={`/cms/users/${user.id}`} className="text-gold-primary hover:text-white transition-colors shrink-0 ml-2">
                                <Edit className="w-4 h-4" />
                            </Link>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <span className={`px-2 py-1 text-[10px] uppercase font-bold tracking-wider ${user.role === 'ADMIN' ? 'bg-gold-primary text-black-primary' : 'bg-white/10 text-white'
                                }`}>
                                {user.role}
                            </span>
                            <span className={`px-2 py-1 text-[10px] uppercase font-bold tracking-wider rounded-sm ${user.subscriptionPlan === 'PREMIUM' || user.subscriptionPlan === 'VIP'
                                ? 'bg-gold-primary text-black-primary'
                                : 'bg-white/10 text-muted-foreground'
                                }`}>
                                {user.subscriptionPlan}
                            </span>
                        </div>

                        <div className="text-xs text-muted-foreground pt-2 border-t border-white/5">
                            Joined: {new Date(user.createdAt).toLocaleDateString()}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
