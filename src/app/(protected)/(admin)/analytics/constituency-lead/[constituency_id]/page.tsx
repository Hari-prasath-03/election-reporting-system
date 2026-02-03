/* eslint-disable @typescript-eslint/no-explicit-any */
import { getConstituencyCandidates } from "@/services/analytics-service";
import { getAllConstituenciesForSelect } from "@/services/constituency-service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { ConstituencyNavigator } from "@/components/analytics/constituency-navigator";
import { CandidateCard } from "@/components/analytics/candidate-card";
import Link from "next/link";

export default async function ConstituencyDetailPage({
  params,
}: {
  params: Promise<{
    constituency_id: string;
  }>;
}) {
  const { constituency_id } = await params;
  const constituencyId = parseInt(constituency_id, 10);

  const [candidates, constituenciesResult] = await Promise.all([
    getConstituencyCandidates(constituencyId),
    getAllConstituenciesForSelect(),
  ]);

  const allConstituencies = constituenciesResult.success
    ? constituenciesResult.data
    : [];

  if (!candidates || candidates.length === 0) {
    return (
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex flex-col items-center justify-center min-h-125">
          <h1 className="text-2xl font-bold text-slate-900">
            Constituency Not Found
          </h1>
          <p className="text-slate-500 mt-2">
            Could not find any data for constituency ID: {constituency_id}
          </p>
          <div className="mt-4 flex gap-4">
            <Button asChild variant="outline">
              <Link href="/analytics/constituency-lead">Go Back</Link>
            </Button>
            <ConstituencyNavigator
              constituencies={allConstituencies}
              currentId={constituencyId}
            />
          </div>
        </div>
      </main>
    );
  }

  const firstCandidate: any = candidates[0];
  const constituencyName = firstCandidate?.constituency?.name;
  const districtName = (firstCandidate?.constituency as any)?.district?.name;

  return (
    <main className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="space-y-6">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild>
              <Link href="/analytics/constituency-lead">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                {constituencyName}
              </h1>
              <p className="text-slate-500 mt-1">
                Election Results for {constituencyName} ({districtName})
              </p>
            </div>
          </div>
          <ConstituencyNavigator
            constituencies={allConstituencies}
            currentId={constituencyId}
          />
        </header>

        <Card className="border-slate-200 shadow-sm overflow-hidden">
          <CardHeader className="bg-slate-50 border-b border-slate-200">
            <div className="flex justify-between items-center">
              <CardTitle>Candidates Breakdown</CardTitle>
              <Badge variant="outline" className="bg-white">
                Total Candidates: {candidates.length}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100">
              {candidates.map((candidate: any, index: number) => (
                <CandidateCard
                  key={candidate.id}
                  candidate={candidate}
                  rank={index + 1}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
