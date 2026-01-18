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
import { FormInput } from "@/components/ui/form-input";
import { FormSelect } from "@/components/ui/form-select";
import { ComboboxCustom } from "@/components/ui/combobox-custom";
import { ImageUploadPreview } from "@/components/ui/image-upload-preview";
import { Candidate, CandidateFormState } from "@/types";
import createCandidateAction from "@/actions/candidate/create-candidate-action";
import updateCandidateAction from "@/actions/candidate/update-candidate-action";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

type CandidateFormProps = {
  mode: "create" | "edit";
  candidate?: Candidate;
  onClose: () => void;
  onSuccess: () => void;
  parties: { id: number; name: string; short_name: string }[];
  constituencies: { id: number; name: string }[];
  initialConstituencyId?: string;
};

const initialState: CandidateFormState = {
  success: false,
  message: "",
};

export default function CandidateForm({
  mode,
  candidate,
  onClose,
  onSuccess,
  parties,
  constituencies,
  initialConstituencyId,
}: CandidateFormProps) {
  const [open, setOpen] = useState(true);

  const [partyId, setPartyId] = useState<string>(
    candidate?.party_id.toString() || ""
  );

  const [constituencyId, setConstituencyId] = useState<string>(
    candidate?.constituency_id.toString() || initialConstituencyId || ""
  );

  const updateActionWithId = async (
    state: CandidateFormState,
    formData: FormData
  ): Promise<CandidateFormState> => {
    if (!candidate) return state;
    return updateCandidateAction(candidate.id, state, formData);
  };

  const [state, formAction, isPending] = useActionState(
    mode === "create" ? createCandidateAction : updateActionWithId,
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
      <DialogContent className="sm:max-w-125 overflow-visible">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Add Candidate" : "Edit Candidate"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Add a new candidate to the election system."
              : "Update existing candidate details."}
          </DialogDescription>
        </DialogHeader>
        <form action={formAction} className="grid gap-4 py-4">
          {mode === "edit" && candidate?.photo_url && (
            <input
              type="hidden"
              name="old_photo_url"
              value={candidate.photo_url}
            />
          )}

          <FormInput
            label="Candidate Name"
            name="name"
            placeholder="Full Name"
            defaultValue={candidate?.name}
            required
            error={state.errors?.name}
          />

          <div className="grid grid-cols-2 gap-4">
            <ComboboxCustom
              name="party_id"
              label="Party"
              value={partyId}
              onChange={setPartyId}
              items={parties.map((p) => ({
                value: p.id.toString(),
                label: p.short_name,
                searchTerms: `${p.short_name.toLowerCase()} ${p.name.toLowerCase()}`,
              }))}
              placeholder="Select party..."
              searchPlaceholder="Search party..."
              emptyText="No party found."
              error={state.errors?.party_id}
            />

            <ComboboxCustom
              name="constituency_id"
              label="Constituency"
              value={constituencyId}
              onChange={setConstituencyId}
              items={constituencies.map((c) => ({
                value: c.id.toString(),
                label: c.name,
                searchTerms: c.name.toLowerCase(),
              }))}
              placeholder="Select constituency..."
              searchPlaceholder="Search constituency..."
              emptyText="No constituency found."
              error={state.errors?.constituency_id}
              modal={true}
            />
          </div>

          <FormSelect
            label="Gender"
            name="gender"
            placeholder="Select Gender"
            defaultValue={candidate?.gender}
            required
            error={state.errors?.gender}
            options={[
              { value: "Male", label: "Male" },
              { value: "Female", label: "Female" },
              { value: "Other", label: "Other" },
            ]}
          />

          <ImageUploadPreview
            name="photo_img"
            label="Candidate Photo"
            currentImageUrl={candidate?.photo_url}
            error={state.errors?.photo_img}
            imageClassName="object-cover rounded-full"
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
              {mode === "create" ? "Add Candidate" : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
