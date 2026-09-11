/*
  Route Search Service

  Purpose:
  Get real route information from Google Maps Routes API.

  The service receives:
  - starting location
  - destination

  Then it requests available routes from Google.
*/


// Google Routes API endpoint.
const GOOGLE_ROUTES_URL =
  "https://routes.googleapis.com/directions/v2:computeRoutes";


/*
  Convert meters into a user-friendly distance.

  Example:
  6200 meters
  becomes
  6.2 km
*/
const formatDistance = (distanceMeters) => {

  // If distance is less than 1 km,
  // display it in meters.
  if (distanceMeters < 1000) {
    return `${distanceMeters} m`;
  }

  // Otherwise convert meters to kilometers.
  const kilometers = distanceMeters / 1000;

  return `${kilometers.toFixed(1)} km`;
};


/*
  Google returns duration like:

  "1080s"

  meaning:
  1080 seconds.

  This function converts it into minutes.
*/
const formatDuration = (duration) => {

  // Remove the "s" from the Google value.
  //convert string to a number by 'parseFloat'
  const seconds = parseFloat(duration.replace("s", ""));

  // Convert seconds into minutes.
  const minutes = Math.ceil(seconds / 60);

  return `${minutes} min`;
};


/*
  Main Route Search function.
*/
const searchRoutes = async (
  startLocation,
  startLatitude,
  startLongitude,
  destination
) => {

  /*
    Read Google API key
    from the .env file.
  */
  const apiKey =
    process.env.GOOGLE_MAPS_API_KEY;


  /*
    Stop if API key is not configured.
  */
  if (!apiKey) {
    throw new Error(
      "GOOGLE_MAPS_API_KEY is not configured."
    );
  }


  /*
    Build the Google Routes API origin.

    If GPS coordinates are available,
    use the exact device location.

    Otherwise use the typed address.
  */
  let origin;

  if (
    startLatitude !== null &&
    startLatitude !== undefined &&
    startLongitude !== null &&
    startLongitude !== undefined
  ) {

    origin = {
      location: {
        latLng: {
          latitude: startLatitude,
          longitude: startLongitude,
        },
      },
    };

  } else {

    origin = {
      address: startLocation,
    };
  }


  /*
    Send request to Google Routes API.
  */
  const response = await fetch(
    GOOGLE_ROUTES_URL,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",

        "X-Goog-Api-Key": apiKey,

        "X-Goog-FieldMask":
          "routes.distanceMeters," +
          "routes.duration," +
          "routes.polyline.encodedPolyline," +
          "routes.routeLabels",
      },

      body: JSON.stringify({

        /*
          Starting point.

          This can be either:
          - GPS coordinates
          - text address
        */
        origin,

        /*
          Destination remains a text address.
        */
        destination: {
          address: destination,
        },

        travelMode: "DRIVE",

        routingPreference:
          "TRAFFIC_AWARE",

        computeAlternativeRoutes: true,

        units: "METRIC",

        languageCode: "en-US",
      }),
    }
  );


  /*
    Convert Google's response
    into JavaScript.
  */
  const data =
    await response.json();


  /*
    Handle Google API errors.
  */
  if (!response.ok) {

    console.error(
      "Google Routes API error:",
      data
    );

    throw new Error(
      data.error?.message ||
      "Google Routes API request failed."
    );
  }


  /*
    If no routes were found.
  */
  if (
    !data.routes ||
    data.routes.length === 0
  ) {
    return [];
  }


  /*
    Convert Google routes into
    SafeHer route objects.
  */
  const routes =
    data.routes.map(
      (route, index) => {

        return {

          id:
            `route-${index + 1}`,

          name:
            index === 0
              ? "Recommended Route"
              : `Alternative Route ${index}`,

          /*
            If GPS was used, keep
            "Current Location" as the
            displayed starting point.
          */
          startLocation:
            startLocation ||
            "Current Location",

          destination,

          distanceMeters:
            route.distanceMeters,

          distance:
            formatDistance(
              route.distanceMeters
            ),

          durationSeconds:
            parseFloat(
              route.duration.replace(
                "s",
                ""
              )
            ),

          duration:
            formatDuration(
              route.duration
            ),

          encodedPolyline:
            route.polyline
              ?.encodedPolyline || null,

          routeLabels:
            route.routeLabels || [],
        };
      }
    );


  return routes;
};


export {
  searchRoutes,
};