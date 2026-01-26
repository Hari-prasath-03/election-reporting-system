import { NextRequest, NextResponse } from "next/server";
import { getConstituencies } from "@/services/constituency-service";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");
  const query = searchParams.get("query") || "";
  const district = searchParams.get("district") || "all";

  const result = await getConstituencies({
    page,
    limit,
    query,
    district,
  });

  if (!result.success) {
    return NextResponse.json(result, { status: 500 });
  }

  return NextResponse.json(result);
}
