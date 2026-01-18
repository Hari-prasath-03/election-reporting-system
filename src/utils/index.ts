import createClient from "@/lib/supabase/server";
import { User } from "@/types";

export async function getUser(): Promise<User | undefined> {
  const sb = await createClient();
  const { data, error } = await sb.auth.getUser();
  if (error || !data.user) return undefined;

  return {
    id: data.user.id,
    email: data.user.email,
    display_name: data.user.user_metadata.display_name,
    role: data.user.user_metadata.role,
  } as User;
}

export async function getUserClaims() {
  const sb = await createClient();
  const { data, error } = await sb.auth.getSession();
  if (error || !data.session) return undefined;
  const { user } = data.session;

  return {
    id: user.id,
    email: user.email,
    display_name: user.user_metadata.display_name,
    role: user.user_metadata.role,
  } as User;
}

export async function getAllUsers() {
  const sb = await createClient();
  const { data, error } = await sb.from("profiles").select("*");
  if (error || !data) return [];
  return data as User[];
}

export async function getAllDistricts() {
  const sb = await createClient();
  const { data, error } = await sb
    .from("districts")
    .select("name")
    .order("name");
  if (error || !data) return [];
  return Array.from(new Set(data.map((d) => d.name)));
}

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
