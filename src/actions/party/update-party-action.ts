"use server";

import createClient from "@/lib/supabase/server";
import { partySchema } from "@/types/validation-schema";
import { revalidatePath } from "next/cache";
import { PartyFormState, Party } from "@/types";
import { processImageUpload } from "@/lib/image-handler";

export default async function updatePartyAction(
  id: number,
  oldSymbolUrl: string | undefined,
  prevState: PartyFormState,
  formData: FormData
): Promise<PartyFormState> {
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

  const { name, short_name, color_code } = validatedFields.data;
  const image = validatedFields.data.symbol_img;

  const symbol_url = await processImageUpload(
    image,
    "parties",
    oldSymbolUrl
  );

  const updateData: Partial<Party> & { symbol_url?: string } = {
    name,
    short_name,
    color_code,
  };

  if (symbol_url) updateData.symbol_url = symbol_url;

  const { error } = await supabase
    .from("parties")
    .update(updateData)
    .eq("id", id);

  if (error)
    return {
      success: false,
      message: error.message || "Failed to update party",
    };

  revalidatePath("/dashboard/manage-parties");
  return { success: true, message: "Party updated successfully" };
}
