import { sendNotificationToUser } from "../services/notification.service.js";

export async function sendTestNotification(req, res) {
  try {
    const result = await sendNotificationToUser(req.user.id, {
      title: "SafeHer Test Notification",
      body: "Push notifications are working!",
      data: {
        type: "TEST",
      },
    });

    return res.status(200).json({
      success: true,
      message: "Test notification sent.",
      result,
    });
  } catch (error) {
    console.error("Error sending test notification:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to send test notification.",
    });
  }
}