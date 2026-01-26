import { NextRequest, NextResponse } from "next/server";
import { getCenterAssignments } from "@/services/assignment-service";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ centerId: string }> },
) {
  const { centerId } = await params;
  const id = parseInt(centerId);

  if (isNaN(id)) {
    return NextResponse.json(
      { success: false, error: "Invalid center ID" },
      { status: 400 },
    );
  }

  const result = await getCenterAssignments(id);

  if (!result.success) {
    return NextResponse.json(result, { status: 500 });
  }

  return NextResponse.json(result);
}
