"use client";

import { Party } from "@/types";
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
import { Pencil, Trash2 } from "lucide-react";
import deletePartyAction from "@/actions/party/delete-party-action";
import { useState } from "react";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import Image from "next/image";

type PartiesTableProps = {
  parties: Party[];
  onEdit: (party: Party) => void;
  onRefresh: () => void;
};

export default function PartiesTable({
  parties,
  onEdit,
  onRefresh,
}: PartiesTableProps) {
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [partyToDelete, setPartyToDelete] = useState<{
    id: number;
    name: string;
    symbolUrl?: string;
  } | null>(null);

  const handleDeleteClick = (
    partyId: number,
    name: string,
    symbolUrl?: string,
  ) => {
    setPartyToDelete({ id: partyId, name, symbolUrl });
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!partyToDelete) return;

    setDeletingId(partyToDelete.id);
    const result = await deletePartyAction(
      partyToDelete.id,
      partyToDelete.symbolUrl || null,
    );

    if (result.success) {
      toast.success(result.message || "Party deleted successfully");
      onRefresh();
    } else {
      toast.error(result.message || "Failed to delete party");
    }

    setDeletingId(null);
    setDeleteDialogOpen(false);
    setPartyToDelete(null);
  };

  if (parties.length === 0) {
    return (
      <div className="border border-border rounded-lg p-12 text-center">
        <p className="text-muted-foreground">No parties found.</p>
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
            This action cannot be undone. This will permanently delete the party
            <span className="font-semibold text-foreground">
              {" "}
              &quot;{partyToDelete?.name || ""}&quot;
            </span>{" "}
            and remove it from our servers.
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
              <TableHead>Symbol</TableHead>
              <TableHead>Party Name</TableHead>
              <TableHead>Short Name</TableHead>
              <TableHead>Color</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {parties.map((party) => (
              <TableRow key={party.id}>
                <TableCell>
                  <div className="relative size-8 flex items-center justify-center bg-muted rounded-full overflow-hidden border">
                    {party.symbol_url ? (
                      <Image
                        src={party.symbol_url}
                        alt={party.short_name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <span className="text-xs font-bold text-muted-foreground">
                        {party.short_name.substring(0, 2)}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="font-medium">{party.name}</TableCell>
                <TableCell>{party.short_name}</TableCell>
                <TableCell>
                  <div
                    className="h-6 w-6 rounded border shadow-sm"
                    style={{ backgroundColor: party.color_code }}
                  />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      disabled={deletingId === party.id}
                      onClick={() => onEdit(party)}
                      title="Edit party"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        handleDeleteClick(
                          party.id,
                          party.name,
                          party.symbol_url,
                        )
                      }
                      disabled={deletingId === party.id}
                      className="hover:bg-destructive/10 hover:text-destructive"
                      title="Delete party"
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
