import { cn } from "@/lib/utils";
import { Candidate } from "@/types";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface CnadidateAvatharProps {
  constituencyName: string;
  candidate: Candidate;
}

export default function CnadidateAvathar({
  constituencyName,
  candidate,
}: CnadidateAvatharProps) {
  return (
    <Link
      key={candidate.id}
      href={`/election-update/${constituencyName}/${candidate.id}`}
      className={cn(
        "flex flex-col items-center gap-3 group p-4 rounded-xl transition-all relative hover:bg-muted/50",
      )}
    >
      <div className="relative">
        <Avatar className="size-20 border-2 border-muted group-hover:border-primary/50 transition-colors shadow-sm">
          <AvatarImage
            src={candidate.parties?.symbol_url}
            className="object-cover"
          />
          <AvatarFallback className="text-xl">
            {candidate.parties?.short_name?.[0]}
          </AvatarFallback>
        </Avatar>
        <span
          className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold text-white shadow-sm ring-2 ring-background"
          style={{
            backgroundColor: candidate.parties?.color_code || "#gray",
          }}
        >
          {candidate.parties?.short_name}
        </span>
      </div>

      <div className="text-center space-y-1 w-full overflow-hidden">
        <p className="font-medium leading-tight text-sm truncate w-full group-hover:text-primary transition-colors">
          {candidate.name}
        </p>
        <p className="text-xs text-muted-foreground truncate w-full">
          {candidate.parties?.name}
        </p>
      </div>
    </Link>
  );
}
