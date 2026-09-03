export const API_URL = process.env.EXPO_PUBLIC_API_URL;

if (!API_URL) {
  console.warn("EXPO_PUBLIC_API_URL is not configured");
}