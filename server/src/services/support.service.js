import "dotenv/config";

import * as supportRepository from "../repositories/support.repository.js";


// ============================================================
// CONFIGURATION
// ============================================================

const GOOGLE_NEARBY_URL =
  "https://places.googleapis.com/v1/places:searchNearby";

const GOOGLE_TEXT_SEARCH_URL =
  "https://places.googleapis.com/v1/places:searchText";

const GOOGLE_PLACE_DETAILS_URL =
  "https://places.googleapis.com/v1/places";

const DEFAULT_RADIUS = 5000;

const MAX_RADIUS = 50000;

const MAX_RESULTS = 20;


// ============================================================
// CATEGORY CONFIGURATION
// ============================================================

const CATEGORY_CONFIG = {
  POLICE: {
    mode: "nearby",
    types: ["police"],
  },

  HOSPITAL: {
    mode: "nearby",
    types: [
      "hospital",
      "general_hospital",
      "medical_center",
    ],
  },

  PHARMACY: {
    mode: "nearby",
    types: ["pharmacy"],
  },

  COMMUNITY_CENTER: {
    mode: "nearby",
    types: ["community_center"],
  },

  // Google does not have an exact dedicated place type
  // for these SafeHer UI categories.
  WOMENS_SUPPORT: {
    mode: "text",
    query: "women's support center",
  },

  SAFE_SPACE: {
    mode: "text",
    query: "women's shelter",
  },
};


// ============================================================
// HELPERS
// ============================================================

const getGoogleApiKey = () => {
  const apiKey =
    process.env.GOOGLE_MAPS_API_KEY?.trim();

  if (!apiKey) {
    throw new Error(
      "Google Maps API key is not configured"
    );
  }

  return apiKey;
};


/**
 * Support older category names used during development.
 */
const normalizeCategory = (type = "ALL") => {
  const value = String(type)
    .trim()
    .toUpperCase();

  const aliases = {
    ALL: "ALL",

    POLICE: "POLICE",

    HOSPITAL: "HOSPITAL",
    MEDICAL: "HOSPITAL",

    PHARMACY: "PHARMACY",

    COMMUNITY: "COMMUNITY_CENTER",
    COMMUNITY_CENTER: "COMMUNITY_CENTER",

    WOMEN_SUPPORT: "WOMENS_SUPPORT",
    WOMENS_SUPPORT: "WOMENS_SUPPORT",
    WOMEN_SUPPORT_CENTER: "WOMENS_SUPPORT",

    SAFE_PLACE: "SAFE_SPACE",
    SAFE_SPACE: "SAFE_SPACE",
  };

  const normalized = aliases[value];

  if (!normalized) {
    throw new Error(
      "Invalid support service type"
    );
  }

  return normalized;
};


/**
 * Validate geographic values again at service level.
 *
 * Validator protects the HTTP route.
 * Service validation protects the function itself.
 */
const validateLocation = (
  latitude,
  longitude,
  radius
) => {
  const lat = Number(latitude);
  const lng = Number(longitude);
  const searchRadius = Number(radius);

  if (
    !Number.isFinite(lat) ||
    lat < -90 ||
    lat > 90
  ) {
    throw new Error("Invalid latitude");
  }

  if (
    !Number.isFinite(lng) ||
    lng < -180 ||
    lng > 180
  ) {
    throw new Error("Invalid longitude");
  }

  if (
    !Number.isFinite(searchRadius) ||
    searchRadius <= 0 ||
    searchRadius > MAX_RADIUS
  ) {
    throw new Error(
      "Radius must be between 1 and 50000 meters"
    );
  }

  return {
    lat,
    lng,
    radius: searchRadius,
  };
};


/**
 * Haversine distance.
 *
 * This gives straight-line geographic distance,
 * not driving-route distance.
 */
