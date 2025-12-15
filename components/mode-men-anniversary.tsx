import Image from 'next/image';
import Link from 'next/link';

export default function ModeMenAnniversary() {
    return (
        <section className="relative py-24 md:py-32 bg-black-primary text-foreground overflow-hidden border-t border-b border-gold-primary/20">
            <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
                {/* Abstract texture for premium feel */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--gold-primary)_0%,_transparent_70%)] opacity-5"></div>
            </div>

            <div className="container-responsive relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div className="order-2 lg:order-1 relative">
                        <div className="relative aspect-[4/5] w-full max-w-md mx-auto">
                            <Image
                                src="https://images.unsplash.com/photo-1519748771451-a94c596fad67?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fG1hZ2F6aW5lfGVufDB8fDB8fHww"
                                alt="ModeMen 20th Anniversary"
                                width={1500}
                                height={1500}
                                className="w-full h-full relative object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                                priority
                            />
                            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gold-primary/10 border border-gold-primary/30 backdrop-blur-sm hidden md:flex items-center justify-center p-4">
                                <span className="text-4xl font-serif text-gold-primary">20</span>
                            </div>
                        </div>
                    </div>

                    <div className="order-1 lg:order-2 text-left">
                        <h4 className="text-gold-primary tracking-[0.2em] text-sm font-bold mb-4 uppercase">Est. 2005</h4>
                        <h1 className="text-5xl md:text-7xl font-serif font-medium mb-8 leading-tight">
                            The Legacy <br /> Continues
                        </h1>
                        <p className="text-lg md:text-xl text-muted-foreground font-light leading-relaxed mb-6 max-w-xl">
                            Two decades of defining African masculinities. From the pages that started it all to the digital future we are building.
                        </p>
                        <p className="text-base text-gray-400 mb-10 leading-relaxed max-w-lg">
                            Experience the archive, the exclusive interviews, and the upcoming gala. This is Mode Men at 20.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-6">
                            <Link
                                href="/anniversary"
                                className="inline-flex items-center justify-center px-8 py-4 bg-gold-primary text-black-primary font-bold tracking-widest hover:bg-gold-secondary transition-colors duration-300 uppercase text-xs"
                            >
                                Explore The Anniversary
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
