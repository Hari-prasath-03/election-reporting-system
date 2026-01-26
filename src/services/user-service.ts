import createClient from "@/lib/supabase/server";
import { User } from "@/types";
import QueryBuilder from "@/lib/query-builder";

export interface GetUsersParams {
  page?: number;
  limit?: number;
  query?: string;
  role?: string;
}

export interface GetUsersResult {
  success: boolean;
  data: User[];
  total: number;
}

export async function getUsers({
  page = 1,
  limit = 20,
  query = "",
  role = "all",
}: GetUsersParams): Promise<GetUsersResult> {
  const sb = await createClient();

  const queryBuilder = new QueryBuilder<User>(
    sb.from("profiles").select("*", { count: "exact" }),
  );

  const { data, count, success } = await queryBuilder
    .search(["display_name", "email"], query)
    .filter(role !== "all", "role", role)
    .paginate(page, limit)
    .sort("created_at")
    .build();

  return {
    success,
    data: data || [],
    total: count || 0,
  };
}
