"use client";

import { useActionState, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Party, PartyFormState } from "@/types";
import createPartyAction from "@/actions/party/create-party-action";
import updatePartyAction from "@/actions/party/update-party-action";
import { ImageUploadPreview } from "@/components/ui/image-upload-preview";
import { FormInput } from "@/components/ui/form-input";

type PartyFormProps = {
  mode: "create" | "edit";
  party?: Party;
  onClose: () => void;
  onSuccess: () => void;
};

const initialState: PartyFormState = {
  success: false,
  message: "",
};

export default function PartyForm({
  mode,
  party,
  onClose,
  onSuccess,
}: PartyFormProps) {
  const [open, setOpen] = useState(true);

  const updateActionWithId = async (
    state: PartyFormState,
    formData: FormData
  ): Promise<PartyFormState> => {
    if (!party) return state;
    return updatePartyAction(party.id, party.symbol_url, state, formData);
  };

  const [state, formAction, isPending] = useActionState(
    mode === "create" ? createPartyAction : updateActionWithId,
    initialState
  );

  useEffect(() => {
    if (state.success) {
      toast.success(state.message);
      onSuccess();
    } else if (state.message) toast.error(state.message);
  }, [state, onSuccess]);

  const handleOpenChange = (open: boolean) => {
    setOpen(open);
    if (!open) onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Create Party" : "Edit Party"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Add a new party to the system."
              : "Update existing party details."}
          </DialogDescription>
        </DialogHeader>
        <form action={formAction} className="grid gap-4 py-4">
          <FormInput
            label="Party Name"
            name="name"
            placeholder="e.g. Dravida Munnetra Kazhagam"
            defaultValue={party?.name}
            required
            error={state.errors?.name}
          />
          <div className="grid grid-cols-2 gap-4">
            <FormInput
              label="Short Name"
              name="short_name"
              placeholder="e.g. DMK"
              defaultValue={party?.short_name}
              required
              error={state.errors?.short_name}
            />
            <div className="grid gap-2">
              <Label htmlFor="color_code">Color Code</Label>
              <div className="flex gap-2">
                <Input
                  id="color_code"
                  name="color_code"
                  type="color"
                  className="w-12 p-1 h-10 cursor-pointer"
                  defaultValue={party?.color_code || "#808080"}
                />
                <Input
                  type="text"
                  placeholder="#808080"
                  pattern="^#([0-9A-F]{3}){1,2}$"
                  defaultValue={party?.color_code || "#808080"}
                  className="uppercase"
                  onChange={(e) => {
                    const val = e.target.value;
                    const colorInput = document.getElementById(
                      "color_code"
                    ) as HTMLInputElement;
                    if (colorInput && /^#([0-9A-F]{3}){1,2}$/i.test(val)) {
                      colorInput.value = val;
                    }
                  }}
                />
              </div>
              {state.errors?.color_code && (
                <p className="text-sm text-destructive">
                  {state.errors.color_code[0]}
                </p>
              )}
            </div>
          </div>

          <ImageUploadPreview
            name="symbol_img"
            label="Symbol Image"
            currentImageUrl={party?.symbol_url}
            error={state.errors?.symbol_img}
            imageClassName="object-contain rounded-md"
          />

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {mode === "create" ? "Create Party" : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
