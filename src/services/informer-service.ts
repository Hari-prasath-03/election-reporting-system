import createClient from "@/lib/supabase/server";
import { Assignment } from "@/types";
import { getUser } from "@/services/self-user-service";

export async function getAssignedCenters(): Promise<{
  success: boolean;
  data: Assignment[];
  error?: string;
}> {
  const user = await getUser();
  if (!user)
    return { success: false, data: [], error: "User not authenticated" };

  const sb = await createClient();

  const { data: assignments, error } = await sb
    .from("assignments")
    .select(
      `
      counting_center:counting_centers (
          id,
          name,
          location_address,
          constituencies (
            id,
            name
          )
      )
    `,
    )
    .eq("profile_id", user.id);

  if (error || !assignments) {
    console.error("Error fetching assigned centers:", error);
    return { success: false, data: [] };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data: Assignment[] = assignments.map((d: any) => ({
    id: d.counting_center.id,
    name: d.counting_center.name,
    location_address: d.counting_center.location_address,
    constituency: d.counting_center.constituencies,
  }));

  return { success: true, data };
}
