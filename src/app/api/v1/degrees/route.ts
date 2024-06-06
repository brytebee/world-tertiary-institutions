import { NextRequest, NextResponse } from "next/server";

// Define the data for degrees and certifications
import degreesData from "@/data/degrees/data.json";

// Define the structure of a degree
type Degree = {
  title: string;
  accr: string;
};

// Define the structure of the degrees data
type DegreesData = {
  undergrad: Degree[];
  postgrad: Degree[];
  doctoral: Degree[];
  certifications: Degree[];
};

// Flatten the nested arrays into a single array of Degree objects with the level included
const allDegrees: (Degree & { level: string })[] = [
  ...degreesData.undergrad.map((degree) => ({ ...degree, level: "undergrad" })),
  ...degreesData.postgrad.map((degree) => ({ ...degree, level: "postgrad" })),
  ...degreesData.doctoral.map((degree) => ({ ...degree, level: "doctoral" })),
  ...degreesData.certifications.map((degree) => ({
    ...degree,
    level: "certifications",
  })),
];

// Define the function to handle GET requests
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const searchTerm = searchParams.get("search");
  const level = searchParams.get("level");

  // Filter degrees based on search term and level
  let filteredDegrees = allDegrees;

  if (searchTerm) {
    filteredDegrees = filteredDegrees.filter(
      (degree) =>
        degree.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        degree.accr.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  if (level) {
    filteredDegrees = filteredDegrees.filter(
      (degree) => degree.level.toLowerCase() === level.toLowerCase()
    );
  }

  if (filteredDegrees.length === 0) {
    return NextResponse.json(
      { error: "No degrees found" },
      {
        status: 404,
        headers: {
          "Access-Control-Allow-Origin": "*", // Allow all origins
          "Access-Control-Allow-Methods": "GET,OPTIONS", // Allow specific methods
        },
      }
    );
  }

  return NextResponse.json(
    {
      total: filteredDegrees.length,
      degrees: filteredDegrees,
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
