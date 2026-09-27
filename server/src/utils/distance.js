export function calculateDistance(
  latitude1,
  longitude1,
  latitude2,
  longitude2
) {
  const R = 6371;

  const dLatitude =
    ((latitude2 - latitude1) * Math.PI) / 180;

  const dLongitude =
    ((longitude2 - longitude1) * Math.PI) / 180;

  const a =
    Math.sin(dLatitude / 2) ** 2 +
    Math.cos((latitude1 * Math.PI) / 180) *
      Math.cos((latitude2 * Math.PI) / 180) *
      Math.sin(dLongitude / 2) ** 2;

  const c =
    2 *
    Math.atan2(
      Math.sqrt(a),
      Math.sqrt(1 - a)
    );

  return R * c;
}