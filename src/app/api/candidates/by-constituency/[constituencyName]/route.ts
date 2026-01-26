import { NextRequest, NextResponse } from "next/server";
import { getCandidatesByConstituency } from "@/services/candidate-service";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ constituencyName: string }> },
) {
  try {
    const { constituencyName } = await params;
    const result = await getCandidatesByConstituency(constituencyName);

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
