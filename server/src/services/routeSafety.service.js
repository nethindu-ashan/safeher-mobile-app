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


export {
  getNearbySafetyIncidents,
};