import createClient from "@/lib/supabase/server";

export async function getCountingCenters() {
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

export async function getCountingCentersWithAssignments() {
  const supabase = await createClient();

  const { data, error } = await supabase.from("counting_centers").select(
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
  );

  if (error) {
    console.error("Error fetching counting centers with assignments:", error);
    return { data: [], success: false };
  }

  return { data, success: true };
}
