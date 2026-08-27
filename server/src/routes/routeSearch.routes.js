/*
  Route Search Routes

  Purpose:
  Define the HTTP endpoint for Route Search.
*/

import express from "express";

import { searchRoute,} from "../controllers/routeSearch.controller.js";

import { validateRouteSearch,} from "../validators/routeSearch.validator.js";


// Create a separate Express router.
const router = express.Router();


/*
  POST /

  Final endpoint will become something like:

  POST /api/route-search

  Request body:

  {
    "startLocation": "SLIIT Malabe Campus",
    "destination": "Colombo Fort"
  }

  Execution order:

  1. validateRouteSearch
  2. searchRoute
*/
router.post("/", validateRouteSearch, searchRoute);


export default router;