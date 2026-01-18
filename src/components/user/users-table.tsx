"use client";

import { User } from "@/types";
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
import deleteUserAction from "@/actions/user/delete-user-action";
import { useState } from "react";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import badgeColors from "@/lib/badge-colors";
import LoadingSpinner from "@/assets/icons/loading-spinner";

type UsersTableProps = {
  users: User[];
  currentUser: User;
  onEdit: (user: User) => void;
  loading?: boolean;
  observerTarget?: React.RefObject<HTMLDivElement>;
};

export default function UsersTable({
  users,
  currentUser,
  onEdit,
  loading,
  observerTarget,
}: UsersTableProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const handleDeleteClick = (userId: string, displayName: string) => {
    setUserToDelete({ id: userId, name: displayName });
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;

    setDeletingId(userToDelete.id);
    const result = await deleteUserAction(userToDelete.id);

    if (result.success)
      toast.success(result.message || "User deleted successfully");
    else toast.error(result.message || "Failed to delete user");

    setDeletingId(null);
    setDeleteDialogOpen(false);
    setUserToDelete(null);
  };

  if (users.length === 0 && !loading) {
    return (
      <div className="border border-border rounded-lg p-12 text-center">
        <p className="text-muted-foreground">No users found.</p>
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
            This will permanently delete the user{" "}
            <span className="font-semibold text-foreground">
              &quot;{userToDelete?.name || ""}&quot;
            </span>
            . This action cannot be undone.
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
              <TableHead className="pl-5">Display Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="text-right pr-5">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium pl-5">
                  {user.id === currentUser.id
                    ? `${user.display_name} (You)`
                    : user.display_name}
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={cn(
                      "font-medium border-0",
                      badgeColors.role[
                        user.role as keyof typeof badgeColors.role
                      ] || badgeColors.role.user,
                    )}
                  >
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell className="text-right pr-5">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      disabled={deletingId === user.id}
                      onClick={() => onEdit(user)}
                      title="Edit user"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    {user.id !== currentUser.id && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          handleDeleteClick(user.id, user.display_name)
                        }
                        disabled={deletingId === user.id}
                        className="hover:bg-destructive/10 hover:text-destructive"
                        title="Delete user"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}

            <TableRow>
              <TableCell colSpan={4} className="p-0 border-0">
                <div ref={observerTarget} />
              </TableCell>
            </TableRow>

            {loading && (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-4">
                  <div className="flex items-center justify-center gap-2 text-muted-foreground">
                    <LoadingSpinner />
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
