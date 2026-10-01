import express from "express";

import {
  registerPushTokenController,
  removePushTokenController,
} from "../controllers/pushToken.controller.js";

import { requireAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", requireAuth, registerPushTokenController);
router.delete("/", requireAuth, removePushTokenController);

export default router;