import {
  upsertUserProfile,
  updateUserProfile,
} from "../repositories/user.repository.js";

export async function getOrCreateUserProfile(authUser) {
  if (!authUser) {
    throw new Error("Authenticated user is required.");
  }

  if (!authUser.id) {
    throw new Error(
      "Authenticated user does not have a valid ID."
    );
  }

  if (!authUser.email) {
    throw new Error(
      "Authenticated user does not have an email address."
    );
  }

  const fullName =
    authUser.user_metadata?.full_name?.trim() ||
    "SafeHer User";

  const profile = await upsertUserProfile({
    id: authUser.id,
    fullName,
    email: authUser.email
      .trim()
      .toLowerCase(),
  });

  return profile;
}

export async function updateCurrentUserProfile(
  userId,
  data
) {
  const updateData = {};

  if (
    typeof data.fullName === "string" &&
    data.fullName.trim()
  ) {
    updateData.fullName =
      data.fullName.trim();
  }

  if (typeof data.phone === "string") {
    updateData.phone =
      data.phone.trim() || null;
  }

  return updateUserProfile(
    userId,
    updateData
  );
}