import createClient from "@/lib/supabase/server";

export async function getStateSeatStatus() {
  const sb = await createClient();
  const { data, error } = await sb.from("v_state_seat_status").select("*");

  if (error) {
    console.error("Error fetching state seat status:", error);
    return [];
  }
  return data;
}

export async function getIndependentSeats() {
  const sb = await createClient();
  const { data, error } = await sb
    .from("v_state_independent_status")
    .select("*")
    .single();

  if (error) {
    console.error("Error fetching independent seats:", error);
    return { independent_seats: 0 };
  }
  return data;
}

export async function getDistrictSeatStatus() {
  const sb = await createClient();
  const { data, error } = await sb.from("v_district_seat_status").select("*");

  if (error) {
    console.error("Error fetching district seat status:", error);
    return [];
  }
  return data;
}

export async function getConstituencyMargins() {
  const sb = await createClient();
  const { data: margins, error: marginError } = await sb
    .from("v_constituency_leader_margin")
    .select(
      "constituency_id, constituency_name, leader_candidate, leader_party, leader_party_symbol, leader_party_color, competing_party, competing_party_symbol, vote_margin",
    );

  if (marginError) {
    console.error("Error fetching constituency margins:", marginError);
    return [];
  }

  const { data: districts, error: districtError } = await sb
    .from("constituencies")
    .select("id, district_id(name)");

  if (districtError) {
    console.warn("Could not fetch district info:", districtError);
    return margins;
  }

  const districtMap = new Map<number, string>();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  districts.forEach((d: any) => {
    if (d.district_id?.name) {
      districtMap.set(d.id, d.district_id.name);
    }
  });

  return margins.map((m) => ({
    ...m,
    district: districtMap.get(m.constituency_id) || "Unknown",
  }));
}

export async function getConstituencyCandidates(constituencyId: number) {
  const sb = await createClient();

  const { data: candidates, error } = await sb
    .from("candidates")
    .select(
      `
      id,
      name,
      photo_url,
      gender,
      total_votes,
      party:parties(
        id,
        name,
        short_name,
        symbol_url,
        color_code
      ),
      constituency:constituencies(
        id,
        name,
        district:districts(name)
      )
    `,
    )
    .eq("constituency_id", constituencyId)
    .order("total_votes", { ascending: false });

  if (error) {
    console.error(
      `Error fetching candidates for constituency ${constituencyId}:`,
      error,
    );
    return [];
  }

  return candidates;
}
