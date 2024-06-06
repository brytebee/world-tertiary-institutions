// API code

import { NextRequest, NextResponse } from "next/server";
import cities from "@/data/places/data.json";

type City = {
  country: string;
  alpha_two_code: string;
  "state-province": string;
  city: string;
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get("city");
  const stateProvince = searchParams.get("state");
  const country = searchParams.get("country");
  const page = parseInt(searchParams.get("page") || "1", 10);
  let limit = parseInt(searchParams.get("limit") || "10", 10);

  if (limit > 20) {
    limit = 20;
  }

  let filteredCities = cities as City[];

  if (city) {
    filteredCities = filteredCities.filter((cityObj) =>
      cityObj.city.toLowerCase().includes(city.toLowerCase())
    );
  }

  if (stateProvince) {
    filteredCities = filteredCities.filter((cityObj) =>
      cityObj["state-province"]
        .toLowerCase()
        .includes(stateProvince.toLowerCase())
    );
  }

  if (country) {
    filteredCities = filteredCities.filter((cityObj) =>
      cityObj.country.toLowerCase().includes(country.toLowerCase())
    );
  }

  if (filteredCities.length === 0) {
    return NextResponse.json(
      { error: "No cities found" },
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
  const paginatedCities = filteredCities.slice(start, end);

  return NextResponse.json(
    {
      total: filteredCities.length,
      page,
      limit,
      cities: paginatedCities,
    },
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
