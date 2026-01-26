import { getUserClaims } from "@/services/self-user-service";
import { redirect } from "next/navigation";
import BackButton from "@/components/ui/back-button";
import hasPermission from "@/permissions";

export default async function InformerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUserClaims();
  if (!user) redirect("/login");
  if (!hasPermission(user, "update:vote_counts")) redirect("/");

  return (
    <>
      <div className="container mx-auto pt-5 max-w-7xl pb-0">
        <BackButton sliceLastToGetBack />
      </div>
      {children}
    </>
  );
}
