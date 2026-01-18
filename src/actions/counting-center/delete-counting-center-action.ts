"use server";

import createClient from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export default async function deleteCountingCenterAction(id: number) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("counting_centers")
    .delete()
    .eq("id", id);

  if (error) {
    return {
      success: false,
      message: error.message || "Failed to delete counting center",
    };
  }

  revalidatePath("/dashboard/counting-centers");
  return { success: true, message: "Counting center deleted successfully" };
}
