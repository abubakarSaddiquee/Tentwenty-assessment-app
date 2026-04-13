import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import SignIn from "@/features/auth/signin";

export default async function LoginPage() {
  const session = await auth();
  if (session) redirect("/dashboard");
  return <SignIn />;
}
