import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Layers, Zap } from "lucide-react";
import Link from "next/link";

interface MassUpdateCTAProps {
  constituencyName: string;
}

export default function MassUpdateCTA({
  constituencyName,
}: MassUpdateCTAProps) {
  return (
    <Card className="bg-linear-to-br from-primary/10 via-background to-background border-primary/20 shadow-sm overflow-hidden relative group">
      <div className="absolute right-0 top-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
        <Layers className="w-24 h-24 rotate-12" />
      </div>

      <CardContent className="flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
        <div className="flex items-center gap-4">
          <div className="bg-primary/10 p-3 rounded-full shrink-0">
            <Zap className="text-primary w-6 h-6 fill-primary/20" />
          </div>
          <div>
            <h3 className="font-semibold leading-tight">
              Mass Update Candidates
            </h3>
            <p className="text-xs text-muted-foreground">
              Update votes for multiple candidates
            </p>
          </div>
        </div>

        <Button
          asChild
          size="lg"
          className="shrink-0 w-full sm:w-auto shadow-lg hover:shadow-primary/25 transition-all"
        >
          <Link href={`/election-update/${constituencyName}/mass-update`}>
            Mass Update
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
