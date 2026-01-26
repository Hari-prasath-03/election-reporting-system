import BackButton from "@/components/ui/back-button";
import hasPermission from "@/permissions";
import { getUserClaims } from "@/services/self-user-service";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUserClaims();
  if (!user) redirect("/login");
  if (!hasPermission(user, "access:dashboard")) redirect("/");

  return (
    <>
      <div className="container mx-auto pt-5 max-w-7xl pb-0">
        <BackButton />
      </div>
      {children}
    </>
  );
}
