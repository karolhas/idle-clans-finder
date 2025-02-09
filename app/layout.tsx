//hooks
import type { Metadata } from "next";
//fonts
import { Roboto } from "next/font/google";
//styles
import "./globals.css";

const roboto = Roboto({
  weight: ["100", "300", "400", "500", "700", "900"],
  subsets: ["latin"],
  variable: "--font-roboto",
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${roboto.variable} font-sans bg-[#031111] min-h-screen text-white`}
      >
        {children}
      </body>
    </html>
  );
}
