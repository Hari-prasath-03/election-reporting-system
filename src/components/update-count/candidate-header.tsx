"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";
import { Candidate } from "@/types";
import { Check, ChevronsUpDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface CandidateHeaderProps {
  candidate: Candidate;
  totalVotes: number;
  allCandidates?: Candidate[];
  constituencyName?: string;
}

export function CandidateHeader({
  candidate,
  totalVotes,
  allCandidates,
  constituencyName,
}: CandidateHeaderProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleCandidateChange = (candidateId: string) => {
    if (constituencyName) {
      setOpen(false);
      router.push(`/election-update/${constituencyName}/${candidateId}`);
    }
  };

  return (
    <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 border-b px-4 py-3 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div className="relative shrink-0">
          <Avatar className="h-10 w-10 border border-border shadow-sm">
            <AvatarImage src={candidate.parties?.symbol_url} />
            <AvatarFallback>
              {candidate.parties?.short_name?.[0]}
            </AvatarFallback>
          </Avatar>
        </div>

        <div className="min-w-0 flex flex-col items-start gap-0.5">
          {allCandidates && allCandidates.length > 0 && constituencyName ? (
            <Drawer open={open} onOpenChange={setOpen}>
              <DrawerTrigger asChild>
                <Button
                  variant="outline"
                  className="h-auto py-1.5 px-3 pr-2 font-bold text-base md:text-lg justify-between gap-2 max-w-70 rounded-full border border-border/50 bg-background/50 hover:bg-accent hover:text-accent-foreground transition-all shadow-sm group"
                >
                  <span className="truncate">{candidate.name}</span>
                  <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50 group-hover:opacity-100 transition-opacity" />
                </Button>
              </DrawerTrigger>
              <DrawerContent className="max-h-[85vh] h-full flex flex-col rounded-t-[10px] outline-none">
                <div className="mx-auto w-12 h-1.5 shrink-0 rounded-full bg-muted mt-4 mb-2" />
                <DrawerHeader className="px-4 pb-2 text-left">
                  <DrawerTitle>Select Candidate</DrawerTitle>
                </DrawerHeader>
                <div className="flex-1 overflow-hidden p-4 pt-0">
                  <Command className="h-full border-0 rounded-none bg-transparent">
                    <CommandInput
                      placeholder="Search candidate..."
                      className="h-12 border-b border-border/50 focus:ring-0 px-0"
                    />
                    <CommandList className="h-full max-h-none py-4 overflow-y-auto">
                      <CommandEmpty>No candidate found.</CommandEmpty>
                      <CommandGroup heading="Candidates">
                        {allCandidates.map((c) => (
                          <CommandItem
                            key={c.id}
                            value={c.name}
                            onSelect={() =>
                              handleCandidateChange(c.id.toString())
                            }
                            className={cn(
                              "cursor-pointer mb-2 last:mb-0 rounded-xl border border-border/50 bg-card p-3 shadow-sm transition-colors ease-in-out duration-200",
                              "data-[selected=true]:bg-transparent data-[selected=true]:text-foreground",
                              candidate.id === c.id &&
                                "bg-primary/5 border-primary/50",
                            )}
                          >
                            <div className="flex items-center gap-4 w-full">
                              <Avatar className="h-12 w-12 border border-border shrink-0">
                                <AvatarImage src={c.parties?.symbol_url} />
                                <AvatarFallback className="text-lg">
                                  {c.parties?.short_name?.[0]}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex flex-col min-w-0 flex-1 gap-1">
                                <span className="font-semibold text-base leading-none truncate">
                                  {c.name}
                                </span>
                                <div className="flex items-center gap-2">
                                  <span
                                    className={cn(
                                      "text-[10px] text-muted-foreground truncate rounded-full bg-muted px-2 py-0.5 font-medium border border-border/50",
                                      c.parties?.color_code
                                        ? `border-[${c.parties.color_code}]/20`
                                        : "",
                                    )}
                                  >
                                    {c.parties?.short_name}
                                  </span>
                                </div>
                              </div>
                              {candidate.id === c.id && (
                                <div className="bg-primary text-primary-foreground h-6 w-6 rounded-full flex items-center justify-center shadow-sm shrink-0">
                                  <Check className="h-3.5 w-3.5" />
                                </div>
                              )}
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </div>
              </DrawerContent>
            </Drawer>
          ) : (
            <div className="font-bold text-lg truncate px-1">
              {candidate.name}
            </div>
          )}

          {!open && (
            <div className="text-xs text-muted-foreground truncate px-1">
              {candidate.parties?.name}
            </div>
          )}
        </div>
      </div>

      <div className="text-right shrink-0">
        <div className="text-[10px] uppercase text-muted-foreground font-semibold tracking-wider">
          Total Votes
        </div>
        <div className="text-xl font-bold text-primary tabular-nums tracking-tight">
          {totalVotes.toLocaleString()}
        </div>
      </div>
    </div>
  );
}
