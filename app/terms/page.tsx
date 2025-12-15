import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Terms of Service | Mode Men Magazine',
    description: 'Read our Terms of Service regarding usage, intellectual property, and purchases.',
};

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-black-primary text-foreground flex flex-col">
            <Header />

            <main className="flex-1 py-32 px-6">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl md:text-6xl font-serif text-white mb-12 border-b border-white/10 pb-8">
                        Terms of Service
                    </h1>

                    <div className="prose prose-invert prose-lg max-w-none font-light leading-relaxed prose-headings:font-serif prose-headings:text-white prose-a:text-gold-primary">
                        <p className="text-xl text-muted-foreground mb-8">
                            Last Updated: {new Date().toLocaleDateString()}
                        </p>

                        <h3>1. Introduction</h3>
                        <p>
                            Welcome to Mode Men Magazine. By accessing our website, subscribing to our services, or purchasing our products, you agree to be bound by these Terms of Service. Please read them carefully.
                        </p>

                        <h3>2. Intellectual Property</h3>
                        <p>
                            All content published on this platform, including articles, photography, videos, and branding, is the exclusive property of Mode Men Magazine and protected by international copyright laws. Unauthorized reproduction is strictly prohibited.
                        </p>

                        <h3>3. User Conduct</h3>
                        <p>
                            We expect our community to engage with respect and integrity. Any form of harassment, hate speech, or spam will result in immediate termination of access.
                        </p>

                        <h3>4. Purchases & Refunds</h3>
                        <p>
                            All digital purchases (subscriptions, event tickets) are final unless otherwise stated. Physical goods may be returned within 14 days of receipt if they are in original condition.
                        </p>

                        <h3>5. Changes to Terms</h3>
                        <p>
                            We reserve the right to modify these terms at any time. Continued use of our platform constitutes acceptance of updated terms.
                        </p>

                        <div className="mt-12 pt-8 border-t border-white/10">
                            <p className="text-sm text-muted-foreground">
                                For legal inquiries, please contact <a href="mailto:legal@modemenmag.com">legal@modemenmag.com</a>.
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
