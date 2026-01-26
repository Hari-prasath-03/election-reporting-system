import {
  getCandidateDetails,
  getCandidatesByConstituency,
} from "@/services/candidate-service";
import { getVoteRounds } from "@/services/vote-service";
import CandidateRoundsManager from "@/components/update-count/candidate-rounds-manager";
import { getUserClaims } from "@/services/self-user-service";

export default async function CandidatePage({
  params,
}: {
  params: Promise<{ constituencyName: string; candidateId: string }>;
}) {
  const { candidateId, constituencyName } = await params;
  const parsedId = parseInt(candidateId);
  const decodedName = decodeURIComponent(constituencyName);

  const [candidateRes, roundsRes, allCandidatesRes, user] = await Promise.all([
    getCandidateDetails(parsedId),
    getVoteRounds(parsedId),
    getCandidatesByConstituency(decodedName),
    getUserClaims(),
  ]);

  if (!candidateRes.success || !candidateRes.data) {
    return <div className="text-center p-8">Candidate not found</div>;
  }

  const rounds = roundsRes.success && roundsRes.data ? roundsRes.data : [];
  const allCandidates =
    allCandidatesRes.success && allCandidatesRes.data
      ? allCandidatesRes.data
      : [];

  return (
    <CandidateRoundsManager
      candidateId={parsedId}
      candidate={candidateRes.data}
      initialRounds={rounds}
      allCandidates={allCandidates}
      constituencyName={decodedName}
      currentUserId={user?.id}
    />
  );
}
