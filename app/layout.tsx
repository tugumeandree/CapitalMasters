import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });

export const metadata: Metadata = {
  title: "CapitalMasters - Professional Investment Management",
  description: "Leading investment company providing comprehensive wealth management solutions, portfolio diversification, and financial advisory services.",
  keywords: ["investment", "wealth management", "financial advisory", "portfolio management", "CapitalMasters"],
  authors: [{ name: "CapitalMasters" }],
  openGraph: {
    title: "CapitalMasters - Professional Investment Management",
    description: "Leading investment company providing comprehensive wealth management solutions.",
    type: "website",
    url: process.env.NEXT_PUBLIC_SITE_URL,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <AuthProvider>
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
