import { Candidate } from "@/types";
import { CandidateCard } from "./candidate-card";

interface CandidatesCardListProps {
  candidates: Candidate[];
}

export function CandidatesCardList({ candidates }: CandidatesCardListProps) {
  if (!candidates || candidates.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground bg-accent/50 rounded-lg">
        <p>No candidates found in this constituency.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {candidates.map((candidate) => (
        <CandidateCard key={candidate.id} candidate={candidate} />
      ))}
    </div>
  );
}
