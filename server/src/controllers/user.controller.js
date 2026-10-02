import {
  getOrCreateUserProfile,
  updateCurrentUserProfile,
} from "../services/user.service.js";

export async function getMyProfile(req, res) {
  try {
    const profile = await getOrCreateUserProfile(req.user);

    return res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (error) {
    console.error("Get profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve user profile.",
    });
  }
}

export async function updateMyProfile(req, res) {
  try {
    // Make sure the profile exists first.
    await getOrCreateUserProfile(req.user);

    const profile = await updateCurrentUserProfile(
      req.user.id,
      req.body
    );

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      data: profile,
    });
  } catch (error) {
    console.error("Update profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update user profile.",
    });
  }
}