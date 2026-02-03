"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";

interface DistrictSeatProps {
  data: {
    district_id: string;
    district_name: string;
    party_id: string;
    party_short_name: string;
    party_color: string;
    party_symbol: string;
    seats_leading: number;
  }[];
}

export function DistrictSeatStatus({ data }: DistrictSeatProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const districtMap = new Map<string, typeof data>();

  data.forEach((item) => {
    if (!districtMap.has(item.district_name)) {
      districtMap.set(item.district_name, []);
    }
    districtMap.get(item.district_name)?.push(item);
  });

  const sortedDistricts = Array.from(districtMap.keys()).sort();

  const filteredDistricts = sortedDistricts.filter((district) =>
    district.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <Card className="h-full flex flex-col overflow-hidden border-slate-200 shadow-sm">
      <CardHeader className="pb-4 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <CardTitle className="text-xl font-bold text-slate-900">
            District-wise Breakdown
          </CardTitle>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
            <Input
              type="text"
              placeholder="Search district..."
              className="pl-9 bg-slate-50 border-slate-200 focus-visible:ring-slate-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0 flex-1 min-h-0 bg-slate-50/30">
        <div className="flex items-center px-6 py-3 border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wider">
          <div className="w-1/3">District</div>
          <div className="w-2/3">Leading Parties</div>
        </div>
        <ScrollArea className="h-125">
          {filteredDistricts.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {filteredDistricts.map((districtName) => {
                const parties = districtMap.get(districtName) || [];
                parties.sort((a, b) => b.seats_leading - a.seats_leading);

                return (
                  <div
                    key={districtName}
                    className="flex items-center px-6 py-4 hover:bg-white transition-colors"
                  >
                    <div className="w-1/3 pr-4">
                      <span className="font-semibold text-slate-800 text-sm">
                        {districtName}
                      </span>
                    </div>
                    <div className="w-2/3 flex flex-wrap gap-2">
                      {parties.map((p) => (
                        <Badge
                          key={p.party_id}
                          variant="outline"
                          className="flex items-center gap-1.5 py-1 font-normal border shadow-sm hover:bg-slate-50 transition-colors"
                          style={{
                            borderColor: p.party_color
                              ? `${p.party_color}40`
                              : undefined,
                            backgroundColor: p.party_color
                              ? `${p.party_color}08`
                              : undefined,
                          }}
                        >
                          {p.party_symbol && (
                            <div className="relative w-5 h-5 shrink-0">
                              <Image
                                fill
                                src={p.party_symbol}
                                alt={p.party_short_name}
                                className="object-contain p-0.5 rounded-full"
                              />
                            </div>
                          )}
                          <div className="flex flex-col leading-none">
                            <span className="text-slate-500 font-semibold mb-0.5">
                              {p.party_short_name}
                            </span>
                          </div>
                          <span className="ml-1 text-sm font-bold text-slate-900 bg-white/50 px-1 rounded">
                            {p.seats_leading}
                          </span>
                        </Badge>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-slate-500">
              <Search className="h-8 w-8 mb-2 opacity-20" />
              <p>No districts found matching &quot;{searchQuery}&quot;</p>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
