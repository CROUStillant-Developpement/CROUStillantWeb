import { NextRequest, NextResponse } from "next/server";
import { getRestaurant } from "@/services/restaurant-service";
import { readFile } from "fs/promises";
import { join } from "path";

/**
 * Serves the default restaurant image
 */
async function serveDefaultImage(): Promise<NextResponse> {
  const defaultImagePath = join(process.cwd(), "public", "default_ru.png");
  const defaultImage = await readFile(defaultImagePath);
  
  return new NextResponse(defaultImage, {
    status: 200,
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=86400, immutable",
    },
  });
}

/**
 * API route to proxy restaurant images with API key authentication
 * This bypasses the rate limit by adding the API key server-side
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await context.params;

    // Fetch restaurant data with API key
    const result = await getRestaurant(code);

    if (!result.success) {
      return NextResponse.json(
        { error: "Restaurant not found" },
        { status: 404 }
      );
    }

    const restaurant = result.data;

    // If no image URL, return default image
    if (!restaurant.image_url) {
      return await serveDefaultImage();
    }

    // Fetch the image from the backend API with authentication
    const headers: HeadersInit = {};
    if (process.env.API_KEY) {
      headers["X-Api-Key"] = process.env.API_KEY;
    }

    const imageResponse = await fetch(restaurant.image_url, {
      headers,
      cache: "no-store", // Disable Next.js cache to avoid 2MB limit error
    });

    if (!imageResponse.ok) {
      return await serveDefaultImage();
    }

    // Stream the response to avoid loading large images into memory
    // This prevents the "items over 2MB can not be cached" error
    return new NextResponse(imageResponse.body, {
      status: 200,
      headers: {
        "Content-Type": imageResponse.headers.get("Content-Type") || "image/jpeg",
        "Cache-Control": "public, max-age=86400, immutable", // Cache for 24 hours in browser
      },
    });
  } catch (error) {
    console.error("Error proxying restaurant image:", error);
    
    try {
      return await serveDefaultImage();
    } catch (fallbackError) {
      console.error("Error serving default image:", fallbackError);
      return NextResponse.json(
        { error: "Failed to load image" },
        { status: 500 }
      );
    }
  }
}
