import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SettingsProvider } from "@/context/SettingsContext";
import { AuthProvider } from "@/context/AuthContext";
import AppClientWrapper from "@/components/AppClientWrapper";

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
        <AuthProvider>
          <SettingsProvider>
            <AppClientWrapper>{children}</AppClientWrapper>
          </SettingsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
