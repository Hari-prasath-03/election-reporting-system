"use server";

import createAdminClient from "@/lib/supabase/admin";

import { UserFormState } from "@/types";
import { createUserSchema } from "@/types/validation-schema";
import { revalidatePath } from "next/cache";
import hasPermission from "@/permissions";
import { getUserClaims } from "@/services/self-user-service";

export default async function createUserAction(
  prevState: UserFormState,
  formData: FormData,
): Promise<UserFormState> {
  const user = await getUserClaims();
  if (!user || !hasPermission(user, "access:dashboard")) {
    return {
      success: false,
      message: "Unauthorized access",
    };
  }
  const supabase = createAdminClient();

  const validatedFields = createUserSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    display_name: formData.get("display_name"),
    role: formData.get("role"),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Validation failed",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email, password, display_name, role } = validatedFields.data;

  const res = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      display_name,
      role,
    },
  });

  if (res.error) {
    const error = res.error;
    return {
      success: false,
      message: error.message || "Failed to create user",
    };
  }

  revalidatePath("/dashboard/manage-users");
  return {
    success: true,
    message: "User created successfully",
  };
}
