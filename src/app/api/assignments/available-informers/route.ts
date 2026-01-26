import { NextRequest, NextResponse } from "next/server";
import { getAvailableInformers } from "@/services/assignment-service";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const centerIdParam = searchParams.get("centerId");
  const centerId = centerIdParam ? parseInt(centerIdParam) : undefined;

  const result = await getAvailableInformers(centerId);

  if (!result.success) {
    return NextResponse.json(result, { status: 500 });
  }

  return NextResponse.json(result);
}
