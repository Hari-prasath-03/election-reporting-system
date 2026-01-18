"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";
import { CountingCenter } from "@/types";
import { useTransition } from "react";
import { useState } from "react";
import ManageStaffDialog from "../assignment/manage-staff-dialog";
import { CustomDropdown } from "@/components/ui/custom-dropdown";
import deleteCountingCenterAction from "@/actions/counting-center/delete-counting-center-action";
import { toast } from "sonner";

interface CountingCenterCardProps {
  center: CountingCenter;
  onEdit: (center: CountingCenter) => void;
}

import { ConfirmDialog } from "@/components/ui/confirm-dialog";

export default function CountingCenterCard({
  center,
  onEdit,
}: CountingCenterCardProps) {
  const [isPending, startTransition] = useTransition();
  const [showStaffDialog, setShowStaffDialog] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteCountingCenterAction(center.id);
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
      setShowDeleteAlert(false);
    });
  };

  return (
    <>
      <Card className="h-full flex flex-col hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl font-bold">{center.name}</CardTitle>
          <CustomDropdown
            items={[
              {
                label: "Manage Informers",
                onClick: () => setShowStaffDialog(true),
              },
              {
                label: "Edit",
                onClick: () => onEdit(center),
              },
              "separator",
              {
                label: "Delete",
                onClick: () => setShowDeleteAlert(true),
                variant: "destructive",
                disabled: isPending,
              },
            ]}
          />
        </CardHeader>
        <CardContent>
          <div className="flex items-center text-sm text-muted-foreground mb-4">
            <MapPin className="mr-1 h-3 w-3" />
            {center.location_address || "No address provided"}
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-semibold">
              Constituencies ({center.constituencies?.length || 0})
            </h4>
            <div className="flex flex-wrap gap-1">
              {center.constituencies && center.constituencies.length > 0 ? (
                center.constituencies.map((c) => (
                  <Badge key={c.id} variant="secondary">
                    {c.name}
                  </Badge>
                ))
              ) : (
                <span className="text-xs text-muted-foreground italic">
                  None assigned
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <ManageStaffDialog
        open={showStaffDialog}
        onOpenChange={setShowStaffDialog}
        centerId={center.id}
        centerName={center.name}
      />

      <ConfirmDialog
        open={showDeleteAlert}
        onOpenChange={setShowDeleteAlert}
        title="Are you absolutely sure?"
        description={
          <>
            This action cannot be undone. This will permanently delete the
            counting center <strong>{center.name}</strong> and unassign all
            linked constituencies.
          </>
        }
        confirmText="Delete"
        onConfirm={handleDelete}
        isLoading={isPending}
        loadingText="Deleting..."
      />
    </>
  );
}
