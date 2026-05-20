import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { DataProvider } from "@/lib/DataContext";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Qurban for Mualaf (QfM) Dashboard",
  description: "Dashboard for Hidayah Centre Foundation Qurban Operations",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.className} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-slate-50">
        <DataProvider>
          {children}
          <Toaster position="top-center" />
        </DataProvider>
      </body>
    </html>
  );
}
