// Import all functions from the support repository
// Repository layer is responsible for talking directly with Prisma/database
import * as supportRepository from "../repositories/support.repository.js";

/**
 * Get all available support services
 */
export const getAllSupportServices = async () => {
  // Ask the repository to get all support services
  const supportServices =
    await supportRepository.getAllSupportServices();

  // Return the result back to the controller
  return supportServices;
};

/**
 * Get one support service by its ID
 *
 * @param {string} id - UUID of the support service
 */
export const getSupportServiceById = async (id) => {
  // Check whether an ID was provided
  if (!id) {
    throw new Error("Support service ID is required");
  }

  // Get the support service from the database through repository
  const supportService =
    await supportRepository.getSupportServiceById(id);

  // If no service exists with that ID, throw an error
  if (!supportService) {
    throw new Error("Support service not found");
  }

  // Return the support service
  return supportService;
};






/**
 * Get real-world nearby support services using Google Places API
 *
 * @param {number} latitude  - User's current latitude
 * @param {number} longitude - User's current longitude
 * @param {string} type      - Support service category
 * @param {number} radius    - Search radius in meters
 */
export const getNearbySupportServices = async (
  latitude,
  longitude,
  type = "ALL",
  radius = 5000
) => {
  // Get Google Maps API key from .env
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;

  // Stop the request if API key is missing
  if (!apiKey) {
    throw new Error("Google Maps API key is not configured");
  }

  // Convert values coming from URL query parameters into numbers
  const lat = Number(latitude);
  const lng = Number(longitude);
  const searchRadius = Number(radius);

  // Validate latitude
  if (Number.isNaN(lat) || lat < -90 || lat > 90) {
    throw new Error("Invalid latitude");
  }

  // Validate longitude
  if (Number.isNaN(lng) || lng < -180 || lng > 180) {
    throw new Error("Invalid longitude");
  }

  // Validate search radius
  if (
    Number.isNaN(searchRadius) ||
    searchRadius <= 0 ||
    searchRadius > 50000
  ) {
    throw new Error("Radius must be between 1 and 50000 meters");
  }

  /**
   * Map SafeHer categories to Google Places types.
   *
   * Later the frontend can send:
   * HOSPITAL
   * POLICE
   * MEDICAL
   * COMMUNITY
   * ALL
   */
  const placeTypes = {
    HOSPITAL: ["hospital"],
    POLICE: ["police"],
    MEDICAL: ["medical_center"],
    COMMUNITY: ["community_center"],

    // Default set when user wants all nearby support services
    ALL: [
      "hospital",
      "police",
      "medical_center",
      "community_center",
    ],
  };

  // Convert requested type to uppercase
  const requestedType = type.toUpperCase();

  // Check whether the provided category is supported
  if (!placeTypes[requestedType]) {
    throw new Error("Invalid support service type");
  }

  // Google Places Nearby Search endpoint
  const googlePlacesUrl =
    "https://places.googleapis.com/v1/places:searchNearby";

  // Request body sent to Google Places
  const requestBody = {
    includedTypes: placeTypes[requestedType],

    // Maximum allowed by Nearby Search is 20
    maxResultCount: 20,

    // Return closest locations first
    rankPreference: "DISTANCE",

    // Search around the user's CURRENT device location
    locationRestriction: {
      circle: {
        center: {
          latitude: lat,
          longitude: lng,
        },

        // Example: 5000 = 5 km
        radius: searchRadius,
      },
    },
  };

  // Send request to Google Places API
  const response = await fetch(googlePlacesUrl, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",

      // Google Maps API key stored securely in server/.env
      "X-Goog-Api-Key": apiKey,

      /**
       * Only request the fields that SafeHer currently needs.
       * Avoid "*" because requesting unnecessary fields can
       * increase API processing and billing.
       */
      "X-Goog-FieldMask":
        "places.id,places.displayName,places.formattedAddress,places.location,places.primaryType,places.types",
    },

    body: JSON.stringify(requestBody),
  });

  // Convert Google's response into JSON
  const data = await response.json();

  // If Google returns an error, stop and pass the error upward
  if (!response.ok) {
    throw new Error(
      data?.error?.message || "Failed to fetch nearby support services"
    );
  }

  // Google may return no places, so use an empty array as fallback
  const places = data.places || [];

  /**
   * Convert Google's large response into a simpler
   * SafeHer-friendly response.
   */
  return places.map((place) => ({
    placeId: place.id,

    name: place.displayName?.text || "Unknown Service",

    type: place.primaryType || "support_service",

    address: place.formattedAddress || "Address unavailable",

    latitude: place.location?.latitude,

    longitude: place.location?.longitude,
  }));
};






