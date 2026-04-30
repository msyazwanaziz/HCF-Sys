import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { SettingsProvider } from "@/context/SettingsContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HCF Board of Trustees Governance Portal",
  description: "Secure, executive-level internal web system for the Board of Trustees (BOT) of Hidayah Centre Foundation (HCF).",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} antialiased h-full`}>
      <body className={`${inter.className} min-h-full bg-background text-foreground flex`}>
        <SettingsProvider>
          <Sidebar />
          <div className="flex-1 lg:pl-72 flex flex-col min-h-screen">
            <Header />
            <main className="flex-1 p-8">
              {children}
            </main>
          </div>
        </SettingsProvider>
      </body>
    </html>
  );
}
