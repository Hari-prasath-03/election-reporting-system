"use server";

import createClient from "@/lib/supabase/server";

export type AssignmentData = {
  id: number;
  profile_id: string;
  assigned_at: string;
  profile: {
    display_name: string;
    email: string;
    role: string;
  };
};

export default async function fetchCenterAssignmentsAction(
  countingCenterId: number,
) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("assignments")
    .select(
      `
      id,
      profile_id,
      assigned_at,
      profile:profiles (
        display_name,
        email,
        role
      )
    `,
    )
    .eq("counting_center_id", countingCenterId);

  if (error) {
    console.error("Error fetching assignments:", error);
    return { success: false, data: [] };
  }

  const formattedData: AssignmentData[] = data.map((item: any) => ({
    id: item.id,
    profile_id: item.profile_id,
    assigned_at: item.assigned_at,
    profile: Array.isArray(item.profile) ? item.profile[0] : item.profile,
  }));

  return { success: true, data: formattedData };
}
