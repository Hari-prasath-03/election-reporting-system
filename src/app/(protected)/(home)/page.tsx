import { getUserClaims } from "@/utils";
import hasPermission from "@/permissions";
import { redirect } from "next/navigation";

export default async function Home() {
  const user = await getUserClaims();
  if (!user) redirect("/login");
  if (hasPermission(user, "access:dashboard")) redirect("/dashboard");

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">Welcome, {user.display_name}!</h1>
      <p className="mt-4 text-xl">You are logged in as {user.role}.</p>
    </div>
  );
}
