"use server";

import createClient from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export default async function assignInformerAction(
  countingCenterId: number,
  profileId: string,
) {
  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("assignments")
    .select("id")
    .eq("profile_id", profileId)
    .eq("counting_center_id", countingCenterId)
    .single();

  if (existing) {
    return {
      success: false,
      message: "User is already assigned to this center.",
    };
  }

  const { error } = await supabase.from("assignments").insert({
    counting_center_id: countingCenterId,
    profile_id: profileId,
  });

  if (error) {
    return { success: false, message: error.message };
  }

  revalidatePath("/dashboard/counting-centers");
  return { success: true, message: "Informer assigned successfully" };
}
