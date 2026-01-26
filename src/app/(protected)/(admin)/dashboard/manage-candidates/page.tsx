import { getCandidates } from "@/services/candidate-service";
import ManageCandidatesClient from "@/components/candidate/manage-candidates-client";
import { getParties } from "@/services/party-service";
import { getConstituencies } from "@/services/constituency-service";

export default async function ManageCandidatesPage() {
  const [candidatesRes, partiesRes, constituenciesRes] = await Promise.all([
    getCandidates({ page: 1, limit: 20 }),
    getParties({ limit: 100 }),
    getConstituencies({ limit: 234 }),
  ]);

  const constituencies = constituenciesRes.data.map((c) => ({
    id: c.s_no,
    name: c.constituency,
  }));

  const parties = partiesRes.data.map((p) => ({
    id: p.id,
    name: p.name,
    short_name: p.short_name,
  }));

  return (
    <main className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Candidate Nominations</h1>
        <p className="text-muted-foreground">
          View and manage election candidate list and constituency assignments
        </p>
      </div>
      <ManageCandidatesClient
        initialCandidates={candidatesRes.success ? candidatesRes.data : []}
        initialTotal={candidatesRes.total || 0}
        parties={parties}
        constituencies={constituencies}
      />
    </main>
  );
}
