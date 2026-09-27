import express from "express";

import {
  getNotificationPreferences,
  updateNotificationPreferences,
} from "../controllers/notificationPreference.controller.js";

import { requireAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", requireAuth, getNotificationPreferences);
router.put("/", requireAuth, updateNotificationPreferences);

export default router;