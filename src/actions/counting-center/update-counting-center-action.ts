"use server";

import createClient from "@/lib/supabase/server";
import { countingCenterSchema } from "@/types/validation-schema";
import { revalidatePath } from "next/cache";
import { CountingCenterFormState } from "@/types";

export default async function updateCountingCenterAction(
  id: number,
  prevState: CountingCenterFormState,
  formData: FormData,
): Promise<CountingCenterFormState> {
  const supabase = await createClient();

  const validatedFields = countingCenterSchema.safeParse({
    name: formData.get("name"),
    location_address: formData.get("location_address"),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Validation failed",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { name, location_address } = validatedFields.data;

  const { error: updateError } = await supabase
    .from("counting_centers")
    .update({
      name,
      location_address,
    })
    .eq("id", id);

  if (updateError) {
    return {
      success: false,
      message: updateError.message || "Failed to update counting center",
    };
  }

  const constituencyIds = formData
    .getAll("constituency_ids")
    .map((id) => parseInt(id as string));

  const { error: clearError } = await supabase
    .from("constituencies")
    .update({ counting_center_id: null })
    .eq("counting_center_id", id);

  if (clearError) {
    console.error("Error clearing old assignments:", clearError);
    return { success: false, message: "Failed to update assignments" };
  }

  if (constituencyIds.length > 0) {
    const { error: assignError } = await supabase
      .from("constituencies")
      .update({ counting_center_id: id })
      .in("id", constituencyIds);

    if (assignError) {
      console.error("Error assigning constituencies:", assignError);
      return { success: false, message: "Failed to update assignments" };
    }
  }

  revalidatePath("/dashboard/counting-centers");
  return { success: true, message: "Counting center updated successfully" };
}
