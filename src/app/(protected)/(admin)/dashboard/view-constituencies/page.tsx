import fetchConstituenciesAction from "@/actions/constituencies/fetch-constituencies-action";
import fetchDistrictsAction from "@/actions/constituencies/fetch-districts-action";
import LoadingSpinner from "@/assets/icons/loading-spinner";
import ViewConstituenciesClient from "@/components/constituencies/view-constituencies-client";
import { Suspense } from "react";

export default async function ViewConstituenciesPage() {
  const [constituenciesData, allDistricts] = await Promise.all([
    fetchConstituenciesAction({ page: 1, limit: 20 }),
    fetchDistrictsAction(),
  ]);

  return (
    <main className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Constituency Status</h1>
        <p className="text-muted-foreground">Monitor round-wise status of all electoral zones</p>
      </div>

      <Suspense fallback={<LoadingSpinner />}>
        <ViewConstituenciesClient
          initialConstituencies={constituenciesData.data}
          initialTotal={constituenciesData.total}
          allDistricts={allDistricts}
        />
      </Suspense>
    </main>
  );
}
