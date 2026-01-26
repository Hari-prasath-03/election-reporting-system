import ManagePartiesClient from "@/components/party/manage-parties-client";
import { getParties } from "@/services/party-service";

export default async function ManagePartiesPage() {
  const { data, total } = await getParties({
    page: 1,
    limit: 20,
    excludeIndependent: true,
  });

  return (
    <main className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Party Registry</h1>
        <p className="text-muted-foreground">
          View and manage political parties, symbols, and registration details
        </p>
      </div>
      <ManagePartiesClient initialParties={data} initialTotal={total} />
    </main>
  );
}
