import { NextRequest, NextResponse } from "next/server";
import { getVoteRounds } from "@/services/vote-service";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ candidateId: string }> },
) {
  try {
    const { candidateId } = await params;
    const id = parseInt(candidateId);

    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid candidate ID" },
        { status: 400 },
      );
    }

    const result = await getVoteRounds(id);

    if (!result.success) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
