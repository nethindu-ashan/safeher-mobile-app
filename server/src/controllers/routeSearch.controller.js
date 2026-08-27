/*
  Route Search Controller

  Purpose:
  Receive the Route Search request,
  call the service,
  and return the result to the client.
*/

import {searchRoutes,} from "../services/routeSearch.service.js";


const searchRoute = async (req, res) => {

  try {

    /*
      The validator already checked and cleaned
      these values.
    */
    const {startLocation, destination,} = req.routeSearchData;


    /*
      Ask the service to find route options.
    */
    const routes = await searchRoutes(startLocation, destination);


    /*
      Send a successful HTTP response.
    */
    return res.status(200).json({
      success: true,
      message: "Available routes retrieved successfully.",

      data: {
        startLocation,
        destination,
        routeCount: routes.length,
        routes,
      },
    });

  } catch (error) {

    /*
      Print the real error in the backend terminal.

      This helps us while debugging.
    */
    console.error("Route search error:", error);


    /*
      Send a safe error message to the client.
    */
    return res.status(500).json({
      success: false,
      message: "Unable to search routes.",
    });
  }
};


export {
  searchRoute,
};