import { NextRequest, NextResponse } from "next/server";
import { getAssignedCenters } from "@/services/informer-service";

export async function GET(request: NextRequest) {
  const result = await getAssignedCenters();

  if (!result.success) {
    if (result.error === "User not authenticated") {
      return NextResponse.json(result, { status: 401 });
    }
    return NextResponse.json(result, { status: 500 });
  }

  return NextResponse.json(result);
}
