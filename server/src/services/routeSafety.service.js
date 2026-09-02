import {
  findIncidentsInBounds,
} from "../repositories/routeSafety.repository.js";


/*
  Calculate the exact distance between
  two latitude/longitude points.

  We use the Haversine formula.

  Result is returned in kilometers.
*/
const calculateDistanceKm = (
  latitude1,
  longitude1,
  latitude2,
  longitude2
) => {

  // Approximate radius of Earth in kilometers
  const EARTH_RADIUS_KM = 6371;


  /*
    Convert degrees into radians.

    JavaScript Math.sin(), Math.cos(), etc.
    work with radians, not degrees.
  */
  const toRadians = (degree) => {
    return degree * (Math.PI / 180);
  };


  const lat1 = toRadians(latitude1);
  const lat2 = toRadians(latitude2);

  const latitudeDifference =
    toRadians(latitude2 - latitude1);

  const longitudeDifference =
    toRadians(longitude2 - longitude1);


  /*
    Haversine formula
  */
  const a =
    Math.sin(latitudeDifference / 2) ** 2 +
    Math.cos(lat1) *
      Math.cos(lat2) *
      Math.sin(longitudeDifference / 2) ** 2;


  const c =
    2 *
    Math.atan2(
      Math.sqrt(a),
      Math.sqrt(1 - a)
    );


  const distance =
    EARTH_RADIUS_KM * c;


  return distance;
};


/*
  Decode Google's encoded polyline into
  latitude and longitude coordinates.

  Example output:

  [
    { latitude: 6.9271, longitude: 79.8612 },
    { latitude: 6.9280, longitude: 79.8620 },
    ...
  ]
*/
const decodePolyline = (encodedPolyline) => {

  const coordinates = [];

  let index = 0;
  let latitude = 0;
  let longitude = 0;


  while (index < encodedPolyline.length) {

    let result = 0;
    let shift = 0;
    let byte;


    /*
      Decode latitude
    */
    do {

      byte =
        encodedPolyline.charCodeAt(index++) - 63;

      result |=
        (byte & 0x1f) << shift;

      shift += 5;

    } while (byte >= 0x20);


    const latitudeChange =
      (result & 1)
        ? ~(result >> 1)
        : result >> 1;


    latitude += latitudeChange;


    /*
      Decode longitude
    */
    result = 0;
    shift = 0;


    do {

      byte =
        encodedPolyline.charCodeAt(index++) - 63;

      result |=
        (byte & 0x1f) << shift;

      shift += 5;

    } while (byte >= 0x20);


    const longitudeChange =
      (result & 1)
        ? ~(result >> 1)
        : result >> 1;


    longitude += longitudeChange;


    /*
      Google encoded coordinates use
      5 decimal precision.
    */
    coordinates.push({

      latitude:
        latitude / 1e5,

      longitude:
        longitude / 1e5,
    });
  }


  return coordinates;
};

/*
  Find how close an incident is
  to the selected route.

  We compare the incident with
  all decoded route points and
  keep the smallest distance.
*/
const calculateDistanceToRoute = (
  incidentLatitude,
  incidentLongitude,
  routePoints
) => {

  let minimumDistance = Infinity;


  for (const point of routePoints) {

    const distance =
      calculateDistanceKm(
        incidentLatitude,
        incidentLongitude,
        point.latitude,
        point.longitude
      );


    if (distance < minimumDistance) {

      minimumDistance = distance;
    }
  }


  return minimumDistance;
};


/*
  Main service function.

  Finds recent incidents around a
  specific map location.
*/
const getNearbySafetyIncidents = async ({
  latitude,
  longitude,
  radiusKm = 5,
  days = 30,
}) => {

  /*
    Approximately:
    1 degree latitude = 111.32 km

    So we can calculate how many
    latitude degrees represent our radius.
  */
  const latitudeDifference =
    radiusKm / 111.32;


  /*
    Longitude distance changes depending
    on latitude.

    Therefore we use cos(latitude).
  */
  const longitudeDifference =
    radiusKm /
    (
      111.32 *
      Math.cos(
        latitude * Math.PI / 180
      )
    );


  /*
    Create approximate rectangular bounds.
  */
  const minLatitude =
    latitude - latitudeDifference;

  const maxLatitude =
    latitude + latitudeDifference;

  const minLongitude =
    longitude - longitudeDifference;

  const maxLongitude =
    longitude + longitudeDifference;


  /*
    Calculate oldest incident date.

    Example:
    days = 30

    Only incidents reported during
    the last 30 days will be considered.
  */
  const sinceDate = new Date();

  sinceDate.setDate(
    sinceDate.getDate() - days
  );


  /*
    Ask repository to get incidents
    inside our rectangular search area.
  */
  const candidateIncidents =
    await findIncidentsInBounds({
      minLatitude,
      maxLatitude,
      minLongitude,
      maxLongitude,
      sinceDate,
    });


  /*
    Now calculate the exact distance
    between the requested location
    and every candidate incident.
  */
  const nearbyIncidents =
    candidateIncidents
      .map((incident) => {

        const distanceKm =
          calculateDistanceKm(
            latitude,
            longitude,
            incident.latitude,
            incident.longitude
          );


        /*
          Add distance to the incident object.
        */
        return {
          ...incident,

          distanceKm:
            Number(
              distanceKm.toFixed(2)
            ),
        };
      })


      /*
        Rectangle can contain points that
        are actually outside our circular
        radius.

        Therefore filter again using
        the exact distance.
      */
      .filter(
        (incident) =>
          incident.distanceKm <= radiusKm
      )


      /*
        Show nearest incidents first.
      */
      .sort(
        (a, b) =>
          a.distanceKm - b.distanceKm
      );


  return nearbyIncidents;
};

