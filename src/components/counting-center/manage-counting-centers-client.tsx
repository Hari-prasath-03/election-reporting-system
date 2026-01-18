"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import CountingCenterCard from "@/components/counting-center/counting-center-card";
import CountingCenterForm from "@/components/counting-center/counting-center-form";
import { CountingCenter } from "@/types";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";

interface ManageCountingCentersClientProps {
  initialCenters: CountingCenter[];
  districts: string[];
}

export default function ManageCountingCentersClient({
  initialCenters,
  districts,
}: ManageCountingCentersClientProps) {
  const [centers, setCenters] = useState<CountingCenter[]>(initialCenters);
  const [filteredCenters, setFilteredCenters] =
    useState<CountingCenter[]>(initialCenters);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [centerToEdit, setCenterToEdit] = useState<CountingCenter | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<string>("all");

  useEffect(() => {
    setCenters(initialCenters);
  }, [initialCenters]);

  useEffect(() => {
    if (selectedDistrict === "all") {
      setFilteredCenters(centers);
    } else {
      const filtered = centers.filter((center) =>
        center.constituencies?.some(
          (c: any) =>
            c.district_id?.name === selectedDistrict ||
            (Array.isArray(c.district_id) &&
              c.district_id[0]?.name === selectedDistrict),
        ),
      );
      setFilteredCenters(filtered);
    }
  }, [selectedDistrict, centers]);

  const handleCreate = () => {
    setCenterToEdit(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (center: CountingCenter) => {
    setCenterToEdit(center);
    setIsDialogOpen(true);
  };

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Counting Centers
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage counting centers and their constituency assignments.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
            <SelectTrigger className="w-45">
              <SelectValue placeholder="Filter by District" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Districts</SelectItem>
              {districts.map((district) => (
                <SelectItem key={district} value={district}>
                  {district}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedDistrict !== "all" && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSelectedDistrict("all")}
            >
              <X className="h-4 w-4" />
            </Button>
          )}

          <Button onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" /> Add Center
          </Button>
        </div>
      </div>

      {filteredCenters.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed rounded-lg bg-muted/20">
          <h3 className="text-lg font-medium text-muted-foreground">
            No counting centers found
          </h3>
          <p className="text-sm text-muted-foreground mt-2 mb-4">
            {selectedDistrict !== "all"
              ? "Try changing the filter or create a new one."
              : "Create your first counting center to get started."}
          </p>
          <Button onClick={handleCreate} variant="outline">
            Create Center
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCenters.map((center) => (
            <CountingCenterCard
              key={center.id}
              center={center}
              onEdit={handleEdit}
            />
          ))}
        </div>
      )}

      <CountingCenterForm
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        centerToEdit={centerToEdit}
      />
    </>
  );
}
