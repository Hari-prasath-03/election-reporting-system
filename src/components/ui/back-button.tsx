"use client";

import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useCallback } from "react";

interface BackButtonProps {
  sliceLastToGetBack?: boolean;
}

export default function BackButton({ sliceLastToGetBack }: BackButtonProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleGoBack = useCallback(() => {
    if (sliceLastToGetBack) {
      const newPath = pathname.split("/").slice(0, -1).join("/");
      router.push(newPath || "/");
    } else router.back();
  }, [sliceLastToGetBack, router, pathname]);

  return (
    <Button
      variant="ghost"
      className="gap-1 pl-0 text-muted-foreground hover:text-foreground hover:bg-transparent"
      onClick={handleGoBack}
    >
      <ChevronLeft className="h-4 w-4" />
      Back
    </Button>
  );
}
