"use client";

import { useEffect, useState, useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2, UserPlus, Check } from "lucide-react";
import { toast } from "sonner";
import fetchAvailableInformersAction, {
  AvailableInformer,
} from "@/actions/assignment/fetch-available-informers-action";
import { MultiSelectCombobox } from "@/components/ui/multi-select-combobox";
import fetchCenterAssignmentsAction, {
  AssignmentData,
} from "@/actions/assignment/fetch-center-assignments-action";
import bulkAssignInformersAction from "@/actions/assignment/bulk-assign-informers-action";
import unassignInformerAction from "@/actions/assignment/unassign-informer-action";
import { cn } from "@/lib/utils";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

interface ManageStaffDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  centerId: number;
  centerName: string;
}

export default function ManageStaffDialog({
  open,
  onOpenChange,
  centerId,
  centerName,
}: ManageStaffDialogProps) {
  const [activeTab, setActiveTab] = useState<"list" | "add">("list");
  const [assignments, setAssignments] = useState<AssignmentData[]>([]);
  const [availableInformers, setAvailableInformers] = useState<
    AvailableInformer[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [selectedInformerIds, setSelectedInformerIds] = useState<string[]>([]);

  const loadData = async () => {
    setLoading(true);
    const assignmentRes = await fetchCenterAssignmentsAction(centerId);
    if (assignmentRes.success) {
      setAssignments(assignmentRes.data);
    }
    setLoading(false);
  };

  const loadAvailableData = async () => {
    const res = await fetchAvailableInformersAction(centerId);
    if (res.success) {
      setAvailableInformers(res.data);
    }
  };

  useEffect(() => {
    if (open) {
      loadData();
      loadAvailableData();
      setActiveTab("list");
      setSelectedInformerIds([]);
    }
  }, [open, centerId]);

  const handleAssign = () => {
    if (selectedInformerIds.length === 0) return;

    startTransition(async () => {
      const result = await bulkAssignInformersAction(
        centerId,
        selectedInformerIds,
      );
      if (result.success) {
        toast.success(result.message);
        loadData();
        loadAvailableData();
        setActiveTab("list");
        setSelectedInformerIds([]);
      } else {
        toast.error(result.message);
      }
    });
  };

  const [staffToUnassign, setStaffToUnassign] = useState<{
    id: number;
    name: string;
  } | null>(null);

  const handleUnassignClick = (assignmentId: number, name: string) => {
    setStaffToUnassign({ id: assignmentId, name });
  };

  const confirmUnassign = () => {
    if (!staffToUnassign) return;

    startTransition(async () => {
      const result = await unassignInformerAction(staffToUnassign.id);
      if (result.success) {
        toast.success(result.message);
        loadData();
        loadAvailableData();
        setStaffToUnassign(null);
      } else {
        toast.error(result.message);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-125">
        <DialogHeader>
          <DialogTitle>Manage Informers</DialogTitle>
          <DialogDescription>
            Assign or remove informers for <strong>{centerName}</strong>.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 min-h-75">
          {loading ? (
            <div className="flex justify-center items-center h-full py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <>
              {activeTab === "list" ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-sm font-semibold">
                      Current Informers ({assignments.length})
                    </h4>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setActiveTab("add")}
                    >
                      <UserPlus className="h-4 w-4 mr-1" /> Add Informer
                    </Button>
                  </div>

                  {assignments.length === 0 ? (
                    <div className="text-center py-6 text-muted-foreground text-sm border border-dashed rounded-md">
                      No informers assigned yet.
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-75 overflow-y-auto pr-1">
                      {assignments.map((assignment) => (
                        <div
                          key={assignment.id}
                          className="flex items-center justify-between p-2 border rounded-md bg-muted/40"
                        >
                          <div className="flex flex-col">
                            <span className="font-medium text-sm">
                              {assignment.profile?.display_name || "Unknown"}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {assignment.profile?.email}
                            </span>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                            onClick={() =>
                              handleUnassignClick(
                                assignment.id,
                                assignment.profile?.display_name || "Unknown",
                              )
                            }
                            disabled={isPending}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-semibold">
                      Assign New Informer
                    </h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setActiveTab("list")}
                    >
                      Back to List
                    </Button>
                  </div>

                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-xs font-medium">
                        Select Informers
                      </label>
                      <MultiSelectCombobox
                        options={availableInformers.map((i) => ({
                          value: i.id,
                          label: i.display_name,
                          email: i.email,
                        }))}
                        selectedValues={selectedInformerIds}
                        onChange={setSelectedInformerIds}
                        placeholder="Select informers..."
                        searchPlaceholder="Search informers..."
                        emptyMessage="No informer found."
                        renderOption={(option, isSelected) => (
                          <div className="flex items-center">
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                isSelected ? "opacity-100" : "opacity-0",
                              )}
                            />
                            <span>{option.label}</span>
                            <span className="text-xs text-muted-foreground ml-2">
                              ({option.email})
                            </span>
                          </div>
                        )}
                        className="w-full"
                      />
                      <p className="text-[10px] text-muted-foreground">
                        Only users with role 'informer' not currently assigned
                        to <strong>this center</strong> are shown.
                      </p>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <Button
                        variant="outline"
                        onClick={() => setActiveTab("list")}
                        disabled={isPending}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleAssign}
                        disabled={selectedInformerIds.length === 0 || isPending}
                      >
                        {isPending && (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Confirm Assign ({selectedInformerIds.length})
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
        <ConfirmDialog
          open={!!staffToUnassign}
          onOpenChange={(open) => !open && setStaffToUnassign(null)}
          title="Remove Informer?"
          description={
            <>
              Are you sure you want to remove{" "}
              <span className="font-semibold text-foreground">
                &quot;{staffToUnassign?.name || ""}&quot;
              </span>{" "}
              from this counting center? They can be re-assigned later if
              needed.
            </>
          }
          confirmText="Remove"
          onConfirm={confirmUnassign}
          isLoading={isPending}
          loadingText="Removing..."
        />
      </DialogContent>
    </Dialog>
  );
}
