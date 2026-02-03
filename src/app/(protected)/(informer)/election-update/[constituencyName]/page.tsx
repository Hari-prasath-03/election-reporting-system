import CandidateAvatar from "@/components/update-count/candidate-avatar";
import MassUpdateCTA from "@/components/update-count/mass-update-cta";
import { getCandidatesByConstituency } from "@/services/candidate-service";

export default async function ConstituencyPage({
  params,
}: {
  params: Promise<{ constituencyName: string }>;
}) {
  const { constituencyName } = await params;
  const decodedName = decodeURIComponent(constituencyName);

  const {
    data: candidates,
    success,
    error,
  } = await getCandidatesByConstituency(decodedName);

  if (!success) {
    return (
      <div className="container mx-auto p-8 text-center text-red-500">
        Error loading candidates: {error}
      </div>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8 max-w-7xl pb-32">
      <div className="mb-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold">{decodedName}</h1>
          <p className="text-muted-foreground">Select a candidate to update</p>
        </div>

        <MassUpdateCTA constituencyName={constituencyName} />
      </div>

      <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-6 justify-center">
        {candidates?.map((candidate) => (
          <CandidateAvatar
            key={candidate.id}
            constituencyName={decodedName}
            candidate={candidate}
          />
        ))}
        {candidates?.length === 0 && (
          <div className="col-span-full text-center text-muted-foreground py-10">
            No candidates found in this constituency.
          </div>
        )}
      </div>
    </main>
  );
}
