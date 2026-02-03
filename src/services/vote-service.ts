import createClient from "@/lib/supabase/server";

export async function getVoteRounds(candidateId: number) {
  try {
    const sb = await createClient();

    const { data, error } = await sb
      .from("vote_rounds")
      .select("*")
      .eq("candidate_id", candidateId)
      .order("round_no", { ascending: true });

    if (error) {
      console.error("Error fetching vote rounds:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data };
  } catch (error) {
    console.error("Unexpected error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

export async function getUserSubmissions(userId: string) {
  try {
    const sb = await createClient();

    const { data, error } = await sb
      .from("vote_rounds")
      .select(
        `
        *,
        candidates (
          name,
          parties (
            symbol_url,
            short_name,
            color_code
          ),
          constituencies (
            name
          )
        )
      `,
      )
      .eq("updated_by", userId)
      .order("updated_at", { ascending: false });

    if (error) {
      console.error("Error fetching user submissions:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data };
  } catch (error) {
    console.error("Unexpected error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

export async function getConstituencyRoundHistory(constituencyName: string) {
  try {
    const sb = await createClient();
    const decodedName = decodeURIComponent(constituencyName);

    const { data: candidates, error: candidateError } = await sb
      .from("candidates")
      .select("id, constituency_id, constituencies!inner(name)")
      .eq("constituencies.name", decodedName);

    if (candidateError) throw candidateError;
    if (!candidates || candidates.length === 0)
      return { success: true, data: [] };

    const candidateIds = candidates.map((c) => c.id);

    const { data: rounds, error: roundsError } = await sb
      .from("vote_rounds")
      .select("candidate_id, round_no")
      .in("candidate_id", candidateIds);

    if (roundsError) throw roundsError;

    return { success: true, data: rounds || [] };
  } catch (error) {
    console.error("Error fetching constituency round history:", error);
    return { success: false, error: "Failed to fetch round history" };
  }
}
