"use server";

import createAdminClient from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export default async function deleteUserAction(id: string): Promise<{
  success: boolean;
  message: string;
}> {
  const supabase = createAdminClient();
  const res = await supabase.auth.admin.deleteUser(id);

  if (res.error) {
    const error = res.error;
    return {
      success: false,
      message: error.message || "Failed to delete user",
    };
  }

  revalidatePath("/dashboard/manage-users");
  return {
    success: true,
    message: "User deleted successfully",
  };
}
