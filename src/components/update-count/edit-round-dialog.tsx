"use client";

import { useTransition, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { VoteRound } from "@/types";
import { Label } from "@/components/ui/label";
import { Loader2, Trash2 } from "lucide-react";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

interface EditRoundDialogProps {
  round: VoteRound;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (round: VoteRound, newVotes: number) => Promise<void>;
  onDelete: (round: VoteRound) => Promise<void>;
  isOwner: boolean;
}

export function EditRoundDialog({
  round,
  open,
  onOpenChange,
  onUpdate,
  onDelete,
  isOwner,
}: EditRoundDialogProps) {
  const [votes, setVotes] = useState(round.votes_count.toString());
  const [isPending, startTransition] = useTransition();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (open)
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setVotes(round.votes_count.toString());
  }, [open, round.votes_count]);

  const handleSave = () => {
    const newVotes = parseInt(votes);
    if (isNaN(newVotes)) return;

    startTransition(async () => {
      await onUpdate(round, newVotes);
      onOpenChange(false);
    });
  };

  const confirmDelete = () => {
    startTransition(async () => {
      await onDelete(round);
      setShowDeleteConfirm(false);
      onOpenChange(false);
    });
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Update Round {round.round_no}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="votes">Vote Count</Label>
              <Input
                id="votes"
                type="number"
                value={votes}
                onChange={(e) => setVotes(e.target.value)}
                className="text-lg"
                autoFocus
                onFocus={(e) => e.target.select()}
                onKeyDown={(e) => e.key === "Enter" && handleSave()}
              />
            </div>
          </div>
          <DialogFooter className="flex flex-row items-center justify-between sm:justify-between w-full">
            <div>
              {isOwner && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:text-destructive hover:bg-destructive/10 h-9 w-9"
                  onClick={() => setShowDeleteConfirm(true)}
                  disabled={isPending}
                  type="button"
                  title="Delete Round"
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={isPending}>
                {isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                Update
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        title="Delete Vote Round"
        description={
          <span>
            Are you sure you want to delete{" "}
            <strong>Round {round.round_no}</strong>? This action cannot be
            undone.
          </span>
        }
        confirmText="Delete"
        variant="destructive"
        onConfirm={confirmDelete}
        isLoading={isPending}
      />
    </>
  );
}
