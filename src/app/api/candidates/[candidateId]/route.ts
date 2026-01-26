import { NextRequest, NextResponse } from "next/server";
import { getCandidateDetails } from "@/services/candidate-service";

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

    const result = await getCandidateDetails(id);

    if (!result.success) {
      return NextResponse.json(result, { status: 404 });
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
