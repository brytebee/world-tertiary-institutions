import { NextRequest, NextResponse } from "next/server";
import cities from "@/data/places/data.json";

type City = {
  name: string;
  country: string;
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name");
  const country = searchParams.get("country");
  const page = parseInt(searchParams.get("page") || "1", 10);
  let limit = parseInt(searchParams.get("limit") || "10", 10);

  if (limit > 20) {
    limit = 20;
  }

  let filteredCities = cities as City[];

  if (name) {
    filteredCities = filteredCities.filter((city) =>
      city.name.toLowerCase().includes(name.toLowerCase())
    );
  }

  if (country) {
    filteredCities = filteredCities.filter(
      (city) => city.country.toLowerCase() === country.toLowerCase()
    );
  }

  if (filteredCities.length === 0) {
    return NextResponse.json({ error: "No cities found" }, { status: 404 });
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
    { status: 200 }
  );
}