const calculateDistanceKm = (
  lat1,
  lng1,
  lat2,
  lng2
) => {
  const earthRadiusKm = 6371;

  const toRadians = (degrees) =>
    (degrees * Math.PI) / 180;

  const latitudeDifference =
    toRadians(lat2 - lat1);

  const longitudeDifference =
    toRadians(lng2 - lng1);

  const a =
    Math.sin(latitudeDifference / 2) ** 2 +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(longitudeDifference / 2) ** 2;

  const c =
    2 *
    Math.atan2(
      Math.sqrt(a),
      Math.sqrt(1 - a)
    );

  return earthRadiusKm * c;
};


/**
 * Determine SafeHer category from Google types.
 */
const detectCategory = (
  googleTypes = [],
  fallbackCategory = null
) => {
  if (fallbackCategory) {
    return fallbackCategory;
  }

  if (googleTypes.includes("police")) {
    return "POLICE";
  }

  if (
    googleTypes.includes("hospital") ||
    googleTypes.includes("general_hospital") ||
    googleTypes.includes("medical_center")
  ) {
    return "HOSPITAL";
  }

  if (
    googleTypes.includes("pharmacy") ||
    googleTypes.includes("drugstore")
  ) {
    return "PHARMACY";
  }

  if (
    googleTypes.includes("community_center")
  ) {
    return "COMMUNITY_CENTER";
  }

  return "OTHER";
};


/**
 * Convert Google response into a simple SafeHer object.
 */
const formatGooglePlace = (
  place,
  userLat,
  userLng,
  fallbackCategory = null
) => {
  const latitude =
    place.location?.latitude ?? null;

  const longitude =
    place.location?.longitude ?? null;

  let distanceKm = null;

  if (
    latitude !== null &&
    longitude !== null
  ) {
    distanceKm = calculateDistanceKm(
      userLat,
      userLng,
      latitude,
      longitude
    );
  }

  return {
    placeId: place.id,

    name:
      place.displayName?.text ||
      "Unknown Support Service",

    category: detectCategory(
      place.types || [],
      fallbackCategory
    ),

    googleType:
      place.primaryType || null,

    address:
      place.formattedAddress ||
      "Address unavailable",

    latitude,

    longitude,

    // Approximate straight-line distance.
    distanceKm:
      distanceKm !== null
        ? Number(distanceKm.toFixed(1))
        : null,

    rating:
      place.rating ?? null,

    userRatingCount:
      place.userRatingCount ?? 0,

    isOpen:
      typeof place.currentOpeningHours
        ?.openNow === "boolean"
        ? place.currentOpeningHours.openNow
        : null,

    phone:
      place.nationalPhoneNumber ||
      place.internationalPhoneNumber ||
      null,

    googleMapsUri:
      place.googleMapsUri || null,

    source: "GOOGLE_PLACES",
  };
};


/**
 * Read Google JSON response and convert API errors
 * into normal JavaScript errors.
 */
const readGoogleResponse = async (
  response
) => {
  let data = {};

  try {
    data = await response.json();
  } catch {
    data = {};
  }

  if (!response.ok) {
    throw new Error(
      data?.error?.message ||
        "Google Places request failed"
    );
  }

  return data;
};


// ============================================================
// PRISMA DATABASE SERVICES
// ============================================================

export const getAllSupportServices =
  async () => {
    return supportRepository.getAllSupportServices();
  };


export const getSupportServiceById =
  async (id) => {
    if (!id) {
      throw new Error(
        "Support service ID is required"
      );
    }

    const supportService =
      await supportRepository.getSupportServiceById(
        id
      );

    if (!supportService) {
      throw new Error(
        "Support service not found"
      );
    }

    return supportService;
  };


// ============================================================
// GOOGLE NEARBY SEARCH
// ============================================================

