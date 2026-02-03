import { getConstituencyMargins } from "@/services/analytics-service";
import { ConstituencyAnalysisTabs } from "@/components/analytics/constituency-analysis-tabs";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function ConstituencyStatusPage() {
  const constituencyMargins = await getConstituencyMargins();

  return (
    <main className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="min-h-screen space-y-8 flex flex-col">
        <header className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/analytics">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Constituency Lead Analysis
            </h1>
            <p className="text-slate-500 mt-1">
              Interactive geographic view and detailed breakdown of election
              results
            </p>
          </div>
        </header>

        <section className="flex-1">
          <ConstituencyAnalysisTabs data={constituencyMargins} />
        </section>
      </div>
    </main>
  );
}
