import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Privacy Policy | Mode Men Magazine',
    description: 'Our commitment to your privacy and how we handle your personal information.',
};

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-black-primary text-foreground flex flex-col">
            <Header />

            <main className="flex-1 py-32 px-6">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl md:text-6xl font-serif text-white mb-12 border-b border-white/10 pb-8">
                        Privacy Policy
                    </h1>

                    <div className="prose prose-invert prose-lg max-w-none font-light leading-relaxed prose-headings:font-serif prose-headings:text-white prose-a:text-gold-primary">
                        <p className="text-xl text-muted-foreground mb-8">
                            Your privacy is of paramount importance to us. This policy outlines how Mode Men Magazine collects, uses, and protects your personal information.
                        </p>

                        <h3>1. Information Collection</h3>
                        <p>
                            We collect information you provide directly to us, such as when you create an account, subscribe to our newsletter, or make a purchase. This may include your name, email address, and payment information.
                        </p>

                        <h3>2. Use of Information</h3>
                        <p>
                            We use your information to provide, maintain, and improve our services, including processing transactions, sending content updates, and personalizing your experience.
                        </p>

                        <h3>3. Data Protection</h3>
                        <p>
                            We implement robust security measures to safeguard your personal data. We do not sell your personal information to third parties.
                        </p>

                        <h3>4. Cookies</h3>
                        <p>
                            Our website uses cookies to enhance user experience and analyze traffic. You can control cookie preferences through your browser settings.
                        </p>

                        <h3>5. Your Rights</h3>
                        <p>
                            You have the right to access, correct, or delete your personal data held by us. To exercise these rights, please contact our privacy team.
                        </p>

                        <div className="mt-12 pt-8 border-t border-white/10">
                            <p className="text-sm text-muted-foreground">
                                For privacy concerns, please contact <a href="mailto:privacy@modemenmag.com">privacy@modemenmag.com</a>.
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
