"use server";

import createClient from "@/lib/supabase/server";
import { getUserClaims } from "@/services/self-user-service";
import { revalidatePath } from "next/cache";

type CandidateVote = {
  candidateId: number;
  voteCount: number;
};

export async function addMassVoteRounds(
  roundNo: number,
  updates: CandidateVote[],
  constituencyName: string,
) {
  try {
    const sb = await createClient();

    const user = await getUserClaims();
    if (!user) return { success: false, error: "Unauthorized access" };

    if (!updates.length) {
      return { success: false, error: "No candidates selected" };
    }

    const dataToInsert = updates.map((update) => ({
      candidate_id: update.candidateId,
      round_no: roundNo,
      votes_count: update.voteCount,
      updated_by: user.id,
      updated_at: new Date().toISOString(),
    }));

    const { error } = await sb.from("vote_rounds").insert(dataToInsert);

    if (error) {
      if (error.code === "23505") {
        return {
          success: false,
          error: "Some candidates already have this round number.",
        };
      }
      return { success: false, error: error.message };
    }

    revalidatePath(`/election-update/${constituencyName}`);
    revalidatePath(`/election-update/my-submissions`);

    return { success: true, message: "Vote rounds updated successfully" };
  } catch (error) {
    console.error("Unexpected error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}
