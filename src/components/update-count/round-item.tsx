"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { VoteRound } from "@/types";
import { format } from "date-fns";
import { ChevronRight } from "lucide-react";
import { EditRoundDialog } from "./edit-round-dialog";

interface RoundItemProps {
  round: VoteRound;
  onUpdate: (round: VoteRound, newVotes: number) => Promise<void>;
  onDelete: (round: VoteRound) => Promise<void>;
  isOwner: boolean;
}

export function RoundItem({
  round,
  onUpdate,
  onDelete,
  isOwner,
}: RoundItemProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const formattedDate = useMemo(() => {
    return format(new Date(round.updated_at || new Date()), "MMM d, h:mm a");
  }, [round.updated_at]);

  return (
    <>
      <div
        className="bg-card rounded-xl shadow-sm flex items-center justify-between gap-4 py-4 px-4 border-b last:border-0 hover:bg-muted/50 transition-colors cursor-pointer active:bg-muted"
        onClick={() => setIsDialogOpen(true)}
      >
        <div className="flex items-center gap-4 min-w-0 flex-1">
          <div className="h-10 w-10 shrink-0 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center text-sm font-semibold shadow-sm">
            R{round.round_no}
          </div>

          <div className="flex flex-col min-w-0 gap-0.5">
            <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
              {formattedDate}
            </span>
            <div className="text-xl font-bold tabular-nums tracking-tight">
              {round.votes_count.toLocaleString()}
            </div>
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="shrink-0 text-muted-foreground/50 hover:text-foreground -mr-2"
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>

      <EditRoundDialog
        round={round}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onUpdate={onUpdate}
        onDelete={onDelete}
        isOwner={isOwner}
      />
    </>
  );
}
