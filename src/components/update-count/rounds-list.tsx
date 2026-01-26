"use client";

import { VoteRound } from "@/types";
import { RoundItem } from "./round-item";
import { useEffect, useRef } from "react";

interface RoundsListProps {
  rounds: VoteRound[];
  onUpdateRound: (round: VoteRound, newVotes: number) => Promise<void>;
  onDeleteRound: (round: VoteRound) => Promise<void>;
  currentUserId?: string;
}

export function RoundsList({
  rounds,
  onUpdateRound,
  onDeleteRound,
  currentUserId,
}: RoundsListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (rounds.length > 0)
      bottomRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "nearest",
      });
  }, [rounds.length]);

  if (rounds.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-muted-foreground opacity-50 flex-col py-20">
        <div className="text-4xl mb-2">📥</div>
        <div>No rounds yet</div>
      </div>
    );
  }

  return (
    <div className="px-4 py-2 flex flex-col gap-2">
      {rounds.map((round) => (
        <RoundItem
          key={round.id}
          round={round}
          onUpdate={onUpdateRound}
          onDelete={onDeleteRound}
          isOwner={!!currentUserId && round.updated_by === currentUserId}
        />
      ))}
      <div ref={bottomRef} className="h-1 scroll-mb-4" />
    </div>
  );
}
