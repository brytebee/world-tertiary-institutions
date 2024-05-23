import { NextRequest, NextResponse } from "next/server";
import universities from "@/data/universities/data.json";

type University = {
  alpha_two_code: string;
  country: string;
  "state-province": string | null;
  domains: string[];
  name: string;
  web_pages: string[];
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name");
  const state = searchParams.get("state");
  const country = searchParams.get("country");
  const page = parseInt(searchParams.get("page") || "1", 10);
  let limit = parseInt(searchParams.get("limit") || "10", 10);

  if (limit > 20) {
    limit = 20;
  }

  let filteredUniversities = universities as University[];

  if (name) {
    filteredUniversities = filteredUniversities.filter((u) =>
      u.name.toLowerCase().includes(name.toLowerCase())
    );
  }

  if (state) {
    filteredUniversities = filteredUniversities.filter(
      (u) =>
        u["state-province"] &&
        u["state-province"].toLowerCase().includes(state.toLowerCase())
    );
  }

  if (country) {
    filteredUniversities = filteredUniversities.filter(
      (u) => u.country.toLowerCase() === country.toLowerCase()
    );
  }

  if (filteredUniversities.length === 0) {
    return NextResponse.json(
      { error: "No universities found" },
      { status: 404 }
    );
  }

  const start = (page - 1) * limit;
  const end = start + limit;
  const paginatedUniversities = filteredUniversities.slice(start, end);

  return NextResponse.json(
    {
      total: filteredUniversities.length,
      page,
      limit,
      universities: paginatedUniversities,
    },
    { status: 200 }
  );
}
