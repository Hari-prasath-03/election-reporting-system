"use client";

import { useState } from "react";
import { ConstituencyMap } from "@/components/analytics/constituency-map";
import { ConstituencyLeadTable } from "@/components/analytics/constituency-lead-table";
import { cn } from "@/lib/utils";
import { MapIcon, TableIcon } from "lucide-react";
import { ConstituencyMargin } from "@/types";

interface ConstituencyAnalysisTabsProps {
  data: ConstituencyMargin[];
}

export function ConstituencyAnalysisTabs({
  data,
}: ConstituencyAnalysisTabsProps) {
  const [activeTab, setActiveTab] = useState<"map" | "table">("table");

  return (
    <div className="flex flex-col space-y-4">
      <div className="self-center bg-slate-100 p-1 rounded-lg inline-flex">
        <button
          onClick={() => setActiveTab("map")}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all",
            activeTab === "map"
              ? "bg-white text-slate-900 shadow-sm"
              : "text-slate-500 hover:text-slate-900",
          )}
        >
          <MapIcon className="h-4 w-4" />
          Map View
        </button>
        <button
          onClick={() => setActiveTab("table")}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all",
            activeTab === "table"
              ? "bg-white text-slate-900 shadow-sm"
              : "text-slate-500 hover:text-slate-900",
          )}
        >
          <TableIcon className="h-4 w-4" />
          Table View
        </button>
      </div>

      <div className="mt-4">
        {activeTab === "map" && (
          <div className="min-h-150 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <ConstituencyMap data={data} />
          </div>
        )}

        {activeTab === "table" && <ConstituencyLeadTable data={data} />}
      </div>
    </div>
  );
}
