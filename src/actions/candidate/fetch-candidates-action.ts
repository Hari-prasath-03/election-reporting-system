"use server";

import createClient from "@/lib/supabase/server";
import QueryBuilder from "@/lib/query-builder";

export type GetCandidatesParams = {
  page?: number;
  limit?: number;
  query?: string;
  constituency?: string;
  party?: string;
};

export default async function fetchCandidatesAction({
  page = 1,
  limit = 20,
  query = "",
  constituency = "all",
  party = "all",
}: GetCandidatesParams = {}) {
  try {
    const sb = await createClient();

    const baseQuery = sb.from("candidates").select(
      `
      id,
      name,
      party_id,
      constituency_id,
      photo_url,
      gender,
      parties (
        short_name
      ),
      constituencies (
        name
      )
    `,
      { count: "exact" }
    );

    const { data, count, error, success } = await new QueryBuilder(baseQuery)
      .filter(!!query, "name", `%${query}%`, "ilike")
      .filter(
        constituency !== "all" && !!constituency,
        "constituency_id",
        constituency
      )
      .filter(party !== "all" && !!party, "party_id", party)
      .sort("id", true)
      .paginate(page, limit)
      .build();

    if (!success || error) {
      console.error("Supabase Error:", error);
      return {
        success: false,
        message: "Failed to fetch candidates data",
        data: [],
        total: 0,
      };
    }

    const candidates = data?.map((candidate) => ({
      ...candidate,
      parties: Array.isArray(candidate.parties)
        ? candidate.parties[0]
        : candidate.parties,
      constituencies: Array.isArray(candidate.constituencies)
        ? candidate.constituencies[0]
        : candidate.constituencies,
    }));

    return { success: true, data: candidates, total: count || 0 };
  } catch (error) {
    console.error("Error in fetchCandidatesAction:", error);
    return {
      success: false,
      message: "Failed to fetch candidates",
      data: [],
      total: 0,
    };
  }
}
