import express from "express";

import {
  activateSOS,
  getSOSById,
  cancelSOS,
} from "../controllers/sos.controller.js";

const router = express.Router();

router.post("/", activateSOS);

router.get("/:id", getSOSById);

router.patch(
  "/:id/cancel",
  cancelSOS
);

export default router;