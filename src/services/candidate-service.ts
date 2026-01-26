import createClient from "@/lib/supabase/server";
import QueryBuilder from "@/lib/query-builder";

export type GetCandidatesParams = {
  page?: number;
  limit?: number;
  query?: string;
  constituency?: string;
  party?: string;
};

export async function getCandidates({
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
      { count: "exact" },
    );

    const { data, count, error, success } = await new QueryBuilder(baseQuery)
      .filter(!!query, "name", `%${query}%`, "ilike")
      .filter(
        constituency !== "all" && !!constituency,
        "constituency_id",
        constituency,
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
    console.error("Error in getCandidates:", error);
    return {
      success: false,
      message: "Failed to fetch candidates",
      data: [],
      total: 0,
    };
  }
}

export async function getCandidatesByConstituency(constituencyName: string) {
  try {
    const sb = await createClient();
    const decodedName = decodeURIComponent(constituencyName);

    const { data, error } = await sb
      .from("candidates")
      .select(
        `
      id,
      name,
      constituency_id,
      party_id,
      parties (
        id,
        name,
        short_name,
        symbol_url,
        color_code
      ),
      constituencies!inner (
        id,
        name
      )
    `,
      )
      .eq("constituencies.name", decodedName);

    if (error) {
      return { success: false, error: error.message };
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
    return { success: true, data: candidates };
  } catch (error) {
    console.error(error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

export async function getCandidateDetails(candidateId: number) {
  try {
    const sb = await createClient();

    const { data, error } = await sb
      .from("candidates")
      .select(
        `
        id,
        name,
        constituency_id,
        party_id,
        photo_url,
        parties (
          id,
          name,
          short_name,
          symbol_url,
          color_code
        ),
        constituencies!inner (
          id,
          name
        )
      `,
      )
      .eq("id", candidateId)
      .single();

    if (error) {
      console.error("Error fetching candidate details:", error);
      return { success: false, error: error.message };
    }

    const candidate = {
      ...data,
      parties: Array.isArray(data.parties) ? data.parties[0] : data.parties,
      constituencies: Array.isArray(data.constituencies)
        ? data.constituencies[0]
        : data.constituencies,
    };

    return { success: true, data: candidate };
  } catch (error) {
    console.error("Unexpected error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}
