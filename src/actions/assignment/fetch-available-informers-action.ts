"use server";

import createClient from "@/lib/supabase/server";

export type AvailableInformer = {
  id: string;
  display_name: string;
  email: string;
};

export default async function fetchAvailableInformersAction(
  countingCenterId?: number,
) {
  const supabase = await createClient();

  let assignedProfileIds: string[] = [];

  if (countingCenterId) {
    const { data: assignedIdsData, error: assignedError } = await supabase
      .from("assignments")
      .select("profile_id")
      .eq("counting_center_id", countingCenterId);

    if (assignedError) {
      console.error("Error fetching assigned profiles:", assignedError);
      return { success: false, data: [] };
    }
    assignedProfileIds = assignedIdsData.map((a) => a.profile_id);
  }

  let query = supabase
    .from("profiles")
    .select("id, display_name, email")
    .eq("role", "informer")
    .order("display_name", { ascending: true });

  if (assignedProfileIds.length > 0) {
    query = query.not("id", "in", `(${assignedProfileIds.join(",")})`);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching available informers:", error);
    return { success: false, data: [] };
  }

  return { success: true, data: data as AvailableInformer[] };
}
