import { getAssignedCenters } from "@/services/informer-service";
import InformerCountingCenterCard from "@/components/informer/informer-counting-center-card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { History } from "lucide-react";

export default async function InformerDashboardPage() {
  const { data: assignedCenters, success } = await getAssignedCenters();

  if (!success) {
    return (
      <div className="container mx-auto p-8 text-center text-red-500">
        Failed to load assigned counting centers.
      </div>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            Assigned Counting Centers
          </h1>
          <p className="text-muted-foreground">
            Select a counting center to update live vote counts.
          </p>
        </div>
        <Button asChild variant="outline" className="gap-2">
          <Link href="/election-update/my-submissions">
            <History className="h-4 w-4" />
            My Submissions
          </Link>
        </Button>
      </div>

      {assignedCenters.length === 0 ? (
        <div className="text-center py-12 border rounded-lg bg-muted/10">
          <h3 className="text-lg font-medium text-foreground">
            No Assignments Found
          </h3>
          <p className="text-muted-foreground mt-2">
            You have not been assigned to any counting centers yet.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:gap-6 sm:grid-cols-2 lg:grid-cols-3 items-start">
          {assignedCenters.map((center) => (
            <InformerCountingCenterCard key={center.id} center={center} />
          ))}
        </div>
      )}
    </main>
  );
}
