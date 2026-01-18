"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import createUserAction from "@/actions/user/create-user-action";
import updateUserAction from "@/actions/user/update-user-action";
import { User, UserFormState } from "@/types";
import { X } from "lucide-react";

type UserFormProps = {
  mode: "create" | "edit";
  user?: User;
  onClose: () => void;
  onSuccess: () => void;
};

const initialState: UserFormState = {
  success: false,
};

export default function UserForm({
  mode,
  user,
  onClose,
  onSuccess,
}: UserFormProps) {
  const action = mode === "create" ? createUserAction : updateUserAction;
  const [state, formAction, isPending] = useActionState(action, initialState);

  useEffect(() => {
    if (state.success) {
      toast.success(state.message || "Operation completed successfully");
      onSuccess();
    } else if (state.message && !state.errors) toast.error(state.message);
  }, [state.success, state.message, state.errors, onSuccess]);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-lg shadow-lg max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className="text-2xl font-bold mb-6">
          {mode === "create" ? "Create New User" : "Edit User"}
        </h2>

        <form action={formAction} className="space-y-4">
          {mode === "edit" && user && (
            <input type="hidden" name="id" value={user.id} />
          )}

          <div className="space-y-2">
            <Label htmlFor="email">
              Email{" "}
              {mode === "edit" && (
                <span className="text-muted-foreground text-xs">
                  (optional)
                </span>
              )}
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="user@example.com"
              defaultValue={user?.email}
              required={mode === "create"}
            />
            {state.errors?.email && (
              <p className="text-sm text-destructive">
                {state.errors.email[0]}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">
              Password{" "}
              {mode === "edit" && (
                <span className="text-muted-foreground text-xs">
                  (optional)
                </span>
              )}
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              required={mode === "create"}
            />
            {state.errors?.password && (
              <p className="text-sm text-destructive">
                {state.errors.password[0]}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="display_name">Display Name</Label>
            <Input
              id="display_name"
              name="display_name"
              type="text"
              placeholder="John Doe"
              defaultValue={user?.display_name}
              required
            />
            {state.errors?.display_name && (
              <p className="text-sm text-destructive">
                {state.errors.display_name[0]}
              </p>
            )}
          </div>

          <div className="space-y-2 w-full">
            <Label htmlFor="role">Role</Label>
            <Select name="role" defaultValue={user?.role || "user"}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="informer">Informer</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
            {state.errors?.role && (
              <p className="text-sm text-destructive">{state.errors.role[0]}</p>
            )}
          </div>
          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={isPending} className="flex-1">
              {isPending
                ? mode === "create"
                  ? "Creating..."
                  : "Updating..."
                : mode === "create"
                ? "Create User"
                : "Update User"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isPending}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
