import { API_URL } from "../config/api";

export async function apiRequest(
  endpoint: string,
  options: RequestInit = {}
) {
  if (!API_URL) {
    throw new Error(
      "EXPO_PUBLIC_API_URL is not configured."
    );
  }

  console.log(
    "API request:",
    `${API_URL}${endpoint}`
  );

  const response = await fetch(
    `${API_URL}${endpoint}`,
    {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
    }
  );

  const data = await response.json();

  console.log(
    "API response:",
    response.status,
    data
  );

  if (!response.ok) {
    throw new Error(
      data?.message ||
        `Request failed with status ${response.status}`
    );
  }

  return data;
}