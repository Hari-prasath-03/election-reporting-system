import { getCountingCenters } from "@/services/counting-center-service";
import ManageCountingCentersClient from "@/components/counting-center/manage-counting-centers-client";
import { getDistricts } from "@/services/constituency-service";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function ManageCountingCentersPage() {
  const [{ data, success }, districts] = await Promise.all([
    getCountingCenters(),
    getDistricts(),
  ]);

  return (
    <main className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Manage Counting Centers
          </h1>
          <p className="text-muted-foreground">
            Add, update and remove counting centers.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/dashboard/counting-centers/view-assignments">
            <Button variant="outline">View All Assignments</Button>
          </Link>
        </div>
      </div>
      <ManageCountingCentersClient
        initialCenters={success && data ? data : []}
        districts={districts || []}
      />
    </main>
  );
}
