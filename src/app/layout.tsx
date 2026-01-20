import type { Metadata } from "next";
import "./globals.css";
import { siteConfig } from "@/lib/site";

const defaultDescription =
  "Premium Northern Cyprus tours, curated stays, and signature experiences.";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: siteConfig.name,
  description: defaultDescription,
  openGraph: {
    title: siteConfig.name,
    description: defaultDescription,
    url: siteConfig.url,
    siteName: siteConfig.name,
    type: "website",
    images: [
      {
        url: "/home/hero-luxury.jpg",
        width: 1200,
        height: 630,
        alt: "Cyprigo premium Northern Cyprus tours",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: defaultDescription,
    images: ["/home/hero-luxury.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
