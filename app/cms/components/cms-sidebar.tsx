'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function CMSSidebar() {
    const pathname = usePathname();

    const links = [
        { label: 'Overview', href: '/cms' },
        { label: 'Articles', href: '/cms/articles' },
        { label: 'Products', href: '/cms/products' },
        { label: 'Orders', href: '/cms/orders' },
        { label: 'Newsletter', href: '/cms/newsletter' },
        { label: 'Settings', href: '/cms/settings' },
    ];

    return (
        <aside className="w-64 bg-[#050505] border-r border-white/10 flex flex-col h-screen sticky top-0">
            <div className="p-8 border-b border-white/10">
                <h1 className="text-xl font-bold tracking-[0.2em] text-white">
                    MODE MEN <span className="text-gold-primary">CMS</span>
                </h1>
            </div>

            <nav className="flex-1 py-8 px-6 space-y-2">
                {links.map((link) => {
                    const isActive = pathname === link.href;
                    // Sub-path check for nested routes
                    const isSubActive = link.href !== '/cms' && pathname.startsWith(link.href);
                    const active = isActive || isSubActive;

                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`block px-4 py-3 text-xs font-bold tracking-[0.15em] uppercase transition-all duration-300 border-l-2 ${active
                                    ? 'border-gold-primary text-white bg-white/5'
                                    : 'border-transparent text-muted-foreground hover:text-white hover:bg-white/5'
                                }`}
                        >
                            {link.label}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-8 border-t border-white/10">
                <Link href="/" className="text-[10px] font-bold tracking-widest text-muted-foreground hover:text-white transition-colors">
                    ← BACK TO SITE
                </Link>
            </div>
        </aside>
    );
}
