import fetchCountingCentersWithAssignmentsAction from "@/actions/counting-center/fetch-counting-centers-with-assignments-action";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MapPin, User } from "lucide-react";
import { Fragment } from "react";

export default async function ViewAssignmentsPage() {
  const { data: countingCenters, success } =
    await fetchCountingCentersWithAssignmentsAction();

  if (!success || !countingCenters) {
    return (
      <main className="space-y-6 container mx-auto px-4 py-8 max-w-7xl">
        <div className="p-4 text-red-500">Failed to load assignments data.</div>
      </main>
    );
  }

  return (
    <main className="space-y-6 container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Counting Center Assignments
          </h1>
          <p className="text-muted-foreground">
            Overview of all staff assignments across counting centers.
          </p>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="w-[30%]">Counting Center</TableHead>
            <TableHead className="w-[30%]">Location</TableHead>
            <TableHead className="w-[40%]">Appointed Informer</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {countingCenters.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={3}
                className="text-center py-8 text-muted-foreground p-3"
              >
                No counting centers found.
              </TableCell>
            </TableRow>
          ) : (
            countingCenters.map((center: any) => {
              const assignments = center.assignments || [];
              const rowSpan = Math.max(assignments.length, 1);

              return (
                <Fragment key={center.id}>
                  <TableRow
                    key={`${center.id}-main`}
                    className="group hover:bg-transparent"
                  >
                    <TableCell
                      rowSpan={rowSpan}
                      className="align-middle border-r bg-card font-medium p-3"
                    >
                      <div>{center.name}</div>
                    </TableCell>
                    <TableCell
                      rowSpan={rowSpan}
                      className="align-middle border-r bg-card text-muted-foreground text-sm p-3 text-wrap"
                    >
                      <div className="flex items-start gap-2">
                        {center.location_address && (
                          <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-muted-foreground/70" />
                        )}
                        <span>{center.location_address || "N/A"}</span>
                      </div>
                    </TableCell>

                    {assignments.length > 0 ? (
                      <TableCell className="p-3 align-top">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-primary/70 shrink-0" />
                          <span className="font-medium text-foreground text-sm">
                            {assignments[0].profile?.display_name || "Unknown"}
                            {assignments[0].profile?.email && (
                              <span className="text-muted-foreground font-normal ml-1 text-xs">
                                ({assignments[0].profile.email})
                              </span>
                            )}
                          </span>
                        </div>
                      </TableCell>
                    ) : (
                      <TableCell className="p-3 text-muted-foreground italic bg-muted/5 align-top">
                        No informers assigned yet.
                      </TableCell>
                    )}
                  </TableRow>

                  {assignments.slice(1).map((assignment: any) => (
                    <TableRow
                      key={assignment.id}
                      className="hover:bg-transparent"
                    >
                      <TableCell className="p-3 align-top border-t">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-primary/70 shrink-0" />
                          <span className="font-medium text-foreground text-sm">
                            {assignment.profile?.display_name || "Unknown"}
                            {assignment.profile?.email && (
                              <span className="text-muted-foreground font-normal ml-1 text-xs">
                                ({assignment.profile.email})
                              </span>
                            )}
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </Fragment>
              );
            })
          )}
        </TableBody>
      </Table>
    </main>
  );
}
