/*
 * Google's encoded polyline algorithm.
 *
 * The Google Routes API returns the route path
 * as an encoded polyline string.
 *
 * This function converts that encoded string
 * into latitude/longitude coordinates that
 * react-native-maps can understand.
 */

export type MapCoordinate = {
  latitude: number;
  longitude: number;
};

export function decodePolyline(
  encoded: string
): MapCoordinate[] {
  const coordinates: MapCoordinate[] = [];

  let index = 0;
  let latitude = 0;
  let longitude = 0;

  while (index < encoded.length) {
    // Decode latitude.
    let result = 0;
    let shift = 0;
    let byte: number;

    do {
      byte = encoded.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);

    const latitudeChange =
      result & 1 ? ~(result >> 1) : result >> 1;

    latitude += latitudeChange;

    // Decode longitude.
    result = 0;
    shift = 0;

    do {
      byte = encoded.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);

    const longitudeChange =
      result & 1 ? ~(result >> 1) : result >> 1;

    longitude += longitudeChange;

    coordinates.push({
      latitude: latitude / 100000,
      longitude: longitude / 100000,
    });
  }

  return coordinates;
}