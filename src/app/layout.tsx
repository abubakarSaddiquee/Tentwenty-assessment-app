import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ReduxProvider } from "@/store/provider";
import { Toaster } from "react-hot-toast";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ticktock — Timesheet Management",
  description: "Track and manage employee timesheets effortlessly.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body className={`${inter.variable} min-h-full antialiased`} style={{ fontFamily: "var(--font-inter), Inter, sans-serif" }} suppressHydrationWarning>
        <ReduxProvider>
          <Toaster position="top-center" />
          {children}
        </ReduxProvider>
      </body>
    </html>
  );
}
