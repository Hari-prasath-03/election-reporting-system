"use server";

import createClient from "@/lib/supabase/server";

export default async function fetchCountingCentersWithAssignmentsAction() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("counting_centers")
    .select(
      `
      *,
      assignments (
        id,
        profile:profiles (
          display_name,
          email
        )
      )
    `,
    )
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching counting centers with assignments:", error);
    return { data: [], success: false };
  }

  return { data, success: true };
}
