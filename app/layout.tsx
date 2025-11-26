import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inria_Serif } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/toast/toast-provider";
import { SessionProvider } from "@/context/SessionProvider";
import { getActiveUserFromCookie } from "./actions/auth";
import { runMainCreate } from "./actions/createArticle";
import { ShopProvider } from "@/components/shop-context";

const inriaSerif = Inria_Serif({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  variable: "--font-inria",
});

export const metadata: Metadata = {
  title: "Modemen Mag | Fashion, Lifestyle & Culture",
  description:
    "Premium editorial content featuring men's fashion, lifestyle, and high-end culture",
  icons: {
    icon: "/icon.svg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  userScalable: true,
  themeColor: "#d4af37",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getActiveUserFromCookie();
  //  runMainCreate();

  return (
    <html lang="en">
      <body
        className={`${inriaSerif.className} font-sans antialiased bg-black-primary text-foreground`}
      >
        <SessionProvider initialSession={session}>
          <ShopProvider>
          <ToastProvider>{children}</ToastProvider>
          </ShopProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
