import { NextRequest, NextResponse } from "next/server";
import { getCountingCentersWithAssignments } from "@/services/counting-center-service";

export async function GET(request: NextRequest) {
  const result = await getCountingCentersWithAssignments();

  if (!result.success) {
    return NextResponse.json(result, { status: 500 });
  }

  return NextResponse.json(result);
}
