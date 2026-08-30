import {
  getNearbySafetyIncidents,
} from "../services/routeSafety.service.js";


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

      message:
        "Nearby safety incidents retrieved successfully.",

      data: {

        /*
          Location used as the center
          of the safety search.
        */
        center: {
          latitude,
          longitude,
        },

        /*
          Search settings.
        */
        radiusKm,
        days,

        /*
          Number of incidents found.
        */
        incidentCount:
          incidents.length,

        /*
          Actual incidents.
        */
        incidents,
      },
    });

  } catch (error) {

    /*
      If database/service fails,
      return server error.
    */
    console.error(
      "Route safety error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to retrieve safety incidents.",
    });
  }
};


export {
  getSafetyIncidents,
};