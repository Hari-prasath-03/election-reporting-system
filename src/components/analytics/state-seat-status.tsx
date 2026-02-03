import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StateSeatProps {
  data: {
    party_id: string;
    party_short_name: string;
    party_color: string;
    party_symbol: string;
    seats_leading: number;
  }[];
  independentSeats: {
    independent_seats: number;
  };
}

export function StateSeatStatus({ data, independentSeats }: StateSeatProps) {
  const totalSeats =
    data.reduce((acc, curr) => acc + curr.seats_leading, 0) +
    independentSeats.independent_seats;

  const sortedData = [...data].sort(
    (a, b) => b.seats_leading - a.seats_leading,
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {sortedData.map((party) => (
        <Card
          key={party.party_id}
          className="border-l-4"
          style={{ borderLeftColor: party.party_color }}
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-bold flex justify-between items-center">
              <div className="flex items-center gap-2">
                {party.party_symbol && (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={party.party_symbol}
                    alt={party.party_short_name}
                    className="w-8 h-8 object-contain"
                  />
                )}
                <span>{party.party_short_name}</span>
              </div>
              <span className="text-2xl" style={{ color: party.party_color }}>
                {party.seats_leading}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              Leading in{" "}
              {((party.seats_leading / (totalSeats || 1)) * 100).toFixed(1)}% of
              seats
            </div>
            <div className="mt-2 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${(party.seats_leading / (totalSeats || 1)) * 100}%`,
                  backgroundColor: party.party_color,
                }}
              />
            </div>
          </CardContent>
        </Card>
      ))}

      {independentSeats.independent_seats > 0 && (
        <Card className="border-l-4 border-l-slate-400">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-bold flex justify-between items-center text-slate-700">
              <span>IND</span>
              <span className="text-2xl text-slate-600">
                {independentSeats.independent_seats}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              Independent Candidates
            </div>
            <div className="mt-2 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div
                className="h-full bg-slate-400 rounded-full transition-all duration-500"
                style={{
                  width: `${(independentSeats.independent_seats / (totalSeats || 1)) * 100}%`,
                }}
              />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
