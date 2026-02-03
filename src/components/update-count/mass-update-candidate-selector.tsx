"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Candidate } from "@/types";
import { Plus } from "lucide-react";
import { useState } from "react";

interface MassUpdateCandidateSelectorProps {
  candidates: Candidate[];
  selectedIds: number[];
  onToggleCandidate: (id: number) => void;
}

export default function MassUpdateCandidateSelector({
  candidates,
  selectedIds,
  onToggleCandidate,
}: MassUpdateCandidateSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <Button className="gap-2" id="mass-update-trigger">
          <Plus className="h-4 w-4" />
          Select Candidates
        </Button>
      </DrawerTrigger>
      <DrawerContent className="max-h-[85vh]">
        <DrawerHeader>
          <DrawerTitle>Select Candidates</DrawerTitle>
        </DrawerHeader>
        <ScrollArea className="h-[50vh] px-4">
          <div className="space-y-4">
            {candidates.map((candidate) => (
              <div
                key={candidate.id}
                className="flex items-center space-x-3 p-2 rounded-lg border bg-card"
              >
                <Checkbox
                  id={`c-${candidate.id}`}
                  checked={selectedIds.includes(candidate.id)}
                  onCheckedChange={() => onToggleCandidate(candidate.id)}
                />
                <label
                  htmlFor={`c-${candidate.id}`}
                  className="flex-1 flex items-center gap-3 cursor-pointer"
                >
                  <Avatar className="h-10 w-10 border">
                    <AvatarImage src={candidate.parties?.symbol_url} />
                    <AvatarFallback>
                      {candidate.parties?.short_name?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="font-semibold text-sm">
                      {candidate.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {candidate.parties?.name}
                    </span>
                  </div>
                </label>
              </div>
            ))}
          </div>
        </ScrollArea>
        <div className="p-4 border-t">
          <Button className="w-full" onClick={() => setIsOpen(false)}>
            Done ({selectedIds.length} selected)
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
