import type { Metadata } from "next";
import "./globals.css";
import { QuickCapture } from "@/components/QuickCapture";
import { Toast } from "@/components/Toast";

export const metadata: Metadata = {
  title: "FounderOS - Founder Operating System",
  description: "High-performance founder execution system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        {children}
        <QuickCapture />
        <Toast />
      </body>
    </html>
  );
}
