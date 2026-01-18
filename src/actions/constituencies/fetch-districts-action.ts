"use server";

import createClient from "@/lib/supabase/server";

export default async function fetchDistrictsAction() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("districts")
    .select("name")
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching districts:", error);
    return [];
  }

  return data.map((d) => d.name);
}
