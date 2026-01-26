import createClient from "@/lib/supabase/server";
import QueryBuilder from "@/lib/query-builder";

export type GetConstituenciesParams = {
  page?: number;
  limit?: number;
  query?: string;
  district?: string;
};

export async function getConstituencies({
  page = 1,
  limit = 20,
  query = "",
  district = "all",
}: GetConstituenciesParams = {}) {
  try {
    const sb = await createClient();

    const baseQuery = sb.from("constituencies").select(
      `
      id,
      name,
      type,
      district_id!inner (name),
      candidates (count)
    `,
      { count: "exact" },
    );

    const { data, count, error, success } = await new QueryBuilder(baseQuery)
      .filter(!!query, "name", `%${query}%`, "ilike")
      .filter(district !== "all" && !!district, "district_id.name", district)
      .sort("id", true)
      .paginate(page, limit)
      .build();

    if (!success || error || !data) {
      return {
        success: false,
        message: "Failed to fetch constituencies data",
        data: [],
        total: 0,
      };
    }

    const flattenedData = data.map((item) => ({
      s_no: item.id,
      id: item.id,
      constituency: item.name,
      type: item.type,
      district: item.district_id?.name,
      candidate_count: item.candidates?.[0]?.count || 0,
    }));

    return { success: true, data: flattenedData, total: count || 0 };
  } catch (error) {
    console.error("Error in getConstituencies:", error);
    return {
      success: false,
      message: "Failed to fetch constituencies",
      data: [],
      total: 0,
    };
  }
}

export async function getDistricts() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("districts")
    .select("name")
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching districts:", error);
    return [];
  }

  return data.map((d) => d.name);
}

export async function getAllConstituenciesForSelect() {
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: data.map((item: any) => ({
      id: item.id,
      name: item.name,
      district: item.district_id?.name,
      counting_center_id: item.counting_center_id,
      counting_center_name: item.counting_centers?.name,
    })),
    success: true,
  };
}
