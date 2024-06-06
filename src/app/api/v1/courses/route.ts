import { NextRequest, NextResponse } from "next/server";
import courses from "@/data/courses/data.json";

type Course = {
  title: string;
  reference: string;
  level: string;
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name");
  const degree = searchParams.get("degree");
  const page = parseInt(searchParams.get("page") || "1", 10);
  let limit = parseInt(searchParams.get("limit") || "10", 10);

  if (limit > 20) {
    limit = 20;
  }

  let filteredCourses = courses as Course[];

  if (name) {
    filteredCourses = filteredCourses.filter((c) =>
      c.title.toLowerCase().includes(name.toLowerCase())
    );
  }

  if (degree) {
    filteredCourses = filteredCourses.filter((c) =>
      c.level.toLowerCase().includes(degree.toLowerCase())
    );
  }

  if (filteredCourses.length === 0) {
    return new NextResponse(JSON.stringify({ error: "No courses found" }), {
      status: 404,
      headers: {
        "Access-Control-Allow-Origin": "*", // Allow all origins
        "Access-Control-Allow-Methods": "GET,OPTIONS", // Allow specific methods
      },
    });
  }

  const start = (page - 1) * limit;
  const end = start + limit;
  const paginatedCourses = filteredCourses.slice(start, end);

  return new NextResponse(
    JSON.stringify({
      total: filteredCourses.length,
      page,
      limit,
      courses: paginatedCourses,
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
