// Shared API request helper used by the SafeHer mobile app
import { apiRequest } from "./apiClient";

// TypeScript types for our Nearby Help feature
import type {
  NearbySupportResponse,
  SupportPlaceDetailsResponse,
  SupportCategory,
} from "../types/support";


// ============================================================
// GET NEARBY SUPPORT SERVICES
// ============================================================

/**
 * Get nearby real-world support services
 * based on the user's CURRENT device location.
 *
 * Backend endpoint:
 *
 * GET /api/support/nearby
 * ?lat=
 * &lng=
 * &type=
 * &radius=
 *
 * Example:
 *
 * getNearbySupportServices(
 *   6.9271,
 *   79.8612,
 *   "POLICE",
 *   5000
 * );
 */
export async function getNearbySupportServices(
  latitude: number,
  longitude: number,
  type: SupportCategory = "ALL",
  radius: number = 5000
): Promise<NearbySupportResponse> {

  // Make sure the shared API helper exists
  if (typeof apiRequest !== "function") {
    throw new Error(
      `getNearbySupportServices: apiRequest is ${typeof apiRequest}`
    );
  }

  // Create safe URL query parameters
  const params = new URLSearchParams({
    lat: String(latitude),
    lng: String(longitude),
    type,
    radius: String(radius),
  });

  // Call our Express backend
  return apiRequest(
    `/api/support/nearby?${params.toString()}`
  );
}


// ============================================================
// GET GOOGLE PLACE DETAILS
// ============================================================

/**
 * Get full details for one selected support service.
 *
 * The placeId comes from the nearby-service response.
 *
 * Backend endpoint:
 *
 * GET /api/support/place/:placeId
 * ?lat=
 * &lng=
 *
 * Current location is included so the backend
 * can calculate distance to the selected service.
 */
export async function getSupportPlaceDetails(
  placeId: string,
  latitude?: number,
  longitude?: number
): Promise<SupportPlaceDetailsResponse> {

  // Place ID is required
  if (!placeId || placeId.trim() === "") {
    throw new Error(
      "Support service Place ID is required"
    );
  }

  // Make sure API helper exists
  if (typeof apiRequest !== "function") {
    throw new Error(
      `getSupportPlaceDetails: apiRequest is ${typeof apiRequest}`
    );
  }

  /**
   * Google Place IDs may contain characters
   * that should be safely encoded inside URLs.
   */
  const encodedPlaceId =
    encodeURIComponent(placeId);

  /**
   * Current location is optional.
   *
   * However, if we send latitude,
   * longitude must also be available.
   */
  const hasLatitude =
    typeof latitude === "number";

  const hasLongitude =
    typeof longitude === "number";

  if (hasLatitude !== hasLongitude) {
    throw new Error(
      "Both latitude and longitude are required"
    );
  }


  // ----------------------------------------------------------
  // DETAILS WITH CURRENT LOCATION
  // ----------------------------------------------------------

  if (hasLatitude && hasLongitude) {
    const params = new URLSearchParams({
      lat: String(latitude),
      lng: String(longitude),
    });

    return apiRequest(
      `/api/support/place/${encodedPlaceId}?${params.toString()}`
    );
  }


  // ----------------------------------------------------------
  // DETAILS WITHOUT CURRENT LOCATION
  // ----------------------------------------------------------

  return apiRequest(
    `/api/support/place/${encodedPlaceId}`
  );
}