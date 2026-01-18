"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import LoadingSpinner from "@/assets/icons/loading-spinner";

function AuthErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  return (
    <Card className="shadow-2xl border-border/50 backdrop-blur-sm bg-card/95 w-full max-w-md">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-3xl font-bold tracking-tight text-destructive">
          Authentication Error
        </CardTitle>
        <CardDescription className="text-base">
          We encountered a problem while trying to authenticate you.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium text-center">
          {error || "An unknown error occurred"}
        </div>

        <div className="flex justify-center">
          <Link href="/login">
            <Button className="w-full min-w-50">Back to Login</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center p-8">
          <LoadingSpinner />
        </div>
      }
    >
      <AuthErrorContent />
    </Suspense>
  );
}
