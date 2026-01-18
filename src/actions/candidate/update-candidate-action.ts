"use server";

import createClient from "@/lib/supabase/server";
import { candidateSchema } from "@/types/validation-schema";
import { revalidatePath } from "next/cache";
import { Candidate, CandidateFormState } from "@/types";
import { processImageUpload } from "@/lib/image-handler";

export default async function updateCandidateAction(
  id: number,
  prevState: CandidateFormState,
  formData: FormData
): Promise<CandidateFormState> {
  const supabase = await createClient();

  const validatedFields = candidateSchema.safeParse({
    name: formData.get("name"),
    party_id: formData.get("party_id"),
    constituency_id: formData.get("constituency_id"),
    gender: formData.get("gender"),
    photo_img: formData.get("photo_img"),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Validation failed",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { name, party_id, constituency_id, gender, photo_img } =
    validatedFields.data;

  const old_photo_url = formData.get("old_photo_url") as string;

  const photo_url = await processImageUpload(
    photo_img,
    "candidates",
    old_photo_url
  );

  if (photo_img && photo_img.size > 0 && !photo_url) {
    return {
      success: false,
      message: "Failed to upload image",
    };
  }

  const updateData: Partial<Candidate> = {
    name,
    party_id: parseInt(party_id),
    constituency_id: parseInt(constituency_id),
    gender,
  };

  if (photo_url) updateData.photo_url = photo_url;

  const { error } = await supabase
    .from("candidates")
    .update(updateData)
    .eq("id", id);

  if (error) {
    console.error("Database Update Error:", error);
    return {
      success: false,
      message: error.message || "Failed to update candidate",
    };
  }

  revalidatePath("/dashboard/manage-candidates");
  return { success: true, message: "Candidate updated successfully" };
}
