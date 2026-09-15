import {
  getPreferences,
  savePreferences,
} from "../services/notificationPreference.service.js";

export async function getNotificationPreferences(req, res) {
  try {
    const preferences = await getPreferences();

    res.status(200).json(preferences);
  } catch (error) {
    console.error("Error fetching notification preferences:", error);

    res.status(500).json({
      message: "Failed to fetch notification preferences",
    });
  }
}

export async function updateNotificationPreferences(req, res) {
  try {
    const {
      nearbyAlerts,
      emergencyAlerts,
      communityUpdates,
    } = req.body;

    if (
      typeof nearbyAlerts !== "boolean" ||
      typeof emergencyAlerts !== "boolean" ||
      typeof communityUpdates !== "boolean"
    ) {
      return res.status(400).json({
        message: "All notification preferences must be boolean values",
      });
    }

    const preferences = await savePreferences({
      nearbyAlerts,
      emergencyAlerts,
      communityUpdates,
    });

    res.status(200).json(preferences);
  } catch (error) {
    console.error("Error updating notification preferences:", error);

    res.status(500).json({
      message: "Failed to update notification preferences",
    });
  }
}