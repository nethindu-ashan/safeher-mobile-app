import {
  registerPushToken,
  removePushToken,
} from "../services/pushToken.service.js";

export async function registerPushTokenController(req, res) {
  try {
    const { token } = req.body;

    if (!token || typeof token !== "string") {
      return res.status(400).json({
        message: "Push token is required.",
      });
    }

    const pushToken = await registerPushToken(
      req.user.id,
      token
    );

    return res.status(200).json(pushToken);
  } catch (error) {
    console.error("Error registering push token:", error);

    return res.status(500).json({
      message: "Failed to register push token.",
    });
  }
}

export async function removePushTokenController(req, res) {
  try {
    const { token } = req.body;

    if (!token || typeof token !== "string") {
      return res.status(400).json({
        message: "Push token is required.",
      });
    }

    await removePushToken(token);

    return res.status(200).json({
      message: "Push token removed successfully.",
    });
  } catch (error) {
    console.error("Error removing push token:", error);

    return res.status(500).json({
      message: "Failed to remove push token.",
    });
  }
}