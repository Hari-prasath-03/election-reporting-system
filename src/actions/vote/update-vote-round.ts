"use server";

import createClient from "@/lib/supabase/server";
import { getUser } from "@/services/self-user-service";
import { revalidatePath } from "next/cache";

export async function updateVoteRound(roundId: number, votesCount: number) {
  try {
    const sb = await createClient();

    const userId = (await getUser())?.id;
    if (!userId) return { success: false, error: "Unauthorized access" };

    const { error } = await sb
      .from("vote_rounds")
      .update({
        votes_count: votesCount,
        updated_at: new Date().toISOString(),
        updated_by: userId,
      })
      .eq("id", roundId);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath(`/election-update`);
    return { success: true, message: "Vote round updated successfully" };
  } catch (error) {
    console.error("Unexpected error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}
