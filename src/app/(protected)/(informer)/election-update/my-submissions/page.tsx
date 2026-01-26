import { getUserSubmissions } from "@/services/vote-service";
import { getUserClaims } from "@/services/self-user-service";
import { Separator } from "@/components/ui/separator";
import SubmissionsList from "@/components/informer/submissions-history";

export default async function MySubmissionsPage() {
  const user = await getUserClaims();

  if (!user) {
    return <div className="p-8">Please log in to view your submissions.</div>;
  }

  const { success, data } = await getUserSubmissions(user.id);
  const submissions = success && data ? data : [];

  return (
    <div className="max-w-2xl mx-auto py-6 px-4 pb-24">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">My Submissions</h1>
        <p className="text-muted-foreground text-sm mt-1">
          History of vote rounds you have updated.
        </p>
      </div>

      <Separator className="my-6" />

      <SubmissionsList rounds={submissions} />
    </div>
  );
}
