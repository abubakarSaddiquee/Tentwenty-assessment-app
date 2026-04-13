import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Dashboard from "@/features/dashboard";

export default async function DashboardPage() {
  const session = await auth();
  if (!session) redirect("/login");
  return <Dashboard />;
}
