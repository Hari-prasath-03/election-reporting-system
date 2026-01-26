"use server";

import createClient from "@/lib/supabase/server";
import { getUser } from "@/services/self-user-service";
import { revalidatePath } from "next/cache";

export async function addVoteRound(
  candidateId: number,
  roundNo: number,
  votesCount: number,
) {
  try {
    const sb = await createClient();

    const userId = (await getUser())?.id;
    if (!userId) return { success: false, error: "Unauthorized access" };

    const { data: existing, error: fetchError } = await sb
      .from("vote_rounds")
      .select("id")
      .eq("candidate_id", candidateId)
      .eq("round_no", roundNo)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      return { success: false, error: fetchError.message };
    }

    if (existing) {
      return { success: false, error: "This round number already exists." };
    }

    const { error } = await sb.from("vote_rounds").insert({
      candidate_id: candidateId,
      round_no: roundNo,
      votes_count: votesCount,
      updated_by: userId,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath(`/election-update`);
    return { success: true, message: "Vote round added successfully" };
  } catch (error) {
    console.error("Unexpected error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}
