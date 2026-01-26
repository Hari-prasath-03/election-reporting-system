"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ArrowUp, Loader2 } from "lucide-react";
import { useEffect, useState, useTransition } from "react";

interface AddRoundFormProps {
  nextRoundNo: number;
  onAddRound: (roundNo: number, votes: number) => Promise<void>;
  isPending?: boolean;
}

export function AddRoundForm({
  nextRoundNo,
  onAddRound,
  isPending = false,
}: AddRoundFormProps) {
  const [votes, setVotes] = useState("");
  const [roundNo, setRoundNo] = useState(nextRoundNo.toString());
  const [internalPending, startTransition] = useTransition();

  useEffect(() => {
    setRoundNo(nextRoundNo.toString());
  }, [nextRoundNo]);

  const handleSubmit = () => {
    if (!votes || !roundNo) return;
    const votesNum = parseInt(votes);
    const roundNum = parseInt(roundNo);

    if (isNaN(votesNum) || isNaN(roundNum)) return;

    startTransition(async () => {
      await onAddRound(roundNum, votesNum);
      setVotes("");
    });
  };

  const loading = isPending || internalPending;

  return (
    <div className="border-t bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 p-4 pb-6 shadow-[0_-1px_10px_rgba(0,0,0,0.05)]">
      <div className="max-w-4xl mx-auto flex items-center gap-3">
        <div className="w-24 shrink-0">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium">
              R-
            </span>
            <Input
              type="number"
              className="h-12 text-lg rounded-full pl-8 pr-4 shadow-sm border-input focus-visible:ring-primary/20 bg-background text-center font-semibold"
              value={roundNo}
              onChange={(e) => setRoundNo(e.target.value)}
              disabled={loading}
              placeholder="#"
            />
          </div>
        </div>

        <div className="relative flex-1">
          <Input
            placeholder="Enter votes..."
            type="number"
            className="h-12 text-lg rounded-full pr-4 pl-4 shadow-sm border-input focus-visible:ring-primary/20 bg-background"
            value={votes}
            onChange={(e) => setVotes(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            disabled={loading}
          />
        </div>
        <Button
          size="icon"
          className={cn(
            "h-12 w-12 rounded-full shadow-md transition-all shrink-0",
            votes && roundNo ? "scale-100 opacity-100" : "scale-95 opacity-50",
          )}
          onClick={handleSubmit}
          disabled={loading || !votes || !roundNo}
        >
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <ArrowUp className="h-5 w-5" />
          )}
        </Button>
      </div>
    </div>
  );
}
