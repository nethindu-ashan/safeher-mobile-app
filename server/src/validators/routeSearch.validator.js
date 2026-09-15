/*
  Route Search Validator

  Purpose:
  Check the starting location and destination
  before the request reaches our controller.

  The starting point can be:
  1. A text location
  2. Device GPS coordinates
*/

const validateRouteSearch = (req, res, next) => {
  const {
    startLocation,
    startLatitude,
    startLongitude,
    destination,
  } = req.body;

  /*
    Destination is always required.
  */
  if (!destination || destination.trim() === "") {
    return res.status(400).json({
      success: false,
      message: "Destination is required.",
    });
  }

  /*
    Check whether a text starting location exists.
  */
  const hasTextLocation =
    typeof startLocation === "string" &&
    startLocation.trim() !== "";

  /*
    Check whether GPS coordinates exist.
  */
  const hasCoordinates =
    startLatitude !== undefined &&
    startLongitude !== undefined;

  /*
    A starting point must be provided
    either as text or GPS coordinates.
  */
  if (!hasTextLocation && !hasCoordinates) {
    return res.status(400).json({
      success: false,
      message:
        "Starting location or current location coordinates are required.",
    });
  }

  /*
    Validate GPS coordinates if provided.
  */
  if (hasCoordinates) {
    if (
      typeof startLatitude !== "number" ||
      typeof startLongitude !== "number"
    ) {
      return res.status(400).json({
        success: false,
        message: "Latitude and longitude must be numbers.",
      });
    }

    if (
      startLatitude < -90 ||
      startLatitude > 90
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid latitude.",
      });
    }

    if (
      startLongitude < -180 ||
      startLongitude > 180
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid longitude.",
      });
    }
  }

  /*
    Validate text starting location
    when one is provided.
  */
  if (
    hasTextLocation &&
    startLocation.trim().length < 2
  ) {
    return res.status(400).json({
      success: false,
      message:
        "Starting location must contain at least 2 characters.",
    });
  }

  /*
    Validate destination length.
  */
  if (destination.trim().length < 2) {
    return res.status(400).json({
      success: false,
      message:
        "Destination must contain at least 2 characters.",
    });
  }

  /*
    Store cleaned route search data.
  */
  req.routeSearchData = {
    startLocation: hasTextLocation
      ? startLocation.trim()
      : null,

    startLatitude: hasCoordinates
      ? startLatitude
      : null,

    startLongitude: hasCoordinates
      ? startLongitude
      : null,

    destination: destination.trim(),
  };

  /*
    Validation passed.
  */
  next();
};

export {
  validateRouteSearch,
};