"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Candidate } from "@/types";
import { Loader2, Users, X } from "lucide-react";

interface MassUpdateFormProps {
  selectedCandidates: Candidate[];
  roundNo: string;
  setRoundNo: (value: string) => void;
  voteCounts: Record<number, string>;
  onVoteChange: (id: number, value: string) => void;
  onRemoveCandidate: (id: number) => void;
  onSubmit: () => void;
  isPending: boolean;
  onSelectCandidatesRequest: () => void;
}

export default function MassUpdateForm({
  selectedCandidates,
  roundNo,
  setRoundNo,
  voteCounts,
  onVoteChange,
  onRemoveCandidate,
  onSubmit,
  isPending,
  onSelectCandidatesRequest,
}: MassUpdateFormProps) {
  if (selectedCandidates.length === 0) {
    return (
      <div className="text-center py-20 border-2 border-dashed rounded-xl">
        <div className="text-muted-foreground">No candidates selected.</div>
        <Button variant="link" onClick={onSelectCandidatesRequest}>
          Select Candidates to start
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Card>
        <CardContent className="p-4">
          <Label
            htmlFor="roundNo"
            className="text-base font-semibold mb-2 block"
          >
            Round Number
          </Label>
          <Input
            id="roundNo"
            type="number"
            value={roundNo}
            onChange={(e) => setRoundNo(e.target.value)}
            className="text-lg font-mono font-bold"
            placeholder="Auto-calculated"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Auto-set to {roundNo} based on selected candidates history.
          </p>
        </CardContent>
      </Card>

      <div className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Votes input
        </h3>
        {selectedCandidates.map((candidate) => (
          <div
            key={candidate.id}
            className="flex items-end gap-3 p-3 rounded-xl border bg-card/50"
          >
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={candidate.parties?.symbol_url} />
                  <AvatarFallback>
                    {candidate.parties?.short_name?.[0]}
                  </AvatarFallback>
                </Avatar>
                <span className="font-semibold text-sm">{candidate.name}</span>
                <span className="text-xs bg-muted px-1.5 rounded">
                  {candidate.parties?.short_name}
                </span>
              </div>
              <Input
                type="number"
                placeholder="Enter votes..."
                value={voteCounts[candidate.id] || ""}
                onChange={(e) => onVoteChange(candidate.id, e.target.value)}
                className="h-11 text-lg"
              />
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-11 w-11 shrink-0 text-muted-foreground hover:text-destructive"
              onClick={() => onRemoveCandidate(candidate.id)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        ))}
      </div>

      <div className="pt-4">
        <Button
          className="w-full h-12 text-lg"
          onClick={onSubmit}
          disabled={isPending}
        >
          {isPending ? (
            <Loader2 className="animate-spin mr-2" />
          ) : (
            <Users className="mr-2" />
          )}
          Submit All Updates
        </Button>
      </div>
    </div>
  );
}
