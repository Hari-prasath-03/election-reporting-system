"use server";

import createClient from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export default async function unassignInformerAction(assignmentId: number) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("assignments")
    .delete()
    .eq("id", assignmentId);

  if (error) {
    return { success: false, message: error.message };
  }

  revalidatePath("/dashboard/counting-centers");
  return { success: true, message: "Unassigned successfully" };
}
