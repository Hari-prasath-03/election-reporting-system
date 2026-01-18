"use server";

import createClient from "@/lib/supabase/server";
import { countingCenterSchema } from "@/types/validation-schema";
import { revalidatePath } from "next/cache";
import { CountingCenterFormState } from "@/types";

export default async function createCountingCenterAction(
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

  const { data: centerData, error: centerError } = await supabase
    .from("counting_centers")
    .insert({
      name,
      location_address,
    })
    .select()
    .single();

  if (centerError) {
    return {
      success: false,
      message: centerError.message || "Failed to create counting center",
    };
  }

  const constituencyIds = formData
    .getAll("constituency_ids")
    .map((id) => parseInt(id as string));

  if (constituencyIds.length > 0) {
    const { error: updateError } = await supabase
      .from("constituencies")
      .update({ counting_center_id: centerData.id })
      .in("id", constituencyIds);

    if (updateError) {
      console.error("Error assigning constituencies:", updateError);
    }
  }

  revalidatePath("/dashboard/counting-centers");
  return { success: true, message: "Counting center created successfully" };
}
