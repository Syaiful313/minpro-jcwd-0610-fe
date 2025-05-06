import { Toaster } from "@/components/ui/sonner";
import NextAuthProvider from "@/providers/NextAuthProvider";
import ReactQueryProvider from "@/providers/ReactQueryProvider";
import StoreProvider from "@/providers/StoreProvider";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";
import TokenProvider from "@/providers/TokenProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EventNesia | Platform Event Terbaik di Indonesia",
  description: "EventNesia - Temukan dan kelola event favorit Anda di seluruh Indonesia dengan mudah dan cepat.",
  keywords: ["event", "indonesia", "konser", "seminar", "festival", "tiket"],
  authors: [{ name: "EventNesia Team" }],
  creator: "EventNesia",
  publisher: "EventNesia",
  openGraph: {
    title: "EventNesia | Platform Event Terbaik di Indonesia",
    description: "Temukan dan kelola event favorit Anda di seluruh Indonesia dengan mudah dan cepat.",
    url: "https://eventnesia.com",
    siteName: "EventNesia",
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "EventNesia | Platform Event Terbaik di Indonesia",
    description: "Temukan dan kelola event favorit Anda di seluruh Indonesia dengan mudah dan cepat.",
    creator: "@eventnesia",
  },
 
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ReactQueryProvider>
          <StoreProvider>
            <NextAuthProvider>
              <TokenProvider>{children}</TokenProvider>
            </NextAuthProvider>
          </StoreProvider>
        </ReactQueryProvider>
        <Toaster position="top-right" duration={1000} />
      </body>
    </html>
  );
}
