import { supabase } from "../config/supabase";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error("Missing EXPO_PUBLIC_API_URL");
}

export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError) {
    console.error(
      "Unable to read Supabase session:",
      sessionError.message
    );
  }

  const headers = new Headers(options.headers);

  headers.set("Content-Type", "application/json");

  if (session?.access_token) {
    headers.set(
      "Authorization",
      `Bearer ${session.access_token}`
    );
  }

  const url = `${API_URL}${endpoint}`;

  console.log("API request:", url);
  console.log(
    "Auth token attached:",
    Boolean(session?.access_token)
  );

  const response = await fetch(url, {
    ...options,
    headers,
  });

  let data: any = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

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

  return data as T;
}