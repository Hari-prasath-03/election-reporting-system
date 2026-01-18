"use client";

import { Candidate } from "@/types";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, User } from "lucide-react";
import deleteCandidateAction from "@/actions/candidate/delete-candidate-action";
import { useState } from "react";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import badgeColors from "@/lib/badge-colors";
import { cn } from "@/lib/utils";

type CandidatesTableProps = {
  candidates: Candidate[];
  onEdit: (candidate: Candidate) => void;
  onRefresh: () => void;
};

export default function CandidatesTable({
  candidates,
  onEdit,
  onRefresh,
}: CandidatesTableProps) {
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [candidateToDelete, setCandidateToDelete] = useState<{
    id: number;
    name: string;
    photo_url?: string;
  } | null>(null);

  const handleDeleteClick = (
    candidateId: number,
    name: string,
    photoUrl?: string,
  ) => {
    setCandidateToDelete({ id: candidateId, name, photo_url: photoUrl });
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!candidateToDelete) return;

    setDeletingId(candidateToDelete.id);
    const result = await deleteCandidateAction(
      candidateToDelete.id,
      candidateToDelete.photo_url,
    );

    if (result.success) {
      toast.success(result.message || "Candidate deleted successfully");
      onRefresh();
    } else {
      toast.error(result.message || "Failed to delete candidate");
    }

    setDeletingId(null);
    setDeleteDialogOpen(false);
    setCandidateToDelete(null);
  };

  if (candidates.length === 0) {
    return (
      <div className="border border-border rounded-lg p-12 text-center">
        <p className="text-muted-foreground">No candidates found.</p>
      </div>
    );
  }

  return (
    <>
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Are you absolutely sure?"
        description={
          <>
            This action cannot be undone. This will permanently delete the
            candidate
            <span className="font-semibold text-foreground">
              {" "}
              &quot;{candidateToDelete?.name || ""}&quot;
            </span>{" "}
            and remove them from our servers.
          </>
        }
        confirmText="Delete"
        onConfirm={handleConfirmDelete}
        isLoading={!!deletingId}
        loadingText="Deleting..."
      />
      <div className="border border-border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Photo</TableHead>
              <TableHead>Candidate Name</TableHead>
              <TableHead>Party</TableHead>
              <TableHead>Constituency</TableHead>
              <TableHead>Gender</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {candidates.map((candidate) => (
              <TableRow key={candidate.id}>
                <TableCell>
                  <div className="relative size-10 flex items-center justify-center bg-muted rounded-full overflow-hidden border">
                    {candidate.photo_url ? (
                      <Image
                        src={candidate.photo_url}
                        alt={candidate.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <User className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                </TableCell>
                <TableCell className="font-medium">{candidate.name}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span>{candidate.parties?.short_name || "Unknown"}</span>
                  </div>
                </TableCell>
                <TableCell>
                  {candidate.constituencies?.name || "Unknown"}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={cn(
                      "font-medium border-0",
                      badgeColors.gender[
                        candidate.gender as keyof typeof badgeColors.gender
                      ] || badgeColors.gender.Other,
                    )}
                  >
                    {candidate.gender}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      disabled={deletingId === candidate.id}
                      onClick={() => onEdit(candidate)}
                      title="Edit candidate"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        handleDeleteClick(
                          candidate.id,
                          candidate.name,
                          candidate.photo_url,
                        )
                      }
                      disabled={deletingId === candidate.id}
                      className="hover:bg-destructive/10 hover:text-destructive"
                      title="Delete candidate"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
