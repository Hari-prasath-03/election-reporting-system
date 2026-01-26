"use client";

import { ConstituencyData } from "@/types";
import { useState, useEffect, useRef, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { FormSelect } from "@/components/ui/form-select";
import { Search } from "lucide-react";
import ConstituenciesTable from "./constituencies-table";

export default function ViewConstituenciesClient({
  initialConstituencies,
  initialTotal,
  allDistricts,
}: {
  initialConstituencies: ConstituencyData[];
  initialTotal: number;
  allDistricts: string[];
}) {
  const [constituencies, setConstituencies] = useState<ConstituencyData[]>(
    initialConstituencies,
  );
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(initialTotal);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("all");

  const observerTarget = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);

  const fetchConstituencies = useCallback(
    async (pageNum: number, isNewFilter: boolean = false) => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          page: pageNum.toString(),
          limit: "20",
          query: searchQuery,
          district: selectedDistrict,
        });

        const response = await fetch(
          `/api/constituencies?${params.toString()}`,
        );
        const result = await response.json();

        if (result.success && result.data) {
          if (isNewFilter) {
            setConstituencies(result.data);
            setPage(1);
          } else {
            setConstituencies((prev) => [...prev, ...result.data]);
            setPage(pageNum);
          }
          setTotal(result.total);
        }
      } catch (error) {
        console.error("Failed to fetch constituencies:", error);
      }

      setLoading(false);
    },
    [searchQuery, selectedDistrict],
  );

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const timer = setTimeout(() => fetchConstituencies(1, true), 500);
    return () => clearTimeout(timer);
  }, [searchQuery, selectedDistrict, fetchConstituencies]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          !loading &&
          constituencies.length < total
        )
          fetchConstituencies(page + 1);
      },
      { threshold: 0.1 },
    );

    if (observerTarget.current) observer.observe(observerTarget.current);
    return () => observer.disconnect();
  }, [loading, total, constituencies.length, page, fetchConstituencies]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-6">
        <div className="flex w-full sm:max-w-sm items-center space-x-2">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search constituencies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
        <div className="w-full sm:w-50">
          <div className="w-full sm:w-50">
            <FormSelect
              value={selectedDistrict}
              onValueChange={setSelectedDistrict}
              placeholder="Filter by District"
              options={[
                { value: "all", label: "All Districts" },
                ...allDistricts.map((d) => ({ value: d, label: d })),
              ]}
            />
          </div>
        </div>
      </div>

      <ConstituenciesTable
        loading={loading}
        constituencies={constituencies}
        observerTarget={observerTarget as React.RefObject<HTMLDivElement>}
      />
    </div>
  );
}
