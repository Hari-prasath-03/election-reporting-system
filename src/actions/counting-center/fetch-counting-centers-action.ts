"use server";

import createClient from "@/lib/supabase/server";

export default async function fetchCountingCentersAction() {
  const supabase = await createClient();

  const { data, error } = await supabase.from("counting_centers").select(
    `
      *,
      constituencies (
        id,
        name,
        district_id (name)
      )
    `,
  );

  if (error) {
    console.error("Error fetching counting centers:", error);
    return { data: [], success: false };
  }

  return { data, success: true };
}
