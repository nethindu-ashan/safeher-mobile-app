/*
  Route Safety Validator

  Purpose:
  Validate latitude, longitude, radius and
  recent-day values before the request
  reaches the controller.
*/

const validateNearbySafetyRequest = (req, res, next) => {

  /*
    Values from URL query parameters
    arrive as strings.

    Example:
    ?latitude=6.9271

    latitude will initially be "6.9271"
  */
  const {
    latitude,
    longitude,
    radiusKm = "5",
    days = "30",
  } = req.query;


  /*
    Latitude and longitude are required.
  */
  if (latitude === undefined || latitude === "") {
    return res.status(400).json({
      success: false,
      message: "Latitude is required.",
    });
  }


  if (longitude === undefined || longitude === "") {
    return res.status(400).json({
      success: false,
      message: "Longitude is required.",
    });
  }


  /*
    Convert query-string values
    into JavaScript numbers.
  */
  const parsedLatitude = Number(latitude);
  const parsedLongitude = Number(longitude);
  const parsedRadiusKm = Number(radiusKm);
  const parsedDays = Number(days);


  /*
    Check whether values are valid numbers.
  */
  if (!Number.isFinite(parsedLatitude)) {
    return res.status(400).json({
      success: false,
      message: "Latitude must be a valid number.",
    });
  }


  if (!Number.isFinite(parsedLongitude)) {
    return res.status(400).json({
      success: false,
      message: "Longitude must be a valid number.",
    });
  }


  /*
    Valid latitude range:
    -90 to 90
  */
  if (parsedLatitude < -90 || parsedLatitude > 90) {
    return res.status(400).json({
      success: false,
      message: "Latitude must be between -90 and 90.",
    });
  }


  /*
    Valid longitude range:
    -180 to 180
  */
  if (parsedLongitude < -180 || parsedLongitude > 180) {
    return res.status(400).json({
      success: false,
      message: "Longitude must be between -180 and 180.",
    });
  }


  /*
    Radius must be a positive number.

    We limit it to 50 km so a request
    cannot accidentally search an
    unnecessarily huge area.
  */
  if (
    !Number.isFinite(parsedRadiusKm) ||
    parsedRadiusKm <= 0 ||
    parsedRadiusKm > 50
  ) {
    return res.status(400).json({
      success: false,
      message:
        "Radius must be greater than 0 and not more than 50 km.",
    });
  }


  /*
    Number of days must also be valid.

    Maximum 365 days is an implementation
    safeguard for this feature.
  */
  if (
    !Number.isInteger(parsedDays) ||
    parsedDays <= 0 ||
    parsedDays > 365
  ) {
    return res.status(400).json({
      success: false,
      message:
        "Days must be a whole number between 1 and 365.",
    });
  }


  /*
    Store cleaned values in the request.

    Controller can now use these values
    without converting or validating again.
  */
  req.routeSafetyData = {
    latitude: parsedLatitude,
    longitude: parsedLongitude,
    radiusKm: parsedRadiusKm,
    days: parsedDays,
  };

  // Validation successful.
  // Continue to controller.
  next();
};

// Validate safety-information request for a selected route.
const validateRouteIncidentRequest = (req, res, next) => {
  const {
    encodedPolyline,
    corridorKm = 0.5,
    days = 30,
  } = req.body;


  // Route polyline is required.
  if (typeof encodedPolyline !== "string" || encodedPolyline.trim() === "") {

    return res.status(400).json({
      success: false,
      message: "Encoded route polyline is required.",
    });
  }

  const parsedCorridorKm = Number(corridorKm);
  const parsedDays = Number(days);

  /*
    Safety corridor validation.

    0.1 km = 100 metres
    Maximum = 5 km
  */
  if (
    !Number.isFinite(parsedCorridorKm) ||
    parsedCorridorKm < 0.1 ||
    parsedCorridorKm > 5
  ) {

    return res.status(400).json({
      success: false,
      message: "Corridor must be between 0.1 and 5 km.",
    });
  }


  if (
    !Number.isInteger(parsedDays) ||
    parsedDays <= 0 ||
    parsedDays > 365
  ) {

    return res.status(400).json({
      success: false,
      message: "Days must be a whole number between 1 and 365.",
    });
  }

  req.routeIncidentData = {
    encodedPolyline: encodedPolyline.trim(),
    corridorKm: parsedCorridorKm,
    days: parsedDays,
  };

  next();
};

// Validate multiple routes before comparing their safety information.
const validateRouteComparisonRequest = (req, res, next) => {

  const {routes, corridorKm = 0.5, days = 30,} = req.body;

  /*
    Routes must be an array.

    At least two routes are needed because this feature is for comparison.
  */
  if (!Array.isArray(routes) || routes.length < 2) {

    return res.status(400).json({
      success: false,
      message: "At least two routes are required for comparison.",
    });
  }


  /*
    Limit the number of routes.

    Google normally returns only a
    small number of route alternatives,
    so we do not need a huge array.
  */
  if (routes.length > 5) {

    return res.status(400).json({
      success: false,
      message:"A maximum of 5 routes can be compared.",
    });
  }


  // Validate every route.
  for (const route of routes) {

    // Every route should have an ID.
    if (typeof route.id !== "string" || route.id.trim() === "") {

      return res.status(400).json({
        success: false,
        message: "Each route must have a valid ID.",
      });
    }

    /*
      Every route needs its Google encoded polyline.
      Without it we cannot calculate incidents near the route.
    */
    if (typeof route.encodedPolyline !== "string" || route.encodedPolyline.trim() === "") {

      return res.status(400).json({
        success: false,
        message: `Encoded polyline is required for ${route.id}.`,
      });
    }
  }


  //  Convert comparison settings to numbers.
  const parsedCorridorKm = Number(corridorKm);
  const parsedDays =  Number(days);

  // Validate route safety corridor.
  if (
    !Number.isFinite(parsedCorridorKm) ||
    parsedCorridorKm < 0.1 ||
    parsedCorridorKm > 5
  ) {

    return res.status(400).json({
      success: false,
      message: "Corridor must be between 0.1 and 5 km.",
    });
  }

  // Validate recent-day period.
  if (
    !Number.isInteger(parsedDays) ||
    parsedDays <= 0 ||
    parsedDays > 365
  ) {

    return res.status(400).json({
      success: false,
      message: "Days must be a whole number between 1 and 365.",
    });
  }

  // Store clean data for controller.
  req.routeComparisonData = {
    routes,
    corridorKm: parsedCorridorKm,
    days:  parsedDays,
  };

  next();
};

export {
  validateNearbySafetyRequest,
  validateRouteIncidentRequest,
  validateRouteComparisonRequest,
};