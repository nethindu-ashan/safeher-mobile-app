import express from "express";

import { requireAuth } from "../middleware/auth.middleware.js";

import {
  getTrustedContacts,
  createTrustedContact,
  updateTrustedContact,
  setPrimaryTrustedContact,
  deleteTrustedContact,
} from "../controllers/trustedContact.controller.js";

const router = express.Router();

router.use(requireAuth);

router.get("/", getTrustedContacts);

router.post("/", createTrustedContact);

router.patch("/:id/primary", setPrimaryTrustedContact);

router.patch("/:id", updateTrustedContact);

router.delete("/:id", deleteTrustedContact);

export default router;