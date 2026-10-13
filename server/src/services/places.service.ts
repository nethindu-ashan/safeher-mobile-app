export type PlaceSuggestion = {
  placeId: string;
  title: string;
  subtitle: string;
};

const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

if (!GOOGLE_PLACES_API_KEY) {
  console.warn(
    "Missing EXPO_PUBLIC_GOOGLE_PLACES_API_KEY"
  );
}

export async function getPlaceSuggestions(
  input: string
): Promise<PlaceSuggestion[]> {
  if (!input.trim()) return [];

  const url =
    `https://maps.googleapis.com/maps/api/place/autocomplete/json` +
    `?input=${encodeURIComponent(input)}` +
    `&key=${GOOGLE_PLACES_API_KEY}` +
    `&components=country:lk` +
    `&types=geocode|establishment`;

  const response = await fetch(url);
  const data = await response.json();

  if (data.status !== "OK" && data.status !== "ZERO_RESULTS") {
    throw new Error(
      data.error_message ||
        "Unable to load place suggestions."
    );
  }

  return (data.predictions || []).map((item: any) => ({
    placeId: item.place_id,
    title: item.structured_formatting?.main_text || item.description,
    subtitle:
      item.structured_formatting?.secondary_text || "",
  }));
}

export async function getPlaceDetails(
  placeId: string
) {
  const url =
    `https://maps.googleapis.com/maps/api/place/details/json` +
    `?place_id=${encodeURIComponent(placeId)}` +
    `&fields=name,formatted_address,geometry` +
    `&key=${GOOGLE_PLACES_API_KEY}`;

  const response = await fetch(url);
  const data = await response.json();

  if (data.status !== "OK") {
    throw new Error(
      data.error_message ||
        "Unable to load place details."
    );
  }

  const result = data.result;

  return {
    name: result.name,
    address: result.formatted_address,
    latitude: result.geometry.location.lat,
    longitude: result.geometry.location.lng,
  };
}