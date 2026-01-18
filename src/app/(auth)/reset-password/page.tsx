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
import resetPasswordAction from "@/actions/auth/reset-password-action";
import LoadingSpinner from "@/assets/icons/loading-spinner";
import { ResetPasswordState } from "@/types";

export default function ResetPasswordPage() {
  const [state, formAction, isPending] = useActionState<
    ResetPasswordState | null,
    FormData
  >(resetPasswordAction, null);

  return (
    <Card className="shadow-2xl border-border/50 backdrop-blur-sm bg-card/95 w-full max-w-md">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-3xl font-bold tracking-tight">
          Reset Password
        </CardTitle>
        <CardDescription className="text-base">
          Enter your new password below.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {state?.message && !state.success && (
          <div className="mb-4 p-3 rounded-lg bg-destructive/10 border-destructive/20 text-destructive text-sm">
            {state.message}
          </div>
        )}

        <form action={formAction} className="space-y-4">
          <FormInput
            label="New Password"
            name="password"
            type="password"
            placeholder="••••••••"
            disabled={isPending}
            error={state?.errors?.password}
            className="h-11 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
          />

          <FormInput
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            placeholder="••••••••"
            disabled={isPending}
            error={state?.errors?.confirmPassword}
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
                Resetting...
              </span>
            ) : (
              "Reset Password"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
