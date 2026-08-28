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
const searchRoutes = async ( startLocation, destination ) => {

  /*
    Read our Google API key
    from the .env file.
  */
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;


  /*
    Stop if API key is not configured.
  */
  if (!apiKey) {
    throw new Error(
      "GOOGLE_MAPS_API_KEY is not configured."
    );
  }


  /*
    Send request to Google Routes API.

    Node 22 already supports fetch(),
    so we do not need axios.
  */
  const response = await fetch(
    GOOGLE_ROUTES_URL,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",

        /*
          Authentication for
          Google Routes API.
        */
        "X-Goog-Api-Key": apiKey,

        /*
          Google Routes API requires a field mask.

          We request only the information
          our SafeHer app currently needs.
        */
        "X-Goog-FieldMask":
          "routes.distanceMeters," +
          "routes.duration," +
          "routes.polyline.encodedPolyline," +
          "routes.routeLabels",
      },

      body: JSON.stringify({

        /*
          User-provided starting location.
        */
        origin: {
          address: startLocation,
        },

        /*
          User-provided destination.
        */
        destination: {
          address: destination,
        },

        /*
          For now SafeHer calculates
          driving routes.
        */
        travelMode: "DRIVE",

        /*
          Consider current traffic conditions.
        */
        routingPreference:
          "TRAFFIC_AWARE",

        /*
          Ask Google for alternative routes.

          This supports the Route Search story
          and will later help Sprint 3
          route comparison.
        */
        computeAlternativeRoutes: true,

        /*
          Return metric information.
        */
        units: "METRIC",

        languageCode: "en-US",
      }),
    }
  );


  /*
    Convert Google's JSON response
    into a JavaScript object.
  */
  const data =
    await response.json();


  /*
    If Google returns an error,
    stop the service.
  */
  if (!response.ok) {

    console.error( "Google Routes API error:", data);

    throw new Error(
      data.error?.message ||
      "Google Routes API request failed."
    );
  }


  /*
    If Google found no routes,
    return an empty array.
  */
  if (!data.routes ||
      data.routes.length === 0) {

    return [];
  }


  /*
    Convert Google's response into
    a simpler SafeHer route structure.

    map() executes once for every route.
  */
  const routes =
    data.routes.map(
      (route, index) => {

        return {

          /*
            Create our own simple ID.
          */
          id: `route-${index + 1}`,

          /*
            First route is treated as
            the main/recommended route.

            Others are alternatives.
          */
          name:
            index === 0
              ? "Recommended Route"
              : `Alternative Route ${index}`,

          startLocation,

          destination,

          /*
            Keep original metric values
            for calculations later.
          */
          distanceMeters:
            route.distanceMeters,

          /*
            Human-readable distance.
          */
          distance:
            formatDistance(
              route.distanceMeters
            ),

          /*
            Google duration value
            e.g. "1080s".
          */
          durationSeconds:
            parseFloat(
              route.duration.replace(
                "s",
                ""
              )
            ),

          /*
            User-friendly value
            e.g. "18 min".
          */
          duration:
            formatDuration(
              route.duration
            ),

          /*
            Encoded path of the route.

            Later the React Native map
            can decode this and draw
            the actual route line.
          */
          encodedPolyline:
            route.polyline
              ?.encodedPolyline || null,

          /*
            Google may identify whether
            it is the default route
            or an alternative.
          */
          routeLabels:
            route.routeLabels || [],
        };
      }
    );


  // Return final SafeHer route objects.
  return routes;
};


export {
  searchRoutes,
};