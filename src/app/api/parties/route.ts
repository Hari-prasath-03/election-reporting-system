import { NextRequest, NextResponse } from "next/server";
import { getParties } from "@/services/party-service";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = searchParams.get("page") || "1";
  const limit = searchParams.get("limit") || "20";
  const query = searchParams.get("query") || "";
  const excludeIndependent = searchParams.get("excludeIndependent") === "true";

  const result = await getParties({
    page: parseInt(page),
    limit: parseInt(limit),
    query,
    excludeIndependent,
  });

  if (!result.success) {
    return NextResponse.json(result, { status: 500 });
  }

  return NextResponse.json(result);
}
