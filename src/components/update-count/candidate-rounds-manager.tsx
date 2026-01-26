"use client";

import { addVoteRound } from "@/actions/vote/add-vote-round";
import { deleteVoteRound } from "@/actions/vote/delete-vote-round";
import { updateVoteRound } from "@/actions/vote/update-vote-round";
import { Candidate, VoteRound } from "@/types";
import { useState } from "react";
import { toast } from "sonner";
import { AddRoundForm } from "./add-round-form";
import { CandidateHeader } from "./candidate-header";
import { RoundsList } from "./rounds-list";

interface CandidateRoundsManagerProps {
  candidateId: number;
  candidate: Candidate;
  initialRounds: VoteRound[];
  allCandidates: Candidate[];
  constituencyName: string;
  currentUserId?: string;
}

export default function CandidateRoundsManager({
  candidateId,
  candidate,
  initialRounds,
  allCandidates,
  constituencyName,
  currentUserId,
}: CandidateRoundsManagerProps) {
  const [rounds, setRounds] = useState<VoteRound[]>(initialRounds);

  const handleAddRound = async (roundNo: number, votes: number) => {
    const tempId = Date.now();
    const newRound: VoteRound = {
      id: tempId,
      candidate_id: candidateId,
      round_no: roundNo,
      votes_count: votes,
      updated_at: new Date().toISOString(),
      updated_by: currentUserId,
    };

    if (rounds.some((r) => r.round_no === roundNo)) {
      toast.error(`Round ${roundNo} already exists`);
      return;
    }

    setRounds((prev) => [...prev, newRound]);

    const res = await addVoteRound(candidateId, roundNo, votes);
    if (!res.success) {
      toast.error(res.error || "Failed to add round");
      setRounds((prev) => prev.filter((r) => r.id !== tempId));
    } else {
      toast.success(`Round ${roundNo} added`, { position: "top-center" });
    }
  };

  const handleDeleteRound = async (round: VoteRound) => {
    const previousRounds = [...rounds];
    setRounds((prev) => prev.filter((r) => r.id !== round.id));

    const res = await deleteVoteRound(round.id);

    if (!res.success) {
      toast.error(res.error || "Failed to delete round");
      setRounds(previousRounds);
    } else {
      toast.success("Round deleted");
    }
  };

  const handleUpdateRound = async (round: VoteRound, newVotes: number) => {
    setRounds((prev) =>
      prev.map((r) =>
        r.id === round.id ? { ...r, votes_count: newVotes } : r,
      ),
    );

    const res = await updateVoteRound(round.id, newVotes);

    if (!res.success) {
      toast.error("Failed to update round");
      setRounds((prev) =>
        prev.map((r) =>
          r.id === round.id ? { ...r, votes_count: round.votes_count } : r,
        ),
      );
    } else {
      toast.success("Round updated", { position: "top-center" });
    }
  };

  const totalVotes = rounds.reduce((sum, r) => sum + (r.votes_count || 0), 0);

  const nextRoundNo =
    (rounds.length > 0 ? Math.max(...rounds.map((r) => r.round_no)) : 0) + 1;

  return (
    <div className="min-h-dvh bg-background pb-32 relative">
      <CandidateHeader
        candidate={candidate}
        totalVotes={totalVotes}
        allCandidates={allCandidates}
        constituencyName={constituencyName}
      />

      <RoundsList
        rounds={rounds}
        onUpdateRound={handleUpdateRound}
        onDeleteRound={handleDeleteRound}
        currentUserId={currentUserId}
      />

      <div className="fixed bottom-0 left-0 right-0 z-50">
        <AddRoundForm nextRoundNo={nextRoundNo} onAddRound={handleAddRound} />
      </div>
    </div>
  );
}
