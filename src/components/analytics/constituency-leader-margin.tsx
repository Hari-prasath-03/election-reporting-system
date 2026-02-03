import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ConstituencyMarginProps {
  data: {
    constituency_id: string;
    constituency_name: string;
    leader_candidate: string;
    leader_party: string;
    competing_party: string;
    vote_margin: number;
    party_symbol_url?: string;
    party_color?: string;
  }[];
}

export function ConstituencyLeaderMargin({ data }: ConstituencyMarginProps) {
  const sortedData = [...data].sort((a, b) =>
    a.constituency_name.localeCompare(b.constituency_name),
  );

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex-none">
        <CardTitle className="flex justify-between items-center">
          <span>Constituency Map View</span>
          <Badge
            variant="outline"
            className="font-normal text-muted-foreground"
          >
            {data.length} Constituencies
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto p-4">
        {/* Flex grid as a placeholder for the actual map */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2">
          {sortedData.map((item) => (
            <div
              key={item.constituency_id}
              className="relative aspect-square rounded-lg border shadow-sm flex flex-col items-center justify-center p-2 text-center transition-all hover:scale-105 hover:shadow-md group"
              style={{
                backgroundColor: item.party_color
                  ? `${item.party_color}10`
                  : "white",
                borderColor: item.party_color || "#e2e8f0",
              }}
            >
              <div className="text-[10px] uppercase tracking-wider font-semibold text-slate-500 mb-1 truncate w-full">
                {item.constituency_name}
              </div>

              {item.party_symbol_url ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={item.party_symbol_url}
                  alt={item.leader_party}
                  className="w-10 h-10 object-contain mb-1 drop-shadow-sm"
                />
              ) : (
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-white mb-1 shadow-sm"
                  style={{ backgroundColor: item.party_color || "#94a3b8" }}
                >
                  {item.leader_party?.substring(0, 2)}
                </div>
              )}

              <div
                className="font-bold text-xs truncate w-full"
                style={{ color: item.party_color }}
              >
                {item.leader_party}
              </div>

              {/* Tooltip-like details on hover via absolute positioning or just visible text if space permits */}
              <div className="text-[10px] text-slate-400 mt-0.5">
                +{item.vote_margin?.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
