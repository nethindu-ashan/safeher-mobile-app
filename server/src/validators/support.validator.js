// ============================================================
// SUPPORT SERVICE VALIDATORS
// ============================================================

const ALLOWED_SUPPORT_TYPES = [
  "ALL",
  "POLICE",
  "HOSPITAL",
  "PHARMACY",
  "COMMUNITY_CENTER",
  "COMMUNITY",
  "WOMENS_SUPPORT",
  "WOMEN_SUPPORT",
  "SAFE_SPACE",
  "SAFE_PLACE",
  "MEDICAL",
];


/**
 * Validate:
 *
 * GET /api/support/nearby
 * ?lat=
 * &lng=
 * &type=
 * &radius=
 */
export const validateNearbySupportQuery = (
  req,
  res,
  next
) => {
  const {
    lat,
    lng,
    type = "ALL",
    radius = 5000,
  } = req.query;

  // Current location is required.
  if (
    lat === undefined ||
    lng === undefined
  ) {
    return res.status(400).json({
      success: false,
      message: "Latitude and longitude are required",
    });
  }

  const latitude = Number(lat);
  const longitude = Number(lng);
  const searchRadius = Number(radius);

  // Validate latitude.
  if (
    !Number.isFinite(latitude) ||
    latitude < -90 ||
    latitude > 90
  ) {
    return res.status(400).json({
      success: false,
      message: "Invalid latitude",
    });
  }

  // Validate longitude.
  if (
    !Number.isFinite(longitude) ||
    longitude < -180 ||
    longitude > 180
  ) {
    return res.status(400).json({
      success: false,
      message: "Invalid longitude",
    });
  }

  // Google Places allows up to 50 km.
  if (
    !Number.isFinite(searchRadius) ||
    searchRadius <= 0 ||
    searchRadius > 50000
  ) {
    return res.status(400).json({
      success: false,
      message:
        "Radius must be between 1 and 50000 meters",
    });
  }

  const normalizedType = String(type)
    .trim()
    .toUpperCase();

  if (
    !ALLOWED_SUPPORT_TYPES.includes(
      normalizedType
    )
  ) {
    return res.status(400).json({
      success: false,
      message: "Invalid support service type",
    });
  }

  next();
};


/**
 * Validate Google Place Details request.
 *
 * GET /api/support/place/:placeId
 */
export const validatePlaceDetailsRequest = (
  req,
  res,
  next
) => {
  const { placeId } = req.params;
  const { lat, lng } = req.query;

  if (
    !placeId ||
    String(placeId).trim() === ""
  ) {
    return res.status(400).json({
      success: false,
      message: "Google Place ID is required",
    });
  }

  const hasLat = lat !== undefined;
  const hasLng = lng !== undefined;

  // If one coordinate is supplied, both are required.
  if (hasLat !== hasLng) {
    return res.status(400).json({
      success: false,
      message:
        "Both latitude and longitude are required for distance calculation",
    });
  }

  // Coordinates are optional for Place Details.
  if (!hasLat && !hasLng) {
    return next();
  }

  const latitude = Number(lat);
  const longitude = Number(lng);

  if (
    !Number.isFinite(latitude) ||
    latitude < -90 ||
    latitude > 90
  ) {
    return res.status(400).json({
      success: false,
      message: "Invalid latitude",
    });
  }

  if (
    !Number.isFinite(longitude) ||
    longitude < -180 ||
    longitude > 180
  ) {
    return res.status(400).json({
      success: false,
      message: "Invalid longitude",
    });
  }

  next();
};


/**
 * Validate SafeHer SupportService UUID.
 *
 * GET /api/support/:id
 */
export const validateSupportServiceId = (
  req,
  res,
  next
) => {
  const { id } = req.params;

  const uuidPattern =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  if (
    !id ||
    !uuidPattern.test(id)
  ) {
    return res.status(400).json({
      success: false,
      message: "Invalid support service ID",
    });
  }

  next();
};