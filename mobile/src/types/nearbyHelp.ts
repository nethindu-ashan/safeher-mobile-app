export type NearbyHelpCategory =
  | "POLICE"
  | "HOSPITAL"
  | "PHARMACY"
  | "CLINIC"
  | "FIRE_STATION";

export type NearbyHelpService = {
  id: string;
  placeId?: string;
  name: string;
  category: NearbyHelpCategory | "OTHER";
  address: string;
  latitude: number | null;
  longitude: number | null;
  distance: number | null;
  distanceKm?: number | null;
  phone: string | null;
  rating: number | null;
  googleType?: string | null;
  userRatingCount?: number;
  isOpen?: boolean | null;
  googleMapsUri?: string | null;
  source?: "GOOGLE_PLACES";
};

export type NearbyHelpResponse = {
  success: boolean;
  category: NearbyHelpCategory;
  count: number;
  data: NearbyHelpService[];
};

export type NearbyHelpDetails = {
  placeId: string;
  name: string;
  category: NearbyHelpCategory | "OTHER";
  googleType: string | null;
  address: string;
  latitude: number | null;
  longitude: number | null;
  distanceKm: number | null;
  phone: string | null;
  rating: number | null;
  userRatingCount: number;
  isOpen: boolean | null;
  openingHours: string[];
  businessStatus: string | null;
  googleMapsUri: string | null;
  websiteUri: string | null;
  source: "GOOGLE_PLACES";
};

export type NearbyHelpDetailsResponse = {
  success: boolean;
  message: string;
  data: NearbyHelpDetails;
};