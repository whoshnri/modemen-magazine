import { CMSSidebar } from "./components/cms-sidebar";
import { CMSMobileHeader } from "./components/cms-mobile-header";
import { Metadata } from 'next';
import { getActiveUserFromCookie } from "@/app/actions/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
    title: 'Modemen CMS',
    description: 'Content Management System',
    robots: {
        index: false,
        follow: false,
    },
};

export default async function CMSLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await getActiveUserFromCookie();

    if (!user || user.role !== 'ADMIN') {
        redirect('/');
    }

    return (
        <div className="flex flex-col lg:flex-row max-h-screen overflow-hidden bg-[#050505] text-white selection:bg-gold-primary/30">
            <CMSMobileHeader />
            <CMSSidebar />
            <main className="flex-1 overflow-y-auto h-screen scrollbar-hide">
                <div className="p-4 sm:p-6 lg:p-8 xl:p-12 max-w-[1600px] mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
