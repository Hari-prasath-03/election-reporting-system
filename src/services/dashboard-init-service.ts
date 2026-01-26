import createClient from "@/lib/supabase/server";

export async function getUsersCount() {
  const sb = await createClient();
  const { count, error } = await sb
    .from("profiles")
    .select("*", { count: "estimated", head: true });
  if (error) return 0;
  return count;
}

export async function getPartiesCount() {
  const sb = await createClient();
  const { count, error } = await sb
    .from("parties")
    .select("*", { count: "estimated", head: true });
  if (error) return 0;
  return count && count - 1;
}

export async function getCandidatesCount() {
  const sb = await createClient();
  const { count, error } = await sb
    .from("candidates")
    .select("*", { count: "estimated", head: true });
  if (error) return 0;
  return count;
}

export async function getConstituenciesCount() {
  const sb = await createClient();
  const { count, error } = await sb
    .from("constituencies")
    .select("*", { count: "estimated", head: true });
  if (error) return 0;
  return count;
}
