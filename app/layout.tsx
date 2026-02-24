import type { Metadata } from "next";
import { Playfair_Display, Source_Sans_3 } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppContactButton from "@/components/WhatsAppContactButton";

const headingFont = Playfair_Display({ subsets: ["latin"], weight: ["700"], variable: '--font-heading' });
const bodyFont = Source_Sans_3({ subsets: ["latin"], weight: ["400", "600"], variable: '--font-body' });
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://capitalmasters.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "CapitalMasters | Coffee & Cocoa Investment Club",
    template: "%s | CapitalMasters",
  },
  description: "CapitalMasters is an investment club founded by Andrew Tugume, focused on coffee and cocoa investments with transparent digital compliance and disciplined growth.",
  keywords: [
    "CapitalMasters",
    "Andrew Tugume",
    "coffee investment",
    "cocoa investment",
    "Uganda investment club",
    "SHG investment",
    "8 percent ROI",
    "wealth building Uganda",
  ],
  authors: [{ name: "Andrew Tugume", url: siteUrl }],
  creator: "Andrew Tugume",
  publisher: "CapitalMasters",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "CapitalMasters | Coffee & Cocoa Investment Club",
    description: "Founded by Andrew Tugume, CapitalMasters helps members invest in coffee and cocoa through transparent digital operations.",
    type: "website",
    url: siteUrl,
    siteName: "CapitalMasters",
    locale: "en_UG",
  },
  twitter: {
    card: "summary_large_image",
    title: "CapitalMasters | Coffee & Cocoa Investment Club",
    description: "Founded by Andrew Tugume. Invest in coffee and cocoa with disciplined digital compliance.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
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
    <html lang="en" className={`${headingFont.variable} ${bodyFont.variable}`} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <AuthProvider>
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
          <WhatsAppContactButton />
        </AuthProvider>
      </body>
    </html>
  );
}
