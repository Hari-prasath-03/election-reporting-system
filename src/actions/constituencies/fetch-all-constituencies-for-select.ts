"use server";

import createClient from "@/lib/supabase/server";

export default async function fetchAllConstituenciesForSelectAction() {
  const supabase = await createClient();

  const { data, error } = await supabase.from("constituencies").select(
    `
      id,
      name,
      district_id (name),
      counting_center_id,
      counting_centers (name)
    `,
  );

  if (error) {
    console.error("Error fetching constituencies:", error);
    return { data: [], success: false };
  }

  return {
    data: data.map((item: any) => ({
      id: item.id,
      name: item.name,
      district: Array.isArray(item.district_id)
        ? item.district_id[0]?.name
        : item.district_id?.name,
      counting_center_id: item.counting_center_id,
      counting_center_name: Array.isArray(item.counting_centers)
        ? item.counting_centers[0]?.name
        : item.counting_centers?.name,
    })),
    success: true,
  };
}
