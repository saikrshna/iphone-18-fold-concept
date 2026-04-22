import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | iPhone 18 Fold Concept",
    default: "iPhone 18 Fold Concept - The Infinite Unfolded",
  },
  description: "Experience the conceptual iPhone 18 Fold. Discover the aerospace-grade titanium design, conceptual A18 Pro chip, and incredibly smooth dual-screen foldable experience.",
  keywords: ["iPhone 18 Fold", "Apple Foldable Concept", "Foldable iPhone", "Apple Design Concept", "Next generation iPhone", "A18 Pro chip"],
  authors: [{ name: "Your Studio" }],
  creator: "Your Studio",
  publisher: "Your Studio",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "iPhone 18 Fold Concept - Experience the Future",
    description: "Experience the conceptual iPhone 18 Fold. A visually stunning, scroll-driven interactive design concept.",
    url: "https://yourwebsite.com",
    siteName: "iPhone 18 Fold Concept Showcase",
    images: [
      {
        url: "https://yourwebsite.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "iPhone 18 Fold Concept hero shot",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "iPhone 18 Fold Concept",
    description: "Experience the ultimate foldable concept in aerospace-grade titanium.",
    images: ["https://yourwebsite.com/twitter-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
