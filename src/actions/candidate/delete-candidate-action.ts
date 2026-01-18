"use server";

import createClient from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

import deleteImage, { extractPublicId } from "@/lib/cloudinary/delete-image";

export default async function deleteCandidateAction(
  id: number,
  photoUrl?: string
) {
  const supabase = await createClient();

  try {
    const { error } = await supabase.from("candidates").delete().eq("id", id);
    if (error) {
      console.error("Error deleting candidate:", error);
      return {
        success: false,
        message: error.message || "Failed to delete candidate",
      };
    }

    if (photoUrl) {
      const publicId = extractPublicId(photoUrl);
      if (publicId) await deleteImage(publicId);
    }

    revalidatePath("/dashboard/manage-candidates");
    return { success: true, message: "Candidate deleted successfully" };
  } catch (error) {
    console.error("Unexpected error deleting candidate:", error);
    return {
      success: false,
      message: "An unexpected error occurred",
    };
  }
}
