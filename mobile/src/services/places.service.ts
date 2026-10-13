
export type PlaceSuggestion = {
  placeId: string;
  title: string;
  subtitle: string;
  description: string;
  types: string[];
};

export type PlaceDetails = {
  placeId: string;
  address: string;
  latitude: number;
  longitude: number;
};

function getPlacesApiUrl() {
  const rawUrl = process.env.EXPO_PUBLIC_API_URL;

  if (!rawUrl) {
    throw new Error("EXPO_PUBLIC_API_URL is missing.");
  }

  const baseUrl = rawUrl.replace(/\/+$/, "");

  // Supports both http://host:5001 and http://host:5001/api
  return baseUrl.endsWith("/api")
    ? `${baseUrl}/places`
    : `${baseUrl}/api/places`;
}

export async function getPlaceSuggestions(
  input: string,
  sessionToken: string,
  latitude?: number,
  longitude?: number,
  signal?: AbortSignal
): Promise<PlaceSuggestion[]> {
  const params = new URLSearchParams({
    input,
    sessionToken,
  });

  if (
    latitude !== undefined &&
    longitude !== undefined
  ) {
    params.set("latitude", String(latitude));
    params.set("longitude", String(longitude));
  }

  const response = await fetch(
    `${getPlacesApiUrl()}/autocomplete?${params.toString()}`,
    { signal }
  );

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(
      result.message || "Unable to load suggestions."
    );
  }

  return result.data ?? [];
}

export async function getPlaceDetails(
  placeId: string,
  sessionToken: string
): Promise<PlaceDetails> {
  const params = new URLSearchParams({
    sessionToken,
  });

  const response = await fetch(
    `${getPlacesApiUrl()}/details/${encodeURIComponent(placeId)}?${params.toString()}`
  );

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(
      result.message || "Unable to load place details."
    );
  }

  return result.data;
}
