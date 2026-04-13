import type { Metadata } from "next";
import Navbar from "@/layouts/navbar";
import Footer from "@/layouts/footer";

export const metadata: Metadata = {
  title: "Dashboard | ticktock",
};

export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}
