"use client";

import { addMassVoteRounds } from "@/actions/vote/add-mass-vote-rounds";
import { Candidate, VoteRound } from "@/types";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import MassUpdateCandidateSelector from "./mass-update-candidate-selector";
import MassUpdateForm from "./mass-update-form";

interface MassUpdateManagerProps {
  candidates: Candidate[];
  constituencyName: string;
  existingRounds: VoteRound[];
}

export default function MassUpdateManager({
  candidates,
  constituencyName,
  existingRounds,
}: MassUpdateManagerProps) {
  const router = useRouter();
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [roundNo, setRoundNo] = useState<string>("");
  const [voteCounts, setVoteCounts] = useState<Record<number, string>>({});
  const [isPending, startTransition] = useTransition();

  const selectedCandidates = candidates.filter((c) =>
    selectedIds.includes(c.id),
  );

  const calculateNextRound = (ids: number[]) => {
    if (ids.length === 0) return "";
    const relevantRounds = existingRounds.filter((r) =>
      ids.includes(r.candidate_id),
    );
    const maxRound =
      relevantRounds.length > 0
        ? Math.max(...relevantRounds.map((r) => r.round_no))
        : 0;
    return (maxRound + 1).toString();
  };

  const handleToggleCandidate = (id: number) => {
    const newIds = selectedIds.includes(id)
      ? selectedIds.filter((i) => i !== id)
      : [...selectedIds, id];

    setSelectedIds(newIds);
    setRoundNo(calculateNextRound(newIds));
  };

  const handleRemoveCandidate = (id: number) => {
    const newIds = selectedIds.filter((i) => i !== id);
    setSelectedIds(newIds);
    setRoundNo(calculateNextRound(newIds));

    const newCounts = { ...voteCounts };
    delete newCounts[id];
    setVoteCounts(newCounts);
  };

  const handleVoteChange = (id: number, value: string) => {
    setVoteCounts((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = () => {
    const rNo = parseInt(roundNo);
    if (!rNo || rNo < 1) {
      toast.error("Please enter a valid round number");
      return;
    }

    if (selectedCandidates.length === 0) {
      toast.error("Please select at least one candidate");
      return;
    }

    const updates: { candidateId: number; voteCount: number }[] = [];
    for (const c of selectedCandidates) {
      const votes = parseInt(voteCounts[c.id] || "");
      if (isNaN(votes)) {
        toast.error(`Please enter valid votes for ${c.name}`);
        return;
      }
      updates.push({ candidateId: c.id, voteCount: votes });
    }

    startTransition(async () => {
      const res = await addMassVoteRounds(rNo, updates, constituencyName);
      if (res.success) {
        toast.success("All rounds updated successfully");
        router.push(`/election-update/${constituencyName}`);
      } else {
        toast.error(res.error || "Failed to update rounds");
      }
    });
  };

  return (
    <div className="max-w-2xl mx-auto pb-24">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Mass Update</h1>
        </div>

        <MassUpdateCandidateSelector
          candidates={candidates}
          selectedIds={selectedIds}
          onToggleCandidate={handleToggleCandidate}
        />
      </div>

      <MassUpdateForm
        selectedCandidates={selectedCandidates}
        roundNo={roundNo}
        setRoundNo={setRoundNo}
        voteCounts={voteCounts}
        onVoteChange={handleVoteChange}
        onRemoveCandidate={handleRemoveCandidate}
        onSubmit={handleSubmit}
        isPending={isPending}
        onSelectCandidatesRequest={() => {
          document.getElementById("mass-update-trigger")?.click();
        }}
      />
    </div>
  );
}
