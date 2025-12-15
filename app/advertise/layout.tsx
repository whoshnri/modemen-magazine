import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Advertise with Mode Men | Reach the New African Gentleman",
    description: "Partner with Mode Men Magazine to connect with a discerning audience of leaders, influencers, and tastemakers shaping the future of Africa.",
    openGraph: {
        title: "Advertise with Mode Men",
        description: "Connect with the pulse of modern African masculinity. Explore our media kit and partnership opportunities.",
    },
};

export default function AdvertiseLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
