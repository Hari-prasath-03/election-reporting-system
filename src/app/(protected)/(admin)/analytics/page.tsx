import {
  getStateSeatStatus,
  getIndependentSeats,
  getDistrictSeatStatus,
} from "@/services/analytics-service";
import { StateSeatStatus } from "@/components/analytics/state-seat-status";
import { DistrictSeatStatus } from "@/components/analytics/district-seat-status";
import Link from "next/link";
import Map from "@/assets/icons/map";

export default async function AnalyticsPage() {
  const [stateSeats, independentSeats, districtSeats] = await Promise.all([
    getStateSeatStatus(),
    getIndependentSeats(),
    getDistrictSeatStatus(),
  ]);

  return (
    <main className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="min-h-screen space-y-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Live Election Analytics
            </h1>
            <p className="text-slate-500 mt-1">
              Real-time coverage of seat leads and margins
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/analytics/constituency-lead"
              className="hidden md:flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg shadow-sm hover:bg-slate-50 transition-colors font-medium text-slate-700"
            >
              <Map />
              View Map
            </Link>
          </div>
        </header>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-800 border-l-4 border-slate-900 pl-3">
            State Seat Status
          </h2>
          <StateSeatStatus
            data={stateSeats}
            independentSeats={independentSeats}
          />
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-800 border-l-4 border-slate-900 pl-3">
            District-wise Breakdown
          </h2>
          <div className="w-full">
            <DistrictSeatStatus data={districtSeats} />
          </div>
        </section>
      </div>
    </main>
  );
}
