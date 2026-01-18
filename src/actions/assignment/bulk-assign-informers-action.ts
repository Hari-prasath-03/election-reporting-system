"use server";

import createClient from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export default async function bulkAssignInformersAction(
  countingCenterId: number,
  profileIds: string[],
) {
  const supabase = await createClient();

  if (!profileIds.length) {
    return { success: false, message: "No users selected for assignment." };
  }

  const { data: existing } = await supabase
    .from("assignments")
    .select("profile_id")
    .eq("counting_center_id", countingCenterId)
    .in("profile_id", profileIds);

  const existingIds = new Set(existing?.map((e) => e.profile_id) || []);
  const newProfileIds = profileIds.filter((id) => !existingIds.has(id));

  if (newProfileIds.length === 0) {
    return {
      success: true,
      message: "All selected users are already assigned to this center.",
    };
  }

  const recordsToInsert = newProfileIds.map((profileId) => ({
    counting_center_id: countingCenterId,
    profile_id: profileId,
  }));

  const { error } = await supabase.from("assignments").insert(recordsToInsert);

  if (error) {
    return { success: false, message: error.message };
  }

  revalidatePath("/dashboard/counting-centers");
  return {
    success: true,
    message: `Successfully assigned ${newProfileIds.length} informer(s).`,
  };
}
