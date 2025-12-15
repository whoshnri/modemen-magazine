import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inria_Serif, Playfair_Display } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/toast/toast-provider";
import { SessionProvider } from "@/context/SessionProvider";
import { getActiveUserFromCookie } from "./actions/auth";
import { runMainCreate } from "./actions/createArticle";
import { ShopProvider } from "@/components/shop-context";



const inriaSerif =  Inria_Serif({
  subsets: ["latin"],
  weight: ["300"],
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
  const GA_MEASUREMENT_ID = "G-VW4VRMGDFC"
  // await runMainCreate()

  return (
    <html lang="en">
      <head>
        {/* Google Analytics Scripts */}  
        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', {
              page_path: window.location.pathname,
            });
          `,
          }}
        />
      </head>
      <body
        className={`${inriaSerif.className} antialiased bg-black-primary text-foreground overflow-hidden overflow-y-auto`}
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
