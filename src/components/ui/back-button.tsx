"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

export default function BackButton() {
  const router = useRouter();

  return (
    <Button
      variant="ghost"
      className="gap-1 pl-0 text-muted-foreground hover:text-foreground hover:bg-transparent"
      onClick={() => router.back()}
    >
      <ChevronLeft className="h-4 w-4" />
      Back
    </Button>
  );
}
