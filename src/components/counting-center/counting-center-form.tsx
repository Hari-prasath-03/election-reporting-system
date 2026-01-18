"use client";

import { useEffect, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { MultiSelectCombobox } from "@/components/ui/multi-select-combobox";
import { CountingCenter } from "@/types";
import createCountingCenterAction from "@/actions/counting-center/create-counting-center-action";
import updateCountingCenterAction from "@/actions/counting-center/update-counting-center-action";
import fetchAllConstituenciesForSelectAction from "@/actions/constituencies/fetch-all-constituencies-for-select";
import { toast } from "sonner";
import { Textarea } from "../ui/textarea";

interface ConstituencyOption {
  id: number;
  name: string;
  district: string;
  counting_center_id: number | null;
  counting_center_name: string | null;
}

interface CountingCenterFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  centerToEdit?: CountingCenter | null;
}

export default function CountingCenterForm({
  open,
  onOpenChange,
  centerToEdit,
}: CountingCenterFormProps) {
  const [isPending, startTransition] = useTransition();
  const [constituencies, setConstituencies] = useState<ConstituencyOption[]>(
    [],
  );
  const [selectedConstituencies, setSelectedConstituencies] = useState<
    number[]
  >([]);

  useEffect(() => {
    if (open) {
      fetchAllConstituenciesForSelectAction().then((res) => {
        if (res.success && res.data) {
          setConstituencies(res.data);
        }
      });
    }
  }, [open]);

  useEffect(() => {
    if (centerToEdit) {
      setSelectedConstituencies(
        centerToEdit.constituencies?.map((c) => c.id) || [],
      );
    } else {
      setSelectedConstituencies([]);
    }
  }, [centerToEdit, open]);

  const handleSubmit = (formData: FormData) => {
    selectedConstituencies.forEach((id) => {
      formData.append("constituency_ids", id.toString());
    });

    startTransition(async () => {
      let result;
      if (centerToEdit) {
        result = await updateCountingCenterAction(
          centerToEdit.id,
          {} as any,
          formData,
        );
      } else {
        result = await createCountingCenterAction({} as any, formData);
      }

      if (result.success) {
        toast.success(result.message);
        onOpenChange(false);
      } else {
        toast.error(result.message);
      }
    });
  };

  const toggleConstituency = (id: number) => {
    setSelectedConstituencies((prev) =>
      prev.includes(id) ? prev.filter((cId) => cId !== id) : [...prev, id],
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {centerToEdit ? "Edit Counting Center" : "Add Counting Center"}
          </DialogTitle>
        </DialogHeader>

        <form action={handleSubmit} className="space-y-6 mt-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Center Name</Label>
            <Input
              id="name"
              name="name"
              defaultValue={centerToEdit?.name}
              placeholder="e.g. Main Hall"
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="location_address">Location Address</Label>
            <Textarea
              id="location_address"
              name="location_address"
              defaultValue={centerToEdit?.location_address}
              placeholder="Full address of the counting center"
            />
          </div>

          <div className="grid gap-2">
            <Label>Add Constituencies</Label>
            <MultiSelectCombobox
              options={constituencies.map((c) => ({
                value: c.id.toString(),
                label: c.name,
                ...c,
              }))}
              selectedValues={selectedConstituencies.map((id) => id.toString())}
              onChange={(values) =>
                setSelectedConstituencies(values.map((v) => parseInt(v)))
              }
              placeholder="Select constituencies..."
              searchPlaceholder="Search constituency..."
              emptyMessage="No constituency found."
              renderOption={(option, isSelected) => {
                const c = option as any as ConstituencyOption;
                const isAssignedElsewhere =
                  c.counting_center_id &&
                  c.counting_center_id !== centerToEdit?.id;

                return (
                  <>
                    <div className="flex items-center">
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          isSelected ? "opacity-100" : "opacity-0",
                        )}
                      />
                      <span>{option.label}</span>
                      <span className="text-xs text-muted-foreground ml-2 mt-1">
                        ({c.district})
                      </span>
                    </div>
                    {isAssignedElsewhere && (
                      <Badge
                        variant="outline"
                        className="text-xs text-yellow-600 border-yellow-200 bg-yellow-50"
                      >
                        Linked to {c.counting_center_name}
                      </Badge>
                    )}
                  </>
                );
              }}
              renderBadge={(option) => (
                <Badge key={option.value} variant="secondary" className="mr-1">
                  {option.label}
                  <div
                    className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 cursor-pointer"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleConstituency(parseInt(option.value));
                    }}
                  >
                    <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                  </div>
                </Badge>
              )}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              Note: Selecting a constituency already assigned to another center
              will reassign it to this center.
            </p>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
