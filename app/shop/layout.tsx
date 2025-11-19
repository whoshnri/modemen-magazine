import type { Metadata, Viewport } from "next";
import { ToastProvider } from "@/components/toast/toast-provider";



export const metadata: Metadata = {
  title: "Modemen Mag | Fashion, Lifestyle & Culture",
  description:
    "Premium editorial content featuring men's fashion, lifestyle, and high-end culture",
  icons: {
    icon: "/icon.svg",
  },
};


export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <div>{children}</div>
  );
}