const searchNearbyByTypes = async (
  latitude,
  longitude,
  radius,
  types,
  category = null
) => {
  const apiKey = getGoogleApiKey();

  const requestBody = {
    includedTypes: types,

    maxResultCount: MAX_RESULTS,

    rankPreference: "DISTANCE",

    locationRestriction: {
      circle: {
        center: {
          latitude,
          longitude,
        },

        radius,
      },
    },
  };

  const response = await fetch(
    GOOGLE_NEARBY_URL,
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json",

        "X-Goog-Api-Key":
          apiKey,

        "X-Goog-FieldMask":
          "places.id," +
          "places.displayName," +
          "places.formattedAddress," +
          "places.location," +
          "places.primaryType," +
          "places.types," +
          "places.rating," +
          "places.userRatingCount," +
          "places.currentOpeningHours," +
          "places.nationalPhoneNumber," +
          "places.internationalPhoneNumber," +
          "places.googleMapsUri",
      },

      body: JSON.stringify(
        requestBody
      ),
    }
  );

  const data =
    await readGoogleResponse(response);

  return (data.places || []).map(
    (place) =>
      formatGooglePlace(
        place,
        latitude,
        longitude,
        category
      )
  );
};


// ============================================================
// GOOGLE TEXT SEARCH
// ============================================================

const searchNearbyByText = async (
  latitude,
  longitude,
  radius,
  textQuery,
  category
) => {
  const apiKey = getGoogleApiKey();

  const requestBody = {
    textQuery,

    pageSize: MAX_RESULTS,

    rankPreference: "DISTANCE",

    // Google treats this as a bias.
    // We filter by radius ourselves afterwards.
    locationBias: {
      circle: {
        center: {
          latitude,
          longitude,
        },

        radius,
      },
    },
  };

  const response = await fetch(
    GOOGLE_TEXT_SEARCH_URL,
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json",

        "X-Goog-Api-Key":
          apiKey,

        "X-Goog-FieldMask":
          "places.id," +
          "places.displayName," +
          "places.formattedAddress," +
          "places.location," +
          "places.primaryType," +
          "places.types," +
          "places.rating," +
          "places.userRatingCount," +
          "places.currentOpeningHours," +
          "places.nationalPhoneNumber," +
          "places.internationalPhoneNumber," +
          "places.googleMapsUri",
      },

      body: JSON.stringify(
        requestBody
      ),
    }
  );

  const data =
    await readGoogleResponse(response);

  return (data.places || [])
    .map((place) =>
      formatGooglePlace(
        place,
        latitude,
        longitude,
        category
      )
    )

    // locationBias is not a strict radius,
    // therefore filter manually.
    .filter((place) => {
      if (place.distanceKm === null) {
        return false;
      }

      return (
        place.distanceKm * 1000 <=
        radius
      );
    });
};


// ============================================================
// MAIN NEARBY FUNCTION
// ============================================================

export const getNearbySupportServices =
  async (
    latitude,
    longitude,
    type = "ALL",
    radius = DEFAULT_RADIUS
  ) => {
    const location =
      validateLocation(
        latitude,
        longitude,
        radius
      );

    const category =
      normalizeCategory(type);

    let results = [];


    // --------------------------------------------------------
    // ALL CATEGORIES
    // --------------------------------------------------------

    if (category === "ALL") {
      const normalPlacesPromise =
        searchNearbyByTypes(
          location.lat,
          location.lng,
          location.radius,
          [
            "police",
            "hospital",
            "general_hospital",
            "medical_center",
            "pharmacy",
            "community_center",
          ]
        );

      const womenSupportPromise =
        searchNearbyByText(
          location.lat,
          location.lng,
          location.radius,
          CATEGORY_CONFIG
            .WOMENS_SUPPORT.query,
          "WOMENS_SUPPORT"
        );

      const safeSpacePromise =
        searchNearbyByText(
          location.lat,
          location.lng,
          location.radius,
          CATEGORY_CONFIG
            .SAFE_SPACE.query,
          "SAFE_SPACE"
        );

      const [
        normalPlaces,
        womenSupportPlaces,
        safeSpacePlaces,
      ] = await Promise.all([
        normalPlacesPromise,
        womenSupportPromise,
        safeSpacePromise,
      ]);

      results = [
        ...normalPlaces,
        ...womenSupportPlaces,
        ...safeSpacePlaces,
      ];
    } else {
      // ------------------------------------------------------
      // ONE CATEGORY
      // ------------------------------------------------------

      const config =
        CATEGORY_CONFIG[category];

      if (config.mode === "nearby") {
        results =
          await searchNearbyByTypes(
            location.lat,
            location.lng,
            location.radius,
            config.types,
            category
          );
      } else {
        results =
          await searchNearbyByText(
            location.lat,
            location.lng,
            location.radius,
            config.query,
            category
          );
      }
    }


    // ========================================================
    // REMOVE DUPLICATES
    // ========================================================

    const uniquePlaces =
      new Map();

    for (const place of results) {
      if (place.placeId) {
        uniquePlaces.set(
          place.placeId,
          place
        );
      }
    }


    // ========================================================
    // SORT NEAREST FIRST
    // ========================================================

    return Array.from(
      uniquePlaces.values()
    )
      .sort((a, b) => {
        const distanceA =
          a.distanceKm ??
          Number.MAX_VALUE;

        const distanceB =
          b.distanceKm ??
          Number.MAX_VALUE;

        return (
          distanceA - distanceB
        );
      })
      .slice(0, MAX_RESULTS);
  };


