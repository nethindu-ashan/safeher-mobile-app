import {
  getPreferences,
  savePreferences,
} from "../services/notificationPreference.service.js";

export async function getNotificationPreferences(req, res) {
  try {
    const preferences = await getPreferences(req.user.id);

    return res.status(200).json(preferences);
  } catch (error) {
    console.error(
      "Error fetching notification preferences:",
      error
    );

    return res.status(500).json({
      message: "Failed to fetch notification preferences",
    });
  }
}

export async function updateNotificationPreferences(req, res) {
  try {
    const {
      nearbyAlerts,
      emergencyAlerts,
      
    } = req.body;

    if (
      typeof nearbyAlerts !== "boolean" ||
      typeof emergencyAlerts !== "boolean" 
      
    ) {
      return res.status(400).json({
        message:
          "All notification preferences must be boolean values",
      });
    }

    const preferences = await savePreferences(
      req.user.id,
      {
        nearbyAlerts,
        emergencyAlerts,
        
      }
    );

    return res.status(200).json(preferences);
  } catch (error) {
    console.error(
      "Error updating notification preferences:",
      error
    );

    return res.status(500).json({
      message: "Failed to update notification preferences",
    });
  }
}