// ============================================================
// SUPPORT SERVICE TYPES
// ============================================================

/**
 * Categories used by the SafeHer Nearby Help feature.
 */
export type SupportCategory =
  | "ALL"
  | "POLICE"
  | "HOSPITAL"
  | "PHARMACY"
  | "COMMUNITY_CENTER"
  | "WOMENS_SUPPORT"
  | "SAFE_SPACE";


/**
 * One nearby support service returned by:
 *
 * GET /api/support/nearby
 */
export interface NearbySupportService {
  // Google Place ID
  placeId: string;

  // Service name
  name: string;

  // SafeHer category
  category: SupportCategory | "OTHER";

  // Original Google place type
  googleType: string | null;

  // Address shown to user
  address: string;

  // Coordinates used for map and directions
  latitude: number | null;
  longitude: number | null;

  // Approximate straight-line distance from user
  distanceKm: number | null;

  // Google rating
  rating: number | null;

  // Number of ratings
  userRatingCount: number;

  // Current open/closed status
  isOpen: boolean | null;

  // Contact number if Google provides one
  phone: string | null;

  // Google Maps URL
  googleMapsUri: string | null;

  // Shows where this data came from
  source: "GOOGLE_PLACES";
}


/**
 * Response returned by:
 *
 * GET /api/support/nearby
 */
export interface NearbySupportResponse {
  success: boolean;

  message: string;

  count: number;

  requestedType: string;

  radiusMeters: number;

  data: NearbySupportService[];
}


/**
 * Complete service details returned by:
 *
 * GET /api/support/place/:placeId
 */
export interface SupportPlaceDetails {
  placeId: string;

  name: string;

  category: SupportCategory | "OTHER";

  googleType: string | null;

  address: string;

  latitude: number | null;

  longitude: number | null;

  distanceKm: number | null;

  phone: string | null;

  rating: number | null;

  userRatingCount: number;

  isOpen: boolean | null;

  openingHours: string[];

  businessStatus: string | null;

  googleMapsUri: string | null;

  websiteUri: string | null;

  source: "GOOGLE_PLACES";
}


/**
 * Response returned by:
 *
 * GET /api/support/place/:placeId
 */
export interface SupportPlaceDetailsResponse {
  success: boolean;

  message: string;

  data: SupportPlaceDetails;
}