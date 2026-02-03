"use client";

import { Badge } from "@/components/ui/badge";
import { User as UserIcon } from "lucide-react";
import Image from "next/image";

interface CandidateCardProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  candidate: any;
  rank: number;
}

export function CandidateCard({ candidate, rank }: CandidateCardProps) {
  const isWinner = rank === 1;

  return (
    <div
      className={`relative flex flex-col sm:flex-row items-start sm:items-center gap-6 p-6 transition-colors overflow-hidden ${
        isWinner ? "bg-emerald-50/10" : "hover:bg-slate-50/50"
      }`}
    >
      {candidate.party?.symbol_url && (
        <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-[0.08] pointer-events-none w-64 h-64 -mr-16">
          <Image
            src={candidate.party.symbol_url}
            alt=""
            fill
            className="object-contain"
          />
        </div>
      )}

      <div className="flex items-center gap-4 shrink-0">
        <span
          className={`text-xl font-bold font-mono w-8 text-center ${
            isWinner ? "text-emerald-600" : "text-slate-400"
          }`}
        >
          #{rank}
        </span>
        <div className="relative h-20 w-20 rounded-full border-2 border-slate-100 overflow-hidden shrink-0 bg-white shadow-sm">
          {candidate.photo_url ? (
            <Image
              src={candidate.photo_url}
              alt={candidate.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-slate-50">
              <UserIcon className="h-8 w-8 text-slate-300" />
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 min-w-0 grid gap-2 z-10">
        <div className="flex flex-wrap items-center gap-3">
          <h3 className="font-bold text-xl text-slate-900">{candidate.name}</h3>
          {isWinner && (
            <Badge className="bg-emerald-600 hover:bg-emerald-700 text-white border-0 shadow-sm animate-in fade-in zoom-in duration-500">
              Leading
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 bg-slate-50 rounded-full pl-1 pr-4 py-1 border border-slate-100 w-fit">
            <div className="relative h-8 w-8 shrink-0 bg-white rounded-full p-1 border border-slate-100">
              {candidate.party?.symbol_url ? (
                <Image
                  src={candidate.party.symbol_url}
                  alt={candidate.party.short_name}
                  fill
                  className="object-contain p-1"
                />
              ) : (
                <span className="w-full h-full flex items-center justify-center text-[10px] text-slate-400 font-bold">
                  IND
                </span>
              )}
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-bold text-slate-900 text-sm">
                {candidate.party?.short_name || "Independent"}
              </span>
              <span className="text-[10px] text-slate-500 font-medium truncate max-w-37.5">
                {candidate.party?.name || "Independent Candidate"}
              </span>
            </div>
          </div>
          <Badge
            variant="secondary"
            className="font-normal text-slate-500 bg-slate-50 h-7"
          >
            {candidate.gender}
          </Badge>
        </div>
      </div>

      <div className="text-right shrink-0 z-10 bg-white/50 backdrop-blur-sm p-2 rounded-lg sm:bg-transparent sm:backdrop-blur-none">
        <div className="text-3xl font-black text-slate-900 font-mono tracking-tight">
          {candidate.total_votes.toLocaleString()}
        </div>
        <div className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">
          Total Votes
        </div>
      </div>
    </div>
  );
}
