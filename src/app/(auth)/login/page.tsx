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

import loginAction from "@/actions/auth/login-action";
import LoadingSpinner from "@/assets/icons/loading-spinner";
import { LoginState } from "@/types";

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState<
    LoginState | null,
    FormData
  >(loginAction, null);

  return (
    <Card className="shadow-2xl border-border/50 backdrop-blur-sm bg-card/95">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-3xl font-bold tracking-tight">
          Official Access
        </CardTitle>
        <CardDescription className="text-base">
          Authenticate with your credentials to access the system
        </CardDescription>
      </CardHeader>
      <CardContent>
        {state?.message && !state.success && (
          <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
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

          <FormInput
            label="Password"
            name="password"
            type="password"
            placeholder="••••••••"
            disabled={isPending}
            error={state?.errors?.password}
            className="h-11 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
          />
          <div className="flex justify-end">
            <Link
              href="/forgot-password"
              className="text-sm font-medium text-primary hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <Button
            type="submit"
            disabled={isPending}
            className="w-full h-11 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? (
              <span className="flex items-center gap-2">
                <LoadingSpinner />
                Signing in...
              </span>
            ) : (
              "Login"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