/*
  Get recent safety incidents located
  close to a selected route.
*/
const getIncidentsNearRoute = async ({
  encodedPolyline,
  corridorKm = 0.5,
  days = 30,
}) => {

  /*
    Convert Google encoded polyline
    into route coordinates.
  */
  const routePoints =
    decodePolyline(encodedPolyline);


  if (routePoints.length < 2) {

    throw new Error(
      "Unable to decode route polyline."
    );
  }


  /*
    Get all route latitudes and longitudes.
  */
  const latitudes =
    routePoints.map(
      (point) => point.latitude
    );

  const longitudes =
    routePoints.map(
      (point) => point.longitude
    );


  /*
    Find route boundaries.
  */
  const routeMinLatitude =
    Math.min(...latitudes);

  const routeMaxLatitude =
    Math.max(...latitudes);

  const routeMinLongitude =
    Math.min(...longitudes);

  const routeMaxLongitude =
    Math.max(...longitudes);


  /*
    Find average route latitude.

    This helps calculate longitude
    padding more accurately.
  */
  const averageLatitude =
    latitudes.reduce(
      (total, value) => total + value,
      0
    ) / latitudes.length;


  /*
    Convert corridor distance into
    approximate latitude/longitude padding.
  */
  const latitudePadding =
    corridorKm / 111.32;


  const longitudeScale =
    Math.max(
      Math.cos(
        averageLatitude *
        Math.PI /
        180
      ),
      0.01
    );


  const longitudePadding =
    corridorKm /
    (111.32 * longitudeScale);


  /*
    Create a larger rectangle
    around the route.
  */
  const minLatitude =
    routeMinLatitude - latitudePadding;

  const maxLatitude =
    routeMaxLatitude + latitudePadding;

  const minLongitude =
    routeMinLongitude - longitudePadding;

  const maxLongitude =
    routeMaxLongitude + longitudePadding;


  /*
    Only consider recent incidents.
  */
  const sinceDate = new Date();

  sinceDate.setDate(
    sinceDate.getDate() - days
  );


  /*
    First get candidate incidents
    using our existing repository.
  */
  const candidateIncidents =
    await findIncidentsInBounds({
      minLatitude,
      maxLatitude,
      minLongitude,
      maxLongitude,
      sinceDate,
    });


  /*
    Calculate actual distance between
    every incident and the route.
  */
  const routeIncidents =
    candidateIncidents

      .map((incident) => {

        const distanceToRouteKm =
          calculateDistanceToRoute(
            incident.latitude,
            incident.longitude,
            routePoints
          );


        return {

          id:
            incident.id,

          category:
            incident.category,


          /*
            Approximate coordinates.

            We don't return the full exact
            reporting location to the map.
          */
          latitude:
            Number(
              incident.latitude.toFixed(3)
            ),

          longitude:
            Number(
              incident.longitude.toFixed(3)
            ),

          incidentDatetime:
            incident.incidentDatetime,

          description:
            incident.description,

          status:
            incident.status,

          distanceToRouteKm:
            Number(
              distanceToRouteKm.toFixed(2)
            ),
        };
      })


      /*
        Only incidents inside our
        safety corridor are returned.
      */
      .filter(
        (incident) =>
          incident.distanceToRouteKm
            <= corridorKm
      )


      /*
        Nearest route incidents first.
      */
      .sort(
        (a, b) =>
          a.distanceToRouteKm -
          b.distanceToRouteKm
      );


  return {
    routePointCount:
      routePoints.length,

    incidents:
      routeIncidents,
  };
};


export {
  getNearbySafetyIncidents,
  getIncidentsNearRoute,

};