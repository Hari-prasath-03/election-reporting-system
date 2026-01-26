import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { VoteRound } from "@/types";
import { format } from "date-fns";
import { CalendarClock, MapPin } from "lucide-react";

interface SubmissionsListProps {
  rounds: VoteRound[];
}

export default function SubmissionsList({ rounds }: SubmissionsListProps) {
  if (rounds.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground opacity-50">
        <CalendarClock className="h-16 w-16 mb-4 stroke-1" />
        <div className="text-xl font-medium">No submissions yet</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {rounds.map((round) => {
        const partyColor = round.candidates?.parties?.color_code;
        return (
          <div
            key={round.id}
            className="group relative flex items-center justify-between gap-4 rounded-xl border-l-2 bg-card px-2 py-2.5 shadow-sm transition-all hover:shadow-md overflow-hidden"
            style={{
              borderColor: partyColor,
            }}
          >
            <div className="flex items-center gap-4 min-w-0 flex-1 pl-2">
              <div className="relative">
                <Avatar className="h-12 w-12 border-2 border-background shadow-sm ring-1 ring-border/20">
                  <AvatarImage src={round.candidates?.parties?.symbol_url} />
                  <AvatarFallback className="font-bold">
                    {round.candidates?.parties?.short_name?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 bg-background rounded-full p-0.5 border shadow-sm">
                  <div className="bg-muted text-[10px] font-bold py-0.5 px-1 rounded-full">
                    R{round.round_no}
                  </div>
                </div>
              </div>

              <div className="flex flex-col min-w-0 gap-1">
                <div className="font-semibold text-lg leading-none truncate pr-2">
                  {round.candidates?.name || "Unknown Candidate"}
                </div>

                <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                  <span
                    className="px-1.5 py-0.5 text-[10px] rounded-md bg-muted/50 border border-border/50"
                    style={
                      partyColor
                        ? {
                            color: partyColor,
                            borderColor: `${partyColor}20`,
                            backgroundColor: `${partyColor}08`,
                          }
                        : {}
                    }
                  >
                    {round.candidates?.parties?.short_name}
                  </span>
                  {round.candidates?.constituencies?.name && (
                    <>
                      <div className="flex items-center gap-1 truncate text-muted-foreground/80">
                        {round.candidates.constituencies.name}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="text-right shrink-0 flex flex-col items-end gap-0.5">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                Votes
              </div>
              <div className="text-xl font-bold tabular-nums tracking-tight">
                {round.votes_count.toLocaleString()}
              </div>
              <div className="text-[10px] font-medium text-muted-foreground/70">
                {format(new Date(round.updated_at), "MMM d, h:mm a")}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
