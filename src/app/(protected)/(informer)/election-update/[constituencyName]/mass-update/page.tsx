import MassUpdateManager from "@/components/update-count/mass-update-manager";
import { getCandidatesByConstituency } from "@/services/candidate-service";
import { getUserClaims } from "@/services/self-user-service";
import { getConstituencyRoundHistory } from "@/services/vote-service";
import { VoteRound } from "@/types";

export default async function MassUpdatePage({
  params,
}: {
  params: Promise<{ constituencyName: string }>;
}) {
  const { constituencyName } = await params;
  const decodedName = decodeURIComponent(constituencyName);

  const user = await getUserClaims();
  if (!user) return <div className="p-8">Unauthorized</div>;

  const { data: candidates } = await getCandidatesByConstituency(decodedName);
  const { data: existingRounds } =
    await getConstituencyRoundHistory(constituencyName);

  return (
    <div className="container mx-auto px-4 py-8">
      <MassUpdateManager
        candidates={candidates || []}
        constituencyName={decodedName}
        existingRounds={(existingRounds as VoteRound[]) || []}
      />
    </div>
  );
}
