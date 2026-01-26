import { NextRequest, NextResponse } from "next/server";
import { getUsers } from "@/services/user-service";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = searchParams.get("page") || "1";
  const limit = searchParams.get("limit") || "20";
  const query = searchParams.get("query") || "";
  const role = searchParams.get("role") || "all";

  const result = await getUsers({
    page: parseInt(page),
    limit: parseInt(limit),
    query,
    role,
  });

  if (!result.success) {
    return NextResponse.json(result, { status: 500 });
  }

  return NextResponse.json(result);
}
