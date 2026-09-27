/*
  Route Search Validator

  Purpose:
  Check the starting location and destination
  before the request reaches our controller.

  The starting point can be:
  1. A text location
  2. Device GPS coordinates

  The destination can be:
  1. A text location
  2. Map-selected coordinates
*/

const validateRouteSearch = (req, res, next) => {
  const {
    startLocation,
    startLatitude,
    startLongitude,

    destination,
    destinationLatitude,
    destinationLongitude,
  } = req.body;


  /*
    =====================================================
    STARTING LOCATION VALIDATION
    =====================================================
  */

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

    const parsedStartLatitude =
      Number(startLatitude);

    const parsedStartLongitude =
      Number(startLongitude);


    if (
      !Number.isFinite(parsedStartLatitude) ||
      !Number.isFinite(parsedStartLongitude)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Latitude and longitude must be valid numbers.",
      });
    }


    if (
      parsedStartLatitude < -90 ||
      parsedStartLatitude > 90
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid starting latitude.",
      });
    }


    if (
      parsedStartLongitude < -180 ||
      parsedStartLongitude > 180
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid starting longitude.",
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
    =====================================================
    DESTINATION VALIDATION
    =====================================================
  */

  /*
    Check whether a text destination exists.
  */
  const hasDestinationText =
    typeof destination === "string" &&
    destination.trim() !== "";


  /*
    Check whether a map-selected
    destination coordinate exists.
  */
  const hasDestinationCoordinates =
    destinationLatitude !== undefined &&
    destinationLongitude !== undefined;


  /*
    Destination can be provided either:
    - as text
    - as coordinates
  */
  if (
    !hasDestinationText &&
    !hasDestinationCoordinates
  ) {
    return res.status(400).json({
      success: false,
      message:
        "Destination address or destination coordinates are required.",
    });
  }


  /*
    Validate destination coordinates
    if provided.
  */
  if (hasDestinationCoordinates) {

    const parsedDestinationLatitude =
      Number(destinationLatitude);

    const parsedDestinationLongitude =
      Number(destinationLongitude);


    if (
      !Number.isFinite(
        parsedDestinationLatitude
      ) ||
      !Number.isFinite(
        parsedDestinationLongitude
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Destination latitude and longitude must be valid numbers.",
      });
    }


    if (
      parsedDestinationLatitude < -90 ||
      parsedDestinationLatitude > 90
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid destination latitude.",
      });
    }


    if (
      parsedDestinationLongitude < -180 ||
      parsedDestinationLongitude > 180
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid destination longitude.",
      });
    }
  }


  /*
    Validate text destination
    when one is provided.
  */
  if (
    hasDestinationText &&
    destination.trim().length < 2
  ) {
    return res.status(400).json({
      success: false,
      message:
        "Destination must contain at least 2 characters.",
    });
  }


  /*
    =====================================================
    STORE CLEANED DATA
    =====================================================
  */

  req.routeSearchData = {

    /*
      Starting location.
    */
    startLocation:
      hasTextLocation
        ? startLocation.trim()
        : null,


    /*
      Starting GPS coordinates.
    */
    startLatitude:
      hasCoordinates
        ? Number(startLatitude)
        : null,

    startLongitude:
      hasCoordinates
        ? Number(startLongitude)
        : null,


    /*
      Typed destination.

      If the user selected the destination
      from the map, this will be null.
    */
    destination:
      hasDestinationText
        ? destination.trim()
        : null,


    /*
      Map-selected destination coordinates.
    */
    destinationLatitude:
      hasDestinationCoordinates
        ? Number(destinationLatitude)
        : null,

    destinationLongitude:
      hasDestinationCoordinates
        ? Number(destinationLongitude)
        : null,
  };


  /*
    Validation passed.
  */
  next();
};


export {
  validateRouteSearch,
};