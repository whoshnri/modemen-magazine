'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export function CMSMobileHeader() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    const links = [
        { label: 'Overview', href: '/cms' },
        { label: 'Articles', href: '/cms/articles' },
        { label: 'Products', href: '/cms/products' },
        { label: 'Ads', href: '/cms/ads' },
        { label: 'Sponsored', href: '/cms/sponsored' },
        { label: 'Issues', href: '/cms/issues' },
        { label: 'Categories', href: '/cms/categories' },
        { label: 'Users', href: '/cms/users' },
        { label: 'Newsletter', href: '/cms/newsletter' },
        { label: 'Settings', href: '/cms/settings' },
    ];

    return (
        <>
            {/* Mobile Header - Sticky */}
            <header className="lg:hidden sticky top-0 z-50 bg-[#050505] border-b border-white/10">
                <div className="flex items-center justify-between p-4">
                    <h1 className="text-sm font-bold tracking-[0.2em] text-white">
                        MODE MEN <span className="text-gold-primary">CMS</span>
                    </h1>
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="p-2 text-white hover:text-gold-primary transition-colors"
                        aria-label="Toggle menu"
                    >
                        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </header>

            {/* Mobile Slide-in Menu */}
            <div
                className={`lg:hidden fixed inset-0 z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                    }`}
            >
                {/* Backdrop */}
                <div
                    className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    onClick={() => setIsOpen(false)}
                />

                {/* Slide-in Panel */}
                <div
                    className={`absolute top-[57px] left-0 bottom-0 w-64 bg-[#050505] border-r border-white/10 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'
                        }`}
                >
                    <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto h-full">
                        {links.map((link) => {
                            const isActive = pathname === link.href;
                            const isSubActive = link.href !== '/cms' && pathname.startsWith(link.href);
                            const active = isActive || isSubActive;

                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setIsOpen(false)}
                                    className={`block px-4 py-3 text-xs font-bold tracking-[0.15em] uppercase transition-all duration-300 border-l-2 ${active
                                            ? 'border-gold-primary text-white bg-white/5'
                                            : 'border-transparent text-muted-foreground hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    {link.label}
                                </Link>
                            );
                        })}

                        <div className="pt-6 mt-6 border-t border-white/10">
                            <Link
                                href="/"
                                className="block px-4 py-3 text-[10px] font-bold tracking-widest text-muted-foreground hover:text-white transition-colors"
                            >
                                ← BACK TO SITE
                            </Link>
                        </div>
                    </nav>
                </div>
            </div>
        </>
    );
}
