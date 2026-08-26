/*
  Route Search Validator

  Purpose:
  Check the starting location and destination
  before the request reaches our controller.
*/

const validateRouteSearch = (req, res, next) => {

  // Read the values sent by the client.
  const { startLocation, destination } = req.body;

  /*
    Check whether a starting location was provided.
  */
  if (!startLocation || startLocation.trim() === "") {
    return res.status(400).json({
      success: false,
      message: "Starting location is required.",
    });
  }

  /*
    Check whether a destination was provided.
  */
  if (!destination || destination.trim() === "") {
    return res.status(400).json({
      success: false,
      message: "Destination is required.",
    });
  }

  /*
    Prevent extremely short input such as:
    A
    B
  */
  if (startLocation.trim().length < 2) {
    return res.status(400).json({
      success: false,
      message: "Starting location must contain at least 2 characters.",
    });
  }

  if (destination.trim().length < 2) {
    return res.status(400).json({
      success: false,
      message: "Destination must contain at least 2 characters.",
    });
  }

  /*
    Store clean versions of the data.

    Example:
    "  SLIIT Malabe  "

    becomes:

    "SLIIT Malabe"
  */
  req.routeSearchData = {
    startLocation: startLocation.trim(),
    destination: destination.trim(),
  };

  /*
    Validation passed.

    next() tells Express:
    "Continue to the next function."
  */
  next();
};

export {
  validateRouteSearch,
};