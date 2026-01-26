import { NextRequest, NextResponse } from "next/server";
import { getCandidates } from "@/services/candidate-service";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || "20";
    const query = searchParams.get("query") || "";
    const constituency = searchParams.get("constituency") || "all";
    const party = searchParams.get("party") || "all";

    const result = await getCandidates({
      page: parseInt(page),
      limit: parseInt(limit),
      query,
      constituency,
      party,
    });

    if (!result.success) {
      return NextResponse.json(result, { status: 500 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("API Error in candidates route:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
