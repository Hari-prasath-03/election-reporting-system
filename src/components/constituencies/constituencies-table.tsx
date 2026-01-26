"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import badgeColors from "@/lib/badge-colors";

import { CustomDropdown } from "@/components/ui/custom-dropdown";
import { Loader2 } from "lucide-react";
import { ConstituencyData } from "@/types";

import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface ConstituenciesTableProps {
  constituencies: ConstituencyData[];
  loading: boolean;
  observerTarget: React.RefObject<HTMLDivElement>;
}

export default function ConstituenciesTable({
  constituencies,
  loading,
  observerTarget,
}: ConstituenciesTableProps) {
  const router = useRouter();

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-20">S.No</TableHead>
            <TableHead>Constituency</TableHead>
            <TableHead>District</TableHead>
            <TableHead>Type</TableHead>
            <TableHead className="text-right">No of Candidates</TableHead>
            <TableHead className="w-25">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {constituencies.length > 0 ? (
            constituencies.map((item) => (
              <TableRow key={`${item.s_no}-${item.constituency}`}>
                <TableCell className="font-medium">{item.s_no}</TableCell>
                <TableCell>{item.constituency}</TableCell>
                <TableCell>{item.district}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={cn(
                      "font-medium border-0",
                      badgeColors.type[item.type || "General"],
                    )}
                  >
                    {item.type}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <span className="px-8">{item.candidate_count || 0}</span>
                </TableCell>
                <TableCell>
                  <CustomDropdown
                    items={[
                      {
                        label: "View Details",
                        onClick: () =>
                          router.push(
                            `/dashboard/view-constituencies/${item.constituency}`,
                          ),
                      },
                      {
                        label: "Add Candidate",
                        onClick: () =>
                          router.push(
                            `/dashboard/manage-candidates?constituencyId=${item.id}`,
                          ),
                      },
                    ]}
                  />
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                {!loading && "No constituencies found."}
                {loading && "Searching..."}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <div
        ref={observerTarget}
        className={cn(
          "w-full flex justify-center items-center",
          loading && "h-4 py-4",
        )}
      >
        {loading && constituencies.length > 0 && (
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        )}
      </div>
    </div>
  );
}
