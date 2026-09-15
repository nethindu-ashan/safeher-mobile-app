import express from "express";

import {
  getNotificationPreferences,
  updateNotificationPreferences,
} from "../controllers/notificationPreference.controller.js";

const router = express.Router();

router.get("/", getNotificationPreferences);
router.put("/", updateNotificationPreferences);

export default router;