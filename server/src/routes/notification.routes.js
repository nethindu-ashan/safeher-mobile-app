import express from "express";

import { sendTestNotification } from "../controllers/notification.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/test", requireAuth, sendTestNotification);

export default router;