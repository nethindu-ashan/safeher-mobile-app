import {getNearbySafetyIncidents, getIncidentsNearRoute, compareRouteSafety,} from "../services/routeSafety.service.js";


/*
  Route Safety Controller

  Purpose:
  Receive validated request data,
  call the service layer,
  and send the final API response.
*/
const getSafetyIncidents = async (req, res) => {

  try {

    /*
      These values were already validated
      inside routeSafety.validator.js
    */
    const {
      latitude,
      longitude,
      radiusKm,
      days,
    } = req.routeSafetyData;


    /*
      Call the service layer.

      The service will:
      - calculate search bounds
      - query incidents from database
      - calculate exact distances
      - filter incidents inside radius
    */
    const incidents =
      await getNearbySafetyIncidents({
        latitude,
        longitude,
        radiusKm,
        days,
      });


    /*
      Return successful response.
    */
    return res.status(200).json({

      success: true,
      message: "Nearby safety incidents retrieved successfully.",
      data: {

        // Location used as the center of the safety search.
        center: {
          latitude,
          longitude,
        },

        //  Search settings.
        radiusKm,
        days,
        incidentCount: incidents.length, // Number of incidents found.
        incidents, // Actual incidents
      },
    });

  } catch (error) {

    // If database/service fails, return server error.
    console.error("Route safety error:", error );
    return res.status(500).json({
      success: false,
      message: "Unable to retrieve safety incidents.",
    });
  }
};

// Get incidents associated with one selected route.
const getRouteSafetyIncidents = async (req, res) => {

  try {
    const {encodedPolyline, corridorKm, days,} = req.routeIncidentData;
    const result = await getIncidentsNearRoute({encodedPolyline, corridorKm, days,});

    return res.status(200).json({
      success: true,
      message: "Route safety information retrieved successfully.",
      data: {
        corridorKm,
        days,
        routePointCount: result.routePointCount,
        incidentCount: result.incidents.length,
        incidents: result.incidents,

        // Important SafeHer requirement: community information does not guarantee that a route is safe.
        disclaimer: "Safety information is based on recent community reports and does not guarantee that a route is completely safe.",
      },
    });

  } catch (error) {

    console.error("Route safety information error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve route safety information.",
    });
  }
};


// Compare safety information between multiple route options.
const compareRoutes = async (req, res) => {

  try {

    // Data was already validated by validateRouteComparisonRequest()
    const {routes, corridorKm, days,} = req.routeComparisonData;

    /*
      This will:
      - check each route
      - find incidents near each route
      - create comparison information
    */
    const comparison = await compareRouteSafety({routes, corridorKm, days,});

    return res.status(200).json({
      success: true,
      message: "Route comparison completed successfully.",
      data: comparison,
    
      // Important SafeHer requirement: community information does not guarantee that a route is safe.
      disclaimer: "Route comparison is based on recent community reports and does not guarantee that any route is completely safe.",
    });

  } catch (error) {

    console.error("Route comparison error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to compare route safety information.",
    });
  }
};


export {
  getSafetyIncidents,
  getRouteSafetyIncidents,
  compareRoutes,
};