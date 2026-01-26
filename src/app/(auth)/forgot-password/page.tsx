"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/ui/form-input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import LoadingSpinner from "@/assets/icons/loading-spinner";
import { ForgotPasswordState } from "@/types";
import requestPasswordResetAction from "@/actions/auth/request-password-reset-action";

export default function ForgotPasswordPage() {
  const [state, formAction, isPending] = useActionState<
    ForgotPasswordState | null,
    FormData
  >(requestPasswordResetAction, null);

  return (
    <Card className="shadow-2xl border-border/50 backdrop-blur-sm bg-card/95 w-full max-w-md">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-3xl font-bold tracking-tight">
          Forgot Password
        </CardTitle>
        <CardDescription className="text-base">
          Enter your email address to receive a reset link
        </CardDescription>
      </CardHeader>
      <CardContent>
        {state?.message && (
          <div
            className={`mb-4 p-3 rounded-lg text-sm border ${
              state.success
                ? "bg-green-500/10 border-green-500/20 text-green-600"
                : "bg-destructive/10 border-destructive/20 text-destructive"
            }`}
          >
            {state.message}
          </div>
        )}

        <form action={formAction} className="space-y-4">
          <FormInput
            label="Email"
            name="email"
            type="email"
            placeholder="name@example.com"
            disabled={isPending}
            error={state?.errors?.email}
            className="h-11 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
          />

          <Button
            type="submit"
            disabled={isPending}
            className="w-full h-11 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? (
              <span className="flex items-center gap-2">
                <LoadingSpinner />
                Sending Link...
              </span>
            ) : (
              "Send Reset Link"
            )}
          </Button>

          <div className="text-center mt-4">
            <Link
              href="/login"
              className="text-sm text-primary hover:underline hover:text-primary/80 transition-colors"
            >
              Back to Login
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
