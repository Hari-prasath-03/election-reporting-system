"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight, MapPin } from "lucide-react";
import { Assignment } from "@/types";
import { Badge } from "../ui/badge";
import { useState } from "react";
import Link from "next/link";

interface InformerCountingCenterCardProps {
  center: Assignment;
}

export default function InformerCountingCenterCard({
  center,
}: InformerCountingCenterCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card className="transition-all min-h-60 duration-200 hover:shadow-lg">
      <CardHeader>
        <CardTitle className="transition-colors">{center.name}</CardTitle>
        <CardDescription className="flex items-center gap-1.5 mt-1.5">
          <MapPin className="h-3.5 w-3.5" />
          {center.location_address || "No location specified"}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="text-sm font-medium text-muted-foreground w-full flex items-center justify-between">
          <span className="text-foreground flex items-center gap-1 flex-wrap">
            {center.constituency.map((c) => (
              <Badge key={c.id} variant="secondary">
                {c.name}
              </Badge>
            ))}
          </span>
        </div>

        {isExpanded && (
          <div className="mt-4 pt-4 border-t animate-in fade-in slide-in-from-top-2 duration-200">
            <p className="text-xs font-medium text-muted-foreground mb-2 px-1">
              Select Constituency to Update:
            </p>
            <div className="grid gap-2">
              {center.constituency.map((c) => (
                <Link
                  key={c.id}
                  href={`/election-update/${c.name}`}
                  className="block w-full"
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-between hover:bg-primary/5 hover:text-primary transition-colors"
                  >
                    <span>{c.name}</span>
                    <ChevronRight className="h-4 w-4 opacity-50" />
                  </Button>
                </Link>
              ))}
            </div>
          </div>
        )}
      </CardContent>

      <div className="px-6 mt-auto">
        <Button
          size="sm"
          variant={isExpanded ? "secondary" : "outline"}
          className="w-full"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? "Close" : "Update Counts"}
          <ChevronDown
            className={`ml-2 h-4 w-4 transition-transform duration-200 ${
              isExpanded ? "rotate-180" : ""
            }`}
          />
        </Button>
      </div>
    </Card>
  );
}
