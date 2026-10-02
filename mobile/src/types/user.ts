export type UserRole = "USER" | "ADMIN";

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfileResponse {
  success: boolean;
  message?: string;
  data: UserProfile;
}

export interface UpdateUserProfilePayload {
  fullName?: string;
  phone?: string;
}