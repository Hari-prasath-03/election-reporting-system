"use server";

import { redirect } from "next/navigation";
import createClient from "@/lib/supabase/server";

import { loginSchema } from "@/types/validation-schema";
import { LoginState } from "@/types";

export default async function loginAction(
  prevState: LoginState | null,
  formData: FormData,
): Promise<LoginState> {
  const email = formData.get("email");
  const password = formData.get("password");
  const validationResult = loginSchema.safeParse({
    email,
    password,
  });

  if (!validationResult.success) {
    return {
      success: false,
      errors: validationResult.error.flatten().fieldErrors,
    };
  }

  const sb = await createClient();
  const res = await sb.auth.signInWithPassword({
    email: validationResult.data.email,
    password: validationResult.data.password,
  });

  if (res.error) {
    const error = res.error;
    return {
      success: false,
      message:
        error.message === "Invalid login credentials"
          ? "Invalid email or password. Please try again."
          : error.message,
    };
  }

  redirect("/");
}
