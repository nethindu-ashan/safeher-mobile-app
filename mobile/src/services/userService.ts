import { apiRequest } from "./apiClient";

import type {
  UpdateUserProfilePayload,
  UserProfileResponse,
} from "../types/user";

export async function getMyProfile(): Promise<UserProfileResponse> {
  return apiRequest<UserProfileResponse>("/api/users/me");
}

export async function updateMyProfile(
  payload: UpdateUserProfilePayload
): Promise<UserProfileResponse> {
  return apiRequest<UserProfileResponse>("/api/users/me", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}