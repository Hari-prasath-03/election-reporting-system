"use server";

import createClient from "@/lib/supabase/server";
import { getUserClaims } from "@/services/self-user-service";
import { revalidatePath } from "next/cache";

export async function deleteVoteRound(roundId: number) {
  try {
    const sb = await createClient();

    const userId = (await getUserClaims())?.id;
    if (!userId) return { success: false, error: "Unauthorized access" };

    const { data: round, error: fetchError } = await sb
      .from("vote_rounds")
      .select("updated_by, candidate_id")
      .eq("id", roundId)
      .single();

    if (fetchError || !round) {
      return { success: false, error: "Round not found" };
    }

    if (round.updated_by !== userId) {
      return {
        success: false,
        error: "You can only delete rounds that you added.",
      };
    }

    const { error: deleteError } = await sb
      .from("vote_rounds")
      .delete()
      .eq("id", roundId);

    if (deleteError) {
      return { success: false, error: deleteError.message };
    }

    revalidatePath(`/election-update`);
    return { success: true, message: "Round deleted successfully" };
  } catch (error) {
    console.error("Unexpected error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}
