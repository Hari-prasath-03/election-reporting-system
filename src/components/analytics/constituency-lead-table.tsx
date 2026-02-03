"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { ConstituencyMargin } from "@/types";

interface ConstituencyLeadTableProps {
  data: ConstituencyMargin[];
}

export function ConstituencyLeadTable({ data }: ConstituencyLeadTableProps) {
  const router = useRouter();
  const [selectedDistrict, setSelectedDistrict] = useState<string>("all");
  const [selectedConstituency, setSelectedConstituency] =
    useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const districts = useMemo(() => {
    const uniqueDistricts = new Set(
      data.map((item) => item.district).filter((d): d is string => !!d),
    );
    return Array.from(uniqueDistricts).sort();
  }, [data]);

  const constituencies = useMemo(() => {
    let filtered = data;
    if (selectedDistrict !== "all") {
      filtered = filtered.filter((item) => item.district === selectedDistrict);
    }
    return filtered
      .map((item) => ({
        id: item.constituency_id,
        name: item.constituency_name,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [data, selectedDistrict]);

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchesDistrict =
        selectedDistrict === "all" || item.district === selectedDistrict;
      const matchesConstituency =
        selectedConstituency === "all" ||
        item.constituency_id.toString() === selectedConstituency;
      const matchesSearch =
        item.constituency_name
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        item.leader_candidate.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesDistrict && matchesConstituency && matchesSearch;
    });
  }, [data, selectedDistrict, selectedConstituency, searchQuery]);

  return (
    <Card className="h-full border-slate-200 shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <CardTitle className="text-xl font-bold text-slate-900">
            Constituency Lead Table
          </CardTitle>
          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
              <Input
                placeholder="Search..."
                className="pl-9 w-full sm:w-50 bg-slate-50 border-slate-200"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select
              value={selectedDistrict}
              onValueChange={(val) => {
                setSelectedDistrict(val);
                setSelectedConstituency("all");
              }}
            >
              <SelectTrigger className="w-full sm:w-45 bg-slate-50 border-slate-200">
                <SelectValue placeholder="District" />
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
            <Select
              value={selectedConstituency}
              onValueChange={setSelectedConstituency}
            >
              <SelectTrigger className="w-full sm:w-45 bg-slate-50 border-slate-200">
                <SelectValue placeholder="Constituency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Constituencies</SelectItem>
                {constituencies.map((c) => (
                  <SelectItem key={c.id} value={c.id.toString()}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="border-t border-slate-200">
          <div className="overflow-x-auto max-h-150">
            <Table>
              <TableHeader className="bg-slate-50 sticky top-0 z-10 shadow-sm">
                <TableRow className="hover:bg-slate-50 border-b border-slate-200">
                  <TableHead className="font-semibold text-slate-500 px-6">
                    District
                  </TableHead>
                  <TableHead className="font-semibold text-slate-500">
                    Constituency
                  </TableHead>
                  <TableHead className="font-semibold text-slate-500">
                    Leading Candidate
                  </TableHead>
                  <TableHead className="font-semibold text-slate-500">
                    Party
                  </TableHead>
                  <TableHead className="font-semibold text-slate-500 text-right">
                    Margin
                  </TableHead>
                  <TableHead className="font-semibold text-slate-500 px-6">
                    Trailing Party
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.length > 0 ? (
                  filteredData.map((item) => (
                    <TableRow
                      key={item.constituency_id}
                      className="cursor-pointer hover:bg-slate-50/80 transition-colors border-b border-slate-100"
                      onClick={() =>
                        router.push(
                          `/analytics/constituency-lead/${item.constituency_id}`,
                        )
                      }
                    >
                      <TableCell className="text-slate-500 px-6 py-4">
                        {item.district}
                      </TableCell>
                      <TableCell className="font-medium text-slate-900 py-4">
                        {item.constituency_name}
                      </TableCell>
                      <TableCell className="text-slate-700 py-4">
                        {item.leader_candidate}
                      </TableCell>
                      <TableCell className="py-4">
                        <Badge
                          variant="outline"
                          className="font-normal px-2 py-0.5 rounded-full border"
                          style={{
                            borderColor: item.leader_party_color || "#cbd5e1",
                            backgroundColor: item.leader_party_color
                              ? `${item.leader_party_color}10`
                              : "transparent",
                            color: item.leader_party_color || "inherit",
                          }}
                        >
                          {item.leader_party}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-mono text-slate-600 font-medium py-4">
                        {item.vote_margin.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-slate-500 px-6 py-4">
                        {item.competing_party}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="h-32 text-center text-slate-500"
                    >
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Search className="h-8 w-8 opacity-20" />
                        <p>No results found matching your criteria.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
        <div className="p-4 border-t border-slate-200 text-xs text-slate-400 text-center">
          Showing {filteredData.length} of {data.length} constituencies
        </div>
      </CardContent>
    </Card>
  );
}
