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
      next: { revalidate: 86400 }, // Revalidate after 24 hours
    });

    if (!imageResponse.ok) {
      return NextResponse.redirect(
        new URL("/default_ru.png", request.url),
        { status: 302 }
      );
    }

    // Get the image buffer
    const imageBuffer = await imageResponse.arrayBuffer();

    // Return the image with appropriate headers
    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        "Content-Type": imageResponse.headers.get("Content-Type") || "image/jpeg",
        "Cache-Control": "public, max-age=86400, immutable", // Cache for 24 hours
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
