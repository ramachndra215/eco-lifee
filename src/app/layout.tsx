import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "@/components/navbar";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Eco-Pulse | Sustainability as Code",
  description:
    "Track and reduce the carbon footprint of your software development. " +
    "Eco-Pulse calculates CO₂ impact per pull request and reports a Green Score.",
  keywords: ["sustainability", "carbon footprint", "green software", "DevOps", "CI/CD"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
