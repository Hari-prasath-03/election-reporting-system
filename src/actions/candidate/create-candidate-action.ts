"use server";

import createClient from "@/lib/supabase/server";
import { candidateSchema } from "@/types/validation-schema";
import { revalidatePath } from "next/cache";
import { CandidateFormState } from "@/types";
import { processImageUpload } from "@/lib/image-handler";

export default async function createCandidateAction(
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

  if (!validatedFields.success)
    return {
      success: false,
      message: "Validation failed",
      errors: validatedFields.error.flatten().fieldErrors,
    };

  const image = validatedFields.data.photo_img;
  const photo_url = await processImageUpload(image, "candidates");

  const { name, party_id, constituency_id, gender } = validatedFields.data;
  const { error } = await supabase.from("candidates").insert({
    name,
    party_id: parseInt(party_id),
    constituency_id: parseInt(constituency_id),
    gender,
    photo_url,
  });

  if (error)
    return {
      success: false,
      message: error.message || "Failed to create candidate",
    };

  revalidatePath("/dashboard/manage-candidates");
  return { success: true, message: "Candidate created successfully" };
}
