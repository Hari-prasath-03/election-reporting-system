"use server";

import createClient from "@/lib/supabase/server";

import { partySchema } from "@/types/validation-schema";
import { revalidatePath } from "next/cache";
import { PartyFormState } from "@/types";
import { processImageUpload } from "@/lib/image-handler";
import hasPermission from "@/permissions";
import { getUserClaims } from "@/services/self-user-service";

export default async function createPartyAction(
  prevState: PartyFormState,
  formData: FormData,
): Promise<PartyFormState> {
  const user = await getUserClaims();
  if (!user || !hasPermission(user, "access:dashboard")) {
    return {
      success: false,
      message: "Unauthorized access",
    };
  }
  const supabase = await createClient();

  const validatedFields = partySchema.safeParse({
    name: formData.get("name"),
    short_name: formData.get("short_name"),
    symbol_img: formData.get("symbol_img"),
    color_code: formData.get("color_code"),
  });

  if (!validatedFields.success)
    return {
      success: false,
      message: "Validation failed",
      errors: validatedFields.error.flatten().fieldErrors,
    };

  const symbol_url = await processImageUpload(
    validatedFields.data.symbol_img,
    "parties",
  );

  const { name, short_name, color_code } = validatedFields.data;
  const { error } = await supabase.from("parties").insert({
    name,
    short_name,
    symbol_url,
    color_code,
  });

  if (error)
    return {
      success: false,
      message: error.message || "Failed to create party",
    };

  revalidatePath("/dashboard/manage-parties");
  return { success: true, message: "Party created successfully" };
}
