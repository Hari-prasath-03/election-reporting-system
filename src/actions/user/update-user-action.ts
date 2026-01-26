"use server";

import createAdminClient from "@/lib/supabase/admin";

import { UserFormState } from "@/types";
import { updateUserSchema } from "@/types/validation-schema";
import { revalidatePath } from "next/cache";
import hasPermission from "@/permissions";
import { getUserClaims } from "@/services/self-user-service";

export default async function updateUserAction(
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

  const validatedFields = updateUserSchema.safeParse({
    id: formData.get("id"),
    display_name: formData.get("display_name"),
    role: formData.get("role"),
    email: formData.get("email") || undefined,
    password: formData.get("password") || undefined,
  });

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Validation failed",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { id, display_name, role, email, password } = validatedFields.data;

  const res = await supabase.auth.admin.updateUserById(id, {
    user_metadata: {
      display_name,
      role,
    },
    ...(email && { email, email_confirm: true }),
    ...(password && { password }),
  });

  if (res.error) {
    const error = res.error;
    return {
      success: false,
      message: error.message || "Failed to update user",
    };
  }

  revalidatePath("/dashboard/manage-users");
  return {
    success: true,
    message: "User updated successfully",
  };
}
