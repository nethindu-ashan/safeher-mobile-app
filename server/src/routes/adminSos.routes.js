import express from "express";

import {
  requireAuth,
} from "../middleware/auth.middleware.js";

import {
  requireAdminSOS,
} from "../middleware/adminSos.middleware.js";

import {
  getSOSRecords,
  getSOSById,
} from "../controllers/adminSos.controller.js";

const router = express.Router();

router.use(requireAuth);
router.use(requireAdminSOS);

router.get("/", getSOSRecords);

router.get("/:id", getSOSById);

export default router;