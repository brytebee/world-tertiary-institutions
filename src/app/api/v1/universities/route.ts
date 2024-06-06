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
    return new NextResponse(
      JSON.stringify({ error: "No universities found" }),
      {
        status: 404,
        headers: {
          "Access-Control-Allow-Origin": "*", // Allow all origins
          "Access-Control-Allow-Methods": "GET,OPTIONS", // Allow specific methods
        },
      }
    );
  }

  const start = (page - 1) * limit;
  const end = start + limit;
  const paginatedUniversities = filteredUniversities.slice(start, end);

  return new NextResponse(
    JSON.stringify({
      total: filteredUniversities.length,
      page,
      limit,
      universities: paginatedUniversities,
    }),
    {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*", // Allow all origins
        "Access-Control-Allow-Methods": "GET,OPTIONS", // Allow specific methods
      },
    }
  );
}

// Handle OPTIONS requests for CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    headers: {
      "Access-Control-Allow-Origin": "*", // Allow all origins
      "Access-Control-Allow-Methods": "GET,OPTIONS", // Allow specific methods
      "Access-Control-Allow-Headers": "Content-Type, Authorization", // Allow specific headers
    },
  });
}
