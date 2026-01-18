"use server";

import createClient from "@/lib/supabase/server";
import QueryBuilder from "@/lib/query-builder";

export type FetchPartiesParams = {
  query?: string;
  page?: number;
  limit?: number;
  excludeIndependent?: boolean;
};

export default async function fetchPartiesAction({
  query = "",
  page = 1,
  limit = 20,
  excludeIndependent = false,
}: FetchPartiesParams) {
  const supabase = await createClient();

  const baseQuery = supabase.from("parties").select("*", { count: "exact" });

  const { data, count, error, success } = await new QueryBuilder(baseQuery)
    .filter(excludeIndependent, "short_name", "IND", "neq")
    .search(["name", "short_name"], query)
    .sort("id", true)
    .paginate(page, limit)
    .build();

  if (!success || error) {
    console.error("Error fetching parties:", error);
    return { data: [], total: 0, success: false };
  }

  return { data, total: count || 0, success: true };
}
