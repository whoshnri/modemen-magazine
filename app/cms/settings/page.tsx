import { getUsers } from "@/app/actions/cms/users";
import { getActiveUserFromCookie } from "@/app/actions/auth";
import Link from "next/link";
import { RoleSelect } from "./components/role-select";

export const dynamic = 'force-dynamic';

export default async function SettingsPage({
    searchParams,
}: {
    searchParams?: { page?: string, search?: string };
}) {
    const { page: pageParam, search: searchParam } = await searchParams || {};
    const page = Number(pageParam) || 1;
    const search = searchParam || "";

    const [userData, currentUser] = await Promise.all([
        getUsers(page, search),
        getActiveUserFromCookie()
    ]);

    const { users, total, pages } = userData;

    return (
        <div className="space-y-12">
            <div>
                <h2 className="text-3xl font-bold tracking-widest mb-2">SETTINGS</h2>
                <p className="text-muted-foreground text-xs uppercase tracking-widest">Admin Control & User Management</p>
            </div>

            <div className="border border-white/10 bg-[#0a0a0a] p-8">
                <h3 className="text-lg font-bold text-white mb-6 tracking-widest flex items-center gap-4">
                    USER MANAGEMENT <span className="text-xs text-muted-foreground font-normal bg-white/5 px-2 py-1 rounded-full">{total} Users</span>
                </h3>

                {/* Simple Search */}
                <form className="mb-8">
                    <input
                        name="search"
                        placeholder="Search users..."
                        defaultValue={search}
                        className="bg-[#050505] border border-white/10 px-4 py-2 text-sm text-white focus:border-gold-primary transition-colors w-full max-w-md outline-none"
                    />
                </form>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="border-b border-white/10 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                            <tr>
                                <th className="p-4">User</th>
                                <th className="p-4">Email</th>
                                <th className="p-4">Joined</th>
                                <th className="p-4">Role</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {users.map((user) => (
                                <tr key={user.id} className="group hover:bg-white/5 transition-colors">
                                    <td className="p-4 font-bold text-sm text-white">
                                        {user.name || "Guest"}
                                        {user.id === currentUser?.id && <span className="ml-2 text-[10px] text-gold-primary">(YOU)</span>}
                                    </td>
                                    <td className="p-4 text-xs text-muted-foreground">{user.email}</td>
                                    <td className="p-4 text-xs font-mono text-muted-foreground">{new Date(user.createdAt).toLocaleDateString()}</td>
                                    <td className="p-4">
                                        <RoleSelect
                                            id={user.id}
                                            currentRole={user.role}
                                            currentUserId={currentUser?.id}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex justify-center gap-2 mt-8">
                    {Array.from({ length: pages > 10 ? 10 : pages }).map((_, i) => (
                        <Link
                            key={i}
                            href={`/cms/settings?page=${i + 1}`}
                            className={`w-8 h-8 flex items-center justify-center text-xs font-bold border ${page === i + 1 ? 'border-gold-primary text-gold-primary' : 'border-white/10 text-muted-foreground hover:border-white hover:text-white'} transition-colors`}
                        >
                            {i + 1}
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
