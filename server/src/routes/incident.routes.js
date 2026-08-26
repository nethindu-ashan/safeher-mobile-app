const express = require("express");

const {
  createIncident,
} = require("../controllers/incident.controller");

const router = express.Router();

router.post("/", createIncident);

module.exports = router;