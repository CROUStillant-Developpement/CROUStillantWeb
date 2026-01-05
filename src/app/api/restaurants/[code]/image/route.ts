import { NextRequest, NextResponse } from "next/server";
import { getRestaurant } from "@/services/restaurant-service";

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
      // Redirect to default image
      return NextResponse.redirect(
        new URL("/default_ru.png", request.url),
        { status: 302 }
      );
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
      return NextResponse.redirect(
        new URL("/default_ru.png", request.url),
        { status: 302 }
      );
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
    return NextResponse.redirect(
      new URL("/default_ru.png", request.url),
      { status: 302 }
    );
  }
}
