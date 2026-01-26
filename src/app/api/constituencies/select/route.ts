import { NextRequest, NextResponse } from "next/server";
import { getAllConstituenciesForSelect } from "@/services/constituency-service";

export async function GET(request: NextRequest) {
  const result = await getAllConstituenciesForSelect();

  if (!result.success) {
    return NextResponse.json(result, { status: 500 });
  }

  return NextResponse.json(result);
}
