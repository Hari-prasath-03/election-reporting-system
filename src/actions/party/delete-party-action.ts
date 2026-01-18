"use server";

import createClient from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import deleteImage, { extractPublicId } from "@/lib/cloudinary/delete-image";

export default async function deletePartyAction(id: number, symbolUrl: string | null) {
  const supabase = await createClient();

  if (symbolUrl) {
    const publicId = extractPublicId(symbolUrl);
    if (publicId) await deleteImage(publicId);
  }

  const { error } = await supabase.from("parties").delete().eq("id", id);

  if (error)
    return {
      success: false,
      message: error.message || "Failed to delete party",
    };

  revalidatePath("/dashboard/manage-parties");
  return { success: true, message: "Party deleted successfully" };
}
