"use server";

import createClient from "@/lib/supabase/server";

export async function fetchCandidatesByConstituency(constituencyName: string) {
  try {
    const sb = await createClient();

    const decodedName = decodeURIComponent(constituencyName);

    const { data, error } = await sb
      .from("candidates")
      .select(
        `
      *,
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
    `
      )
      .ilike("constituencies.name", decodedName);

    if (error) {
      console.error("Error fetching candidates by constituency:", error);
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
    console.error("Unexpected error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}
