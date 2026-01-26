import { Candidate } from "@/types";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface CandidateCardProps {
  candidate: Candidate;
}

export function CandidateCard({ candidate }: CandidateCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow py-0">
      <CardHeader className="p-0">
        <div
          className={cn(
            "h-24 relative",
            !candidate.parties?.color_code &&
              "bg-linear-to-r from-blue-500 to-purple-500",
          )}
          style={
            candidate.parties?.color_code
              ? {
                  background: `linear-gradient(to right, ${candidate.parties.color_code}, ${candidate.parties.color_code}99)`,
                }
              : undefined
          }
        >
          <div className="absolute -bottom-10 left-6">
            <Avatar className="h-20 w-20 border-4 border-background">
              <AvatarImage
                src={candidate.photo_url}
                alt={candidate.name}
                className="object-cover"
              />
              <AvatarFallback>{candidate.name.charAt(0)}</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-12 px-6 pb-6">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-bold text-lg">{candidate.name}</h3>
            <p className="text-muted-foreground text-sm">
              {candidate.parties?.short_name} - {candidate.parties?.name}
            </p>
          </div>
          {candidate.parties?.symbol_url && (
            <Image
              width={32}
              height={32}
              alt="Party Symbol"
              className="h-8 w-8 object-contain"
              src={candidate.parties.symbol_url}
            />
          )}
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          <Badge variant="secondary">{candidate.gender}</Badge>
          {candidate.total_votes_cache !== undefined && (
            <Badge variant="outline">
              Votes: {candidate.total_votes_cache}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
