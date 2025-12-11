// layout.tsx
import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import "./modal-styles.css";
import "react-tooltip/dist/react-tooltip.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const roboto = Roboto({
  weight: ["100", "300", "400", "500", "700", "900"],
  subsets: ["latin"],
  variable: "--font-roboto",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Idle Clans Finder | Player Search & Stats",
  description:
    "Search and view detailed player statistics, skills, and local market upgrades for Idle Clans. Find player profiles, skill levels, and game progression easily.",
  keywords:
    "Idle Clans, player finder, game stats, skills tracker, local market upgrades, MMORPG stats",
  authors: [{ name: "Idle Clans Finder" }],
  openGraph: {
    title: "Idle Clans Finder | Player Search & Stats",
    description:
      "Search and view detailed player statistics, skills, and local market upgrades for Idle Clans",
    type: "website",
    siteName: "Idle Clans Finder",
  },
  twitter: {
    card: "summary_large_image",
    title: "Idle Clans Finder | Player Search & Stats",
    description:
      "Search and view detailed player statistics, skills, and local market upgrades for Idle Clans",
  },
  robots: "index, follow",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <head>
        <link
          href="https://fonts.googleapis.com/css?family=Cookie&display=swap"
          rel="stylesheet"
        />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6722789074992707"
          crossOrigin="anonymous"
        ></script>
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-SHBQEPTLNT"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-SHBQEPTLNT');
          `}
        </Script>
      </head>
      <body
        className={`${roboto.variable} font-sans bg-[#031111] min-h-screen text-white flex flex-col`}
      >
        <Navbar />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
