import { getCandidatesByConstituency } from "@/services/candidate-service";
import { CandidatesCardList } from "@/components/constituencies/candidates-card-list";

interface PageProps {
  params: Promise<{
    constituencyName: string;
  }>;
}

export default async function ViewConstituencyPage(props: PageProps) {
  const params = await props.params;
  const decodedName = decodeURIComponent(params.constituencyName);

  const result = await getCandidatesByConstituency(decodedName);
  if (!result.success) console.error(result.error);
  const candidates = result.data || [];

  return (
    <main className="container mx-auto px-4 py-8 max-w-7xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold">{decodedName}</h1>
        <p className="text-muted-foreground">
          Constituency Candidates Overview
        </p>
      </div>

      <CandidatesCardList candidates={candidates} />
    </main>
  );
}
