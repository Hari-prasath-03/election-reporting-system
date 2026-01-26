import CnadidateAvathar from "@/components/update-count/candidate-avatar";
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          {decodedName}
        </h1>
        <p className="text-muted-foreground">
          Select a candidate to update their vote counts.
        </p>
      </div>

      <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-6 justify-center">
        {candidates?.map((candidate) => (
          <CnadidateAvathar
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