// ============================================================
// GOOGLE PLACE DETAILS
// ============================================================

export const getGooglePlaceDetails =
  async (
    placeId,
    userLatitude = null,
    userLongitude = null
  ) => {
    if (!placeId) {
      throw new Error(
        "Google Place ID is required"
      );
    }

    const apiKey =
      getGoogleApiKey();

    const url =
      `${GOOGLE_PLACE_DETAILS_URL}/` +
      encodeURIComponent(placeId);

    const response = await fetch(
      url,
      {
        method: "GET",

        headers: {
          "X-Goog-Api-Key":
            apiKey,

          "X-Goog-FieldMask":
            "id," +
            "displayName," +
            "formattedAddress," +
            "location," +
            "primaryType," +
            "types," +
            "rating," +
            "userRatingCount," +
            "nationalPhoneNumber," +
            "internationalPhoneNumber," +
            "currentOpeningHours," +
            "regularOpeningHours," +
            "googleMapsUri," +
            "websiteUri," +
            "businessStatus",
        },
      }
    );

    const place =
      await readGoogleResponse(
        response
      );

    let distanceKm = null;

    if (
      userLatitude !== null &&
      userLongitude !== null
    ) {
      const userLocation =
        validateLocation(
          userLatitude,
          userLongitude,
          DEFAULT_RADIUS
        );

      if (
        place.location?.latitude !==
          undefined &&
        place.location?.longitude !==
          undefined
      ) {
        distanceKm =
          calculateDistanceKm(
            userLocation.lat,
            userLocation.lng,
            place.location.latitude,
            place.location.longitude
          );
      }
    }

    return {
      placeId:
        place.id,

      name:
        place.displayName?.text ||
        "Unknown Support Service",

      category:
        detectCategory(
          place.types || []
        ),

      googleType:
        place.primaryType || null,

      address:
        place.formattedAddress ||
        "Address unavailable",

      latitude:
        place.location?.latitude ??
        null,

      longitude:
        place.location?.longitude ??
        null,

      distanceKm:
        distanceKm !== null
          ? Number(
              distanceKm.toFixed(1)
            )
          : null,

      phone:
        place.nationalPhoneNumber ||
        place.internationalPhoneNumber ||
        null,

      rating:
        place.rating ?? null,

      userRatingCount:
        place.userRatingCount ?? 0,

      isOpen:
        typeof place
          .currentOpeningHours
          ?.openNow === "boolean"
          ? place
              .currentOpeningHours
              .openNow
          : null,

      openingHours:
        place.currentOpeningHours
          ?.weekdayDescriptions ||
        place.regularOpeningHours
          ?.weekdayDescriptions ||
        [],

      businessStatus:
        place.businessStatus || null,

      googleMapsUri:
        place.googleMapsUri || null,

      websiteUri:
        place.websiteUri || null,

      source:
        "GOOGLE_PLACES",
    };
  };